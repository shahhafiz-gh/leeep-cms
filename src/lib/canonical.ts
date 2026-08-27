import type { SchoolData } from '@/types/school.types'
import { isDevHost, type Tenant } from './tenant'

/**
 * Which host is a school's REAL address.
 *
 * Most schools end up reachable at two: the platform subdomain we give them
 * (`kcs.schools.leeep.in`) and the domain they bought (`kcs.edu`). Both serve
 * byte-identical pages, and to a search engine that is two copies of one site —
 * so the ranking splits between them and neither wins. Naming one canonical is
 * what merges them back into a single result.
 *
 * The school's own domain wins whenever it is verified, because that is the
 * address on its prospectus and its gate. Verification is the gate on the
 * promotion: sending families to a domain whose certificate has not been issued
 * yet is worse than sending them to a working subdomain.
 *
 * Lives apart from `site-page.tsx` so `robots.ts` and `sitemap.ts` can share the
 * rule without pulling in the rendering stack.
 */

/**
 * Vercel reports a domain as `Active` once DNS resolves and its certificate is
 * issued, and the education app mirrors that onto `custom_domain_status`.
 * Anything else — `Pending`, `Error`, empty — means not yet safe to send anyone
 * to, so the platform subdomain stays canonical.
 */
export function isVerifiedDomain(status?: string | null): boolean {
  const value = (status ?? '').trim().toLowerCase()
  return value === 'active' || value === 'verified'
}

/** The host every page of this school should point at. */
export function canonicalHostFor(data: SchoolData, tenant: Tenant): string {
  const custom = (data.config?.custom_domain ?? '').trim().toLowerCase()
  return custom && isVerifiedDomain(data.config?.custom_domain_status) ? custom : tenant.host
}

/** `http` only for local development; everything real is served over TLS. */
export function schemeFor(host: string): 'http' | 'https' {
  return host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https'
}

/** The absolute URL a given page should declare as canonical. */
export function canonicalUrlFor(data: SchoolData, tenant: Tenant, pathname: string): string {
  const host = canonicalHostFor(data, tenant)
  const path = pathname === '/' ? '' : pathname
  return `${schemeFor(host)}://${host}${path}`
}

/**
 * Should this request be redirected to the school's own domain?
 *
 * Returns the target host when the visitor arrived on the platform subdomain of
 * a school whose own domain is verified, and null otherwise. A canonical tag
 * alone tells crawlers which host to prefer; the redirect is what stops people
 * sharing and linking the platform URL, which is the thing that actually keeps
 * two hosts alive in the index.
 */
export function redirectHostFor(data: SchoolData, tenant: Tenant): string | null {
  // Never bounce a development or preview host to production. `localhost` and
  // `*.vercel.app` are not the school's platform subdomain — they are someone
  // working on the site — and redirecting them away means a preview deploy can
  // never be inspected and a local run of a school with a verified domain
  // instantly leaves for the live site.
  if (isDevHost(tenant.host)) return null

  const canonical = canonicalHostFor(data, tenant)
  return canonical && canonical !== tenant.host ? canonical : null
}
