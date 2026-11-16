import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveBackend, resolveSchoolForRequest } from '../../admissions/_resolve'

/**
 * Server-side proxy for a custom page's form block (Feedback, Alumni
 * Registration, ...). Frappe checks the answers against the PUBLISHED form on
 * that page, so this route only shapes the request and keeps Frappe's internals
 * out of the visitor's reply.
 */

const SUBMIT_METHOD = 'education.education.website_builder.submit_website_form'
const MAX_BODY_BYTES = 40_000

export async function POST(req: NextRequest) {
  const school = resolveSchoolForRequest(req)
  if (!school) {
    return NextResponse.json({ ok: false, error: 'Could not determine the school.' }, { status: 400 })
  }

  const declaredLength = Number(req.headers.get('content-length') ?? '')
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'Your answers are too long.' }, { status: 413 })
  }

  let payload: { page?: unknown; form?: unknown; values?: unknown }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }
  if (typeof payload.page !== 'string' || !payload.values || typeof payload.values !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }

  try {
    const res = await fetch(`${resolveBackend(req)}/api/method/${SUBMIT_METHOD}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        school,
        page: payload.page,
        form: typeof payload.form === 'string' ? payload.form : '0',
        values: payload.values,
      }),
      cache: 'no-store',
    })
    const json = (await res.json().catch(() => null)) as
      | { message?: { ok?: boolean; message?: string }; _server_messages?: string }
      | null

    if (!res.ok) {
      // Validation messages ("Email is required") are the visitor's to fix;
      // anything else could carry a traceback and stays in the server log.
      const message = firstServerMessage(json?._server_messages)
      if ((res.status === 417 || res.status === 429) && message) {
        return NextResponse.json({ ok: false, error: message }, { status: 400 })
      }
      console.error(`[forms/submit] Frappe returned ${res.status} for school="${school}"`)
      return NextResponse.json(
        { ok: false, error: 'Could not send the form. Please try again later.' },
        { status: 502 },
      )
    }
    return NextResponse.json({ ok: true, message: json?.message?.message ?? null })
  } catch (err) {
    console.error('[forms/submit] proxy failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Could not send the form. Please try again later.' },
      { status: 502 },
    )
  }
}

/** Frappe packs thrown messages as a JSON array of JSON strings. */
function firstServerMessage(raw: string | undefined): string | null {
  if (!raw) return null
  try {
    for (const entry of JSON.parse(raw) as string[]) {
      const parsed = typeof entry === 'string' ? JSON.parse(entry) : entry
      const message = (parsed as { message?: string })?.message
      if (message) return String(message).replace(/<[^>]*>/g, '').trim()
    }
  } catch {
    /* not the shape we expected */
  }
  return null
}
