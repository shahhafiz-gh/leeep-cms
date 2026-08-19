import type { NextRequest } from 'next/server'

/**
 * Shared request resolution for the admission API routes.
 *
 * Keeps the "browser never calls Frappe" rule from `lib/cms.ts`: the form talks
 * to these same-origin routes, and they forward to Frappe with the school
 * resolved exactly the way the pages resolve it.
 */

const FRAPPE_URL_FALLBACK = process.env.FRAPPE_URL ?? 'http://localhost:8000'

/** Per-school backend for this request, injected by middleware (one site/school). */
export function resolveBackend(req: NextRequest): string {
  const backend = req.headers.get('x-frappe-backend')
  return backend && backend.trim() ? backend.trim().replace(/\/$/, '') : FRAPPE_URL_FALLBACK
}

/**
 * School precedence mirrors `resolveSchool` in `lib/cms.ts`: explicit query
 * override (dev / builder preview URLs carry `?school=` or `?subdomain=`) first,
 * then the `x-school-subdomain` header injected by `middleware.ts` on real
 * subdomain / custom-domain hosts.
 */
export function resolveSchoolForRequest(req: NextRequest): string {
  const sp = req.nextUrl.searchParams
  const fromQuery = (sp.get('school') ?? sp.get('subdomain') ?? '').trim()
  if (fromQuery) return fromQuery
  return (req.headers.get('x-school-subdomain') ?? '').trim()
}
