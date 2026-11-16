import { NextResponse, type NextRequest } from 'next/server'
import { resolveBackend, resolveSchoolForRequest } from '../admissions/_resolve'

const HEADERS = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' }
const UNAVAILABLE = 'Could not submit your request right now. Please try again later or contact the school office.'

function reply(payload: object, status = 200) {
  return NextResponse.json(payload, { status, headers: HEADERS })
}

export async function POST(req: NextRequest) {
  if (!resolveSchoolForRequest(req)) return reply({ ok: false, error: 'Could not determine the school.' }, 400)
  // Reject cross-origin form submissions; the browser uses a same-origin JSON POST.
  const origin = req.headers.get('origin')
  if (origin && origin !== req.nextUrl.origin) return reply({ ok: false, error: 'Invalid request origin.' }, 403)
  let input: unknown
  try {
    const raw = await req.text()
    if (raw.length > 6000) return reply({ ok: false, error: 'Request is too large.' }, 413)
    input = JSON.parse(raw)
  } catch {
    return reply({ ok: false, error: 'Invalid request.' }, 400)
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return reply({ ok: false, error: 'Invalid request.' }, 400)
  const values = input as Record<string, unknown>
  const limits = { student_id: 140, date_of_birth: 10, current_mobile: 24, new_mobile: 24, reason: 1000 }
  const body: Record<string, string> = {}
  for (const [key, limit] of Object.entries(limits)) {
    const value = values[key]
    if (typeof value !== 'string' || !value.trim() || value.length > limit) {
      return reply({ ok: false, error: 'Complete all fields with valid details.' }, 400)
    }
    body[key] = value.trim()
  }
  try {
    const response = await fetch(`${resolveBackend(req)}/api/method/education.education.mobile_change_request.request_mobile_number_change`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(15000),
    })
    if (response.status === 429) return reply({ ok: false, error: 'Too many attempts. Please try again in an hour or contact the school office.' }, 429)
    if (!response.ok) return reply({ ok: false, error: UNAVAILABLE }, 502)
    const json = await response.json()
    const result = json?.message
    // Return only the public contract, never an entire Frappe document or traceback.
    if (result?.ok === false && typeof result.error === 'string') return reply({ ok: false, error: result.error })
    if (result?.ok === true && typeof result.request_id === 'string' && typeof result.message === 'string') {
      return reply({ ok: true, request_id: result.request_id, message: result.message })
    }
    return reply({ ok: false, error: UNAVAILABLE }, 502)
  } catch {
    return reply({ ok: false, error: UNAVAILABLE }, 502)
  }
}
