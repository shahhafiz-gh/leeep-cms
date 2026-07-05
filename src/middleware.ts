import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Tenant resolution for the multi-school renderer. ONE Vercel deployment serves
 * every school, but each school runs its OWN Frappe site (one site per school),
 * so a request must be routed to the right BACKEND, not just the right slug.
 *
 * This middleware runs on every request and injects two headers the app reads:
 *   - `x-frappe-backend`   the school's Frappe site URL to fetch content from.
 *   - `x-school-subdomain` the school slug/label (identity; may be empty).
 *
 * Host shapes:
 *   1. Platform subdomain  <label>.<PLATFORM_DOMAIN>  (e.g. kcs.schools.leeep.in)
 *      -> backend = https://<label>.<FRAPPE_BASE_DOMAIN>  (e.g. kcs.leeep.in).
 *      DETERMINISTIC, no registry: the label IS the school's Frappe subdomain.
 *   2. Custom domain       www.stpauls.org
 *      -> looked up via FRAPPE_DIRECTORY_URL's `resolve_domain` (a service that
 *         aggregates host->backend across schools). Unresolved if not configured.
 *   3. localhost / *.vercel.app (dev + raw deploy URL)
 *      -> backend = FRAPPE_URL; `?school=<slug>` override drives the slug.
 *
 * NOTE: file must be `src/middleware.ts` for Next.js to pick it up.
 */

const PLATFORM_DOMAIN = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? 'schools.leeep.in').toLowerCase()
// The zone the per-school Frappe sites live under (kcs.leeep.in, iei.leeep.in…).
const FRAPPE_BASE_DOMAIN = (process.env.FRAPPE_BASE_DOMAIN ?? 'leeep.in').toLowerCase()
// Dev / localhost fallback backend.
const FRAPPE_URL = process.env.FRAPPE_URL ?? 'http://localhost:8000'
// Optional aggregator for custom-domain -> backend resolution (per-site model).
const FRAPPE_DIRECTORY_URL = process.env.FRAPPE_DIRECTORY_URL ?? ''
// Central directory lives on the leeep app (admin.leeep.in); override if it moves.
const RESOLVE_DOMAIN_METHOD =
  process.env.FRAPPE_RESOLVE_DOMAIN_METHOD ?? 'leeep.leeep.website_directory.resolve_domain'

type Resolved = { backend: string; subdomain: string }

// Small in-process cache so a busy custom domain doesn't hit the directory every request.
const CUSTOM_DOMAIN_TTL_MS = 60_000
const customDomainCache = new Map<string, { value: Resolved; at: number }>()

async function resolveCustomDomain(host: string): Promise<Resolved> {
  if (!FRAPPE_DIRECTORY_URL) return { backend: '', subdomain: '' }
  const cached = customDomainCache.get(host)
  if (cached && Date.now() - cached.at < CUSTOM_DOMAIN_TTL_MS) return cached.value
  try {
    const url = `${FRAPPE_DIRECTORY_URL.replace(/\/$/, '')}/api/method/${RESOLVE_DOMAIN_METHOD}?host=${encodeURIComponent(host)}`
    const res = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } })
    if (!res.ok) return { backend: '', subdomain: '' }
    const json = (await res.json()) as { message?: { slug?: string; backend?: string } | null }
    const value: Resolved = {
      backend: json?.message?.backend ?? '',
      subdomain: json?.message?.slug ?? '',
    }
    customDomainCache.set(host, { value, at: Date.now() })
    return value
  } catch {
    return { backend: '', subdomain: '' }
  }
}

async function resolve(host: string): Promise<Resolved> {
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.vercel.app') || host === '127.0.0.1') {
    // Dev / raw deploy URL: single dev backend; `?school=` override drives slug.
    const sub = host.endsWith('.localhost')
      ? host.slice(0, -'.localhost'.length).split('.').pop() ?? ''
      : (process.env.NEXT_PUBLIC_DEV_SUBDOMAIN ?? '')
    return { backend: FRAPPE_URL, subdomain: sub }
  }
  if (host === PLATFORM_DOMAIN) {
    // Bare platform apex — no specific school.
    return { backend: '', subdomain: '' }
  }
  if (host.endsWith(`.${PLATFORM_DOMAIN}`)) {
    // Platform subdomain -> the label is the school's Frappe subdomain.
    const label = host.slice(0, -`.${PLATFORM_DOMAIN}`.length).split('.').pop() ?? ''
    return { backend: label ? `https://${label}.${FRAPPE_BASE_DOMAIN}` : '', subdomain: label }
  }
  // Custom domain the school pointed at us.
  return resolveCustomDomain(host)
}

export default async function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0]
  const { backend, subdomain } = await resolve(host)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-frappe-backend', backend)
  requestHeaders.set('x-school-subdomain', subdomain)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
}
