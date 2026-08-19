import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveBackend, resolveSchoolForRequest } from '../_resolve'

/**
 * Server-side proxy for the PUBLIC admission form's schema.
 *
 * The form's fields are not written in this repo — they are derived from the
 * school's `Student Applicant` DocType plus its `Admission Form Profile`, so a
 * school that customises the DocType (or hides a field in the admin) sees the
 * change on the website without a redeploy. See
 * `education/education/admission_form.py`.
 *
 *   GET /api/admissions/schema?programs=1        -> classes open for application
 *   GET /api/admissions/schema?program=Nursery   -> the field set for that class
 */

const BASE = 'education.education.admission_form'

export async function GET(req: NextRequest) {
  const school = resolveSchoolForRequest(req)
  if (!school) {
    return NextResponse.json({ ok: false, error: 'Could not determine the school.' }, { status: 400 })
  }

  const sp = req.nextUrl.searchParams
  const wantsPrograms = sp.get('programs') === '1'
  const method = wantsPrograms ? 'get_admission_programs' : 'get_admission_form_schema'

  const query = new URLSearchParams({ school })
  const academicYear = (sp.get('academic_year') ?? '').trim()
  if (academicYear) query.set('academic_year', academicYear)
  if (!wantsPrograms) {
    const program = (sp.get('program') ?? '').trim()
    if (program) query.set('program', program)
    query.set('audience', 'public')
  }

  try {
    const res = await fetch(`${resolveBackend(req)}/api/method/${BASE}.${method}?${query}`, {
      headers: { Accept: 'application/json' },
      // The schema changes whenever the school edits its form; never serve a
      // stale field set to an applicant mid-session.
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`[admissions/schema] Frappe returned ${res.status} for school="${school}"`)
      return NextResponse.json(
        { ok: false, error: 'Could not load the application form. Please try again later.' },
        { status: 502 },
      )
    }
    const json = (await res.json()) as { message?: unknown }
    return NextResponse.json({ ok: true, data: json?.message ?? null })
  } catch (err) {
    console.error('[admissions/schema] proxy failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Could not load the application form. Please try again later.' },
      { status: 502 },
    )
  }
}
