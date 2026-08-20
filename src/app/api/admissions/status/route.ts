import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveBackend, resolveSchoolForRequest } from '../_resolve'

/**
 * Server-side proxy for the PUBLIC application-status lookup.
 *
 * POST, not GET: the lookup takes a date of birth, and a GET would put it in a
 * query string where it is written into browser history, server access logs and
 * any proxy in between. The body keeps it out of all three.
 *
 * The response is whatever Frappe returns, unchanged — the backend already
 * decides what a guest may see (status, class and applied-on date, never a name
 * or a contact detail) and returns one identical message for a wrong number and
 * a wrong date of birth so the endpoint cannot be used to discover which
 * application numbers exist. This route must not add to it.
 */

const METHOD = 'education.education.admission_form.get_application_status'

export async function POST(req: NextRequest) {
  const school = resolveSchoolForRequest(req)
  if (!school) {
    return NextResponse.json({ ok: false, error: 'Could not determine the school.' }, { status: 400 })
  }

  let body: { application?: unknown; date_of_birth?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const application = String(body.application ?? '').trim()
  const dateOfBirth = String(body.date_of_birth ?? '').trim()
  if (!application || !dateOfBirth) {
    return NextResponse.json(
      { ok: false, error: 'Enter your application number and the student’s date of birth.' },
      { status: 400 },
    )
  }

  try {
    const res = await fetch(`${resolveBackend(req)}/api/method/${METHOD}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ application, date_of_birth: dateOfBirth }),
      // A status changes the moment the school moves the application along;
      // a cached answer here would be worse than no answer.
      cache: 'no-store',
    })

    if (!res.ok) {
      // Log the status, never the request body — it carries a date of birth.
      console.error(`[admissions/status] Frappe returned ${res.status} for school="${school}"`)
      return NextResponse.json(
        { ok: false, error: 'Could not check the status right now. Please try again later.' },
        { status: 502 },
      )
    }

    const json = (await res.json()) as { message?: unknown }
    const payload = (json?.message ?? {}) as Record<string, unknown>

    // A backend that answered without `ok` is not a result we can render.
    if (typeof payload.ok !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'Could not check the status right now. Please try again later.' },
        { status: 502 },
      )
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('[admissions/status] lookup failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Could not check the status right now. Please try again later.' },
      { status: 502 },
    )
  }
}

export const dynamic = 'force-dynamic'
