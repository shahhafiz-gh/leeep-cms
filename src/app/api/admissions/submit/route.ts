import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveBackend, resolveSchoolForRequest } from '../_resolve'
import { MAX_TOTAL_UPLOAD_BYTES, MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from '@/shared/admission-schema'

/**
 * Server-side proxy for schema-driven admission submissions.
 *
 * Unlike the legacy `/api/admissions/apply` route (which filed an opaque blob
 * into `Website Admission Application`), this one lands a real
 * **Student Applicant**, so the class's own criteria — age window, application
 * fee, applicant naming series — apply to a website application exactly as they
 * do to one taken at the counter.
 *
 * Attachments arrive as `file_<fieldname>` parts, matching the Attach fields on
 * the DocType.
 */

const SUBMIT_METHOD = 'education.education.admission_form.submit_admission_application'

/** Only the Attach-field parts the backend knows how to place. */
const FILE_PART = /^file_[a-z0-9_]{1,140}$/

export async function POST(req: NextRequest) {
  const school = resolveSchoolForRequest(req)
  if (!school) {
    return NextResponse.json({ ok: false, error: 'Could not determine the school.' }, { status: 400 })
  }

  // Reject an oversized submission from its Content-Length BEFORE `formData()`
  // buffers the body — the upload boxes cap every file in the browser, but that
  // check is the visitor's to skip and a hand-rolled POST never runs it.
  const declaredLength = Number(req.headers.get('content-length') ?? '')
  if (Number.isFinite(declaredLength) && declaredLength > MAX_TOTAL_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: `Your documents are too large. Each file must be under ${MAX_UPLOAD_MB}MB.` },
      { status: 413 },
    )
  }

  let body: FormData | string
  let contentTypeHeader: Record<string, string> = {}
  try {
    if ((req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
      const incoming = await req.formData()
      const data = incoming.get('data')
      if (typeof data !== 'string') {
        return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
      }
      const out = new FormData()
      out.set('school', school)
      out.set('data', data)
      const program = incoming.get('program')
      if (typeof program === 'string') out.set('program', program)
      const academicYear = incoming.get('academic_year')
      if (typeof academicYear === 'string') out.set('academic_year', academicYear)

      let totalBytes = data.length
      for (const [key, value] of incoming.entries()) {
        if (FILE_PART.test(key) && value instanceof File && value.size > 0) {
          // The only size checks a visitor cannot bypass, so nothing enormous
          // reaches Frappe however the request was built.
          if (value.size > MAX_UPLOAD_BYTES) {
            return NextResponse.json(
              { ok: false, error: `"${value.name}" is larger than ${MAX_UPLOAD_MB}MB. Please upload a smaller file.` },
              { status: 413 },
            )
          }
          totalBytes += value.size
          if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
            return NextResponse.json(
              { ok: false, error: 'Your documents are too large in total. Please upload smaller files.' },
              { status: 413 },
            )
          }
          out.append(key, value, value.name)
        }
      }
      body = out // fetch sets the multipart boundary header itself
    } else {
      const json = (await req.json()) as Record<string, unknown>
      body = JSON.stringify({ school, ...json })
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
    const json = (await res.json().catch(() => null)) as
      | { message?: { ok?: boolean; applicant?: string; message?: string }; exception?: string; _server_messages?: string }
      | null

    if (!res.ok) {
      // Validation failures ("Not eligible for admission in this class…") are
      // the applicant's to see and act on; anything else could carry a
      // traceback, so it stays in the server log.
      const message = firstServerMessage(json?._server_messages)
      if (res.status === 417 && message) {
        return NextResponse.json({ ok: false, error: message }, { status: 400 })
      }
      console.error(`[admissions/submit] Frappe returned ${res.status} for school="${school}"`)
      return NextResponse.json(
        { ok: false, error: 'Could not submit your application. Please try again later.' },
        { status: 502 },
      )
    }
    return NextResponse.json({
      ok: true,
      applicant: json?.message?.applicant ?? null,
      message: json?.message?.message ?? null,
    })
  } catch (err) {
    console.error('[admissions/submit] proxy failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Could not submit your application. Please try again later.' },
      { status: 502 },
    )
  }
}

/** Frappe packs thrown messages as a JSON array of JSON strings. */
function firstServerMessage(raw: string | undefined): string | null {
  if (!raw) return null
  try {
    const entries = JSON.parse(raw) as string[]
    for (const entry of entries) {
      const parsed = typeof entry === 'string' ? JSON.parse(entry) : entry
      const message = (parsed as { message?: string })?.message
      if (message) return String(message).replace(/<[^>]*>/g, '').trim()
    }
  } catch {
    /* not the shape we expected — fall through to the generic message */
  }
  return null
}
