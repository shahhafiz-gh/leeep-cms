import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Server-side proxy for PUBLIC admission-form submissions.
 *
 * Keeps the "browser never calls Frappe" rule from `lib/cms.ts`: the form posts
 * here (same origin), and this route forwards to the guest-whitelisted Frappe
 * method with the school resolved the same way pages resolve it.
 */

const FRAPPE_URL_FALLBACK = process.env.FRAPPE_URL ?? 'http://localhost:8000'
const SUBMIT_METHOD =
  process.env.FRAPPE_SUBMIT_APPLICATION_METHOD ??
  'education.education.website_builder.submit_admission_application'

/** Per-school backend for this request, injected by middleware (one site/school). */
function resolveBackend(req: NextRequest): string {
  const backend = req.headers.get('x-frappe-backend')
  return backend && backend.trim() ? backend.trim().replace(/\/$/, '') : FRAPPE_URL_FALLBACK
}

/**
 * School precedence mirrors `resolveSchool` in `lib/cms.ts`:
 * explicit query override (dev / builder preview URLs carry `?school=` or
 * `?subdomain=`) first, then the `x-school-subdomain` header injected by
 * `middleware.ts` on real subdomain / custom-domain hosts.
 */
function resolveSchoolForRequest(req: NextRequest): string {
  const sp = req.nextUrl.searchParams
  const fromQuery = (sp.get('school') ?? sp.get('subdomain') ?? '').trim()
  if (fromQuery) return fromQuery
  return (req.headers.get('x-school-subdomain') ?? '').trim()
}

export async function POST(req: NextRequest) {
  const school = resolveSchoolForRequest(req)
  if (!school) {
    return NextResponse.json({ ok: false, error: 'Could not determine the school.' }, { status: 400 })
  }

  // The form posts multipart (payload JSON + optional document files); a plain
  // JSON body (no files) is also accepted. Either way Frappe gets one request.
  let body: FormData | string
  let contentTypeHeader: Record<string, string> = {}
  try {
    if ((req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
      const incoming = await req.formData()
      const application = incoming.get('application')
      if (typeof application !== 'string') {
        return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
      }
      const out = new FormData()
      out.set('school', school)
      out.set('application', application)
      for (const [key, value] of incoming.entries()) {
        // Base document slots (`file_*`) plus school-defined file fields
        // (`custom_file_<i>`); anything else is not a known file part.
        const isFilePart = key.startsWith('file_') || /^custom_file_\d+$/.test(key)
        if (isFilePart && value instanceof File && value.size > 0) {
          out.append(key, value, value.name)
        }
      }
      body = out // fetch sets the multipart boundary header itself
    } else {
      body = JSON.stringify({ school, application: await req.json() })
      contentTypeHeader = { 'Content-Type': 'application/json' }
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }

  try {
    const res = await fetch(`${resolveBackend(req)}/api/method/${SUBMIT_METHOD}`, {
      method: 'POST',
      headers: { Accept: 'application/json', ...contentTypeHeader },
      body,
      cache: 'no-store',
    })
    if (!res.ok) {
      // Don't leak Frappe's error envelope (may include tracebacks) to visitors.
      console.error(`[admissions/apply] Frappe returned ${res.status} for school="${school}"`)
      return NextResponse.json(
        { ok: false, error: 'Could not submit your application. Please try again later.' },
        { status: 502 },
      )
    }
    const json = (await res.json()) as { message?: { ok?: boolean; application?: string | number } }
    return NextResponse.json({ ok: true, application: json?.message?.application ?? null })
  } catch (err) {
    console.error('[admissions/apply] proxy failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Could not submit your application. Please try again later.' },
      { status: 502 },
    )
  }
}
