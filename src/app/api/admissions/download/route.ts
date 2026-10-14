import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveBackend, resolveSchoolForRequest } from '../_resolve'

/**
 * Server-side proxy for the PUBLIC application-form download.
 *
 * GET with a token, not POST with a date of birth: the status lookup has already
 * checked number + date of birth and handed back a short-lived random token that
 * stands for exactly one application. Putting that token in a link is harmless —
 * it carries no personal data and expires within the half hour — and a plain link
 * is what lets the browser save or open the PDF natively.
 *
 * Frappe decides everything else at download time: whether the school still
 * offers downloads for this class, and which print format to use.
 */

const METHOD = 'education.education.admission_form.download_application_form'

export async function GET(req: NextRequest) {
  const school = resolveSchoolForRequest(req)
  if (!school) {
    return NextResponse.json({ ok: false, error: 'Could not determine the school.' }, { status: 400 })
  }

  const token = (req.nextUrl.searchParams.get('token') ?? '').trim()
  // Tokens are generate_hash(32): lowercase hex. Anything else never reaches Frappe.
  if (!/^[0-9a-f]{32}$/.test(token)) {
    return expired()
  }

  try {
    const res = await fetch(
      `${resolveBackend(req)}/api/method/${METHOD}?token=${encodeURIComponent(token)}`,
      { headers: { Accept: 'application/pdf' }, cache: 'no-store' },
    )

    if (res.status === 403) return expired()

    const contentType = res.headers.get('content-type') ?? ''
    if (!res.ok || !contentType.includes('application/pdf')) {
      // Log the status, never the token — it is a bearer credential while it lives.
      console.error(`[admissions/download] Frappe returned ${res.status} for school="${school}"`)
      return NextResponse.json(
        { ok: false, error: 'Could not prepare the application form right now. Please try again later.' },
        { status: 502 },
      )
    }

    const filename = filenameFrom(res.headers.get('content-disposition')) ?? 'Application.pdf'
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
        // A filled-in admission form: never let a shared cache keep a copy.
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('[admissions/download] download failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Could not prepare the application form right now. Please try again later.' },
      { status: 502 },
    )
  }
}

function expired() {
  return NextResponse.json(
    { ok: false, error: 'This download link has expired. Please check your application status again.' },
    { status: 403 },
  )
}

function filenameFrom(disposition: string | null): string | null {
  const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
  return match ? decodeURIComponent(match[1]) : null
}

export const dynamic = 'force-dynamic'
