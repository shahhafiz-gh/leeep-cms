/**
 * LEEEP CMS — tenant resolution.
 *
 * ONE deployment serves every school, and each school runs its OWN Frappe site,
 * so every request has to be mapped to a backend. This module is the single
 * place that mapping lives, and it is deliberately free of request-scoped APIs
 * (`headers()`, `cookies()`) so that PAGES can call it without opting out of
 * static rendering — which is the whole reason the public site can be cached at
 * the edge instead of re-rendered per visitor.
 *
 * The tenant travels in the URL instead of in a header. `middleware.ts` rewrites
 *
 *     https://kcs.schools.leeep.in/about   ->  /site/kcs.schools.leeep.in/kcs/about
 *     https://ingeniousschool.com/about    ->  /site/ingeniousschool.com/-/about
 *
 * and the page reads it back from `params`. The visitor never sees the internal
 * path (a rewrite, not a redirect).
 *
 * Two segments, because they answer two different questions:
 *   - `host`  the PUBLIC host. Always present, and the only reliable key: the
 *             central custom-domain directory returns a backend but NO slug.
 *   - `slug`  the School Website slug, or `-` when unknown. Optional by design —
 *             with one Frappe site per school, `get_site` resolves that site's
 *             single website on its own. It exists for the `?school=` dev
 *             override on localhost, where there are no real subdomains.
 *
 * Edge-safe: `middleware.ts` imports this, so nothing here may pull in
 * `node:crypto` or any other Node-only builtin.
 */

/** Zone that carries school subdomains, e.g. `kcs.schools.leeep.in`. */
const PLATFORM_DOMAIN = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? 'schools.leeep.in').toLowerCase()
/** Zone the per-school Frappe sites live under, e.g. `kcs.leeep.in`. */
const FRAPPE_BASE_DOMAIN = (process.env.FRAPPE_BASE_DOMAIN ?? 'leeep.in').toLowerCase()
/** Dev / localhost fallback backend. */
const FRAPPE_URL = process.env.FRAPPE_URL ?? 'http://localhost:8000'
/** Central directory that maps a custom domain to its owner's backend. */
const FRAPPE_DIRECTORY_URL = process.env.FRAPPE_DIRECTORY_URL ?? ''
const RESOLVE_DOMAIN_METHOD =
  process.env.FRAPPE_RESOLVE_DOMAIN_METHOD ?? 'leeep.leeep.website_directory.resolve_domain'

/** Internal path prefixes. Public URLs never contain these. */
export const SITE_PREFIX = '/site'
export const PREVIEW_PREFIX = '/preview'
/** `slug` segment when the slug is unknown (custom domains, bare dev hosts). */
export const NO_SLUG = '-'

export interface Tenant {
  /** Public host the visitor asked for. */
  host: string
  /** Origin of the school's own Frappe site, no trailing slash. */
  backend: string
  /** School Website slug, or '' when unknown (the backend alone is enough). */
  slug: string
}

/** Strip scheme, path, port and trailing dot from a Host header. */
export function normalizeHost(host: string | null | undefined): string {
  return (host ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .split(':')[0]
    .replace(/\.$/, '')
}

/** Hosts we treat as local development rather than as a real tenant. */
export function isDevHost(host: string): boolean {
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === '127.0.0.1' ||
    host.endsWith('.vercel.app')
  )
}

/**
 * Is this a backend we are willing to fetch from? The backend can arrive from
 * the URL (an internal rewrite, but URLs are user-supplied), so it is checked
 * against our own zones before any request is made — an SSRF guard, the same
 * rule the builder-preview override has always applied.
 */
export function isAllowedBackend(backend: string): boolean {
  let hostname = ''
  try {
    hostname = new URL(backend).hostname.toLowerCase()
  } catch {
    return false
  }
  return (
    hostname === FRAPPE_BASE_DOMAIN ||
    hostname.endsWith(`.${FRAPPE_BASE_DOMAIN}`) ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  )
}

/** `kcs.schools.leeep.in` -> `kcs`; anything else -> ''. */
export function platformLabel(host: string): string {
  if (!host.endsWith(`.${PLATFORM_DOMAIN}`)) return ''
  return host.slice(0, -`.${PLATFORM_DOMAIN}`.length).split('.').pop() ?? ''
}

/** The Frappe origin for a platform subdomain label. Deterministic, no lookup. */
export function backendForLabel(label: string): string {
  return `https://${label}.${FRAPPE_BASE_DOMAIN}`
}

/**
 * Resolve a custom domain through the central directory (admin.leeep.in).
 *
 * The directory returns `{ backend, host }` and deliberately NOT a slug — it
 * keys on the domain, and the backend it hands back already identifies exactly
 * one school. Cached for five minutes so a busy domain doesn't re-ask on every
 * render; `revalidateTag('domain:<host>')` clears it early if a school moves.
 */
const CUSTOM_DOMAIN_TTL_MS = 60_000
const customDomainMemo = new Map<string, { value: Tenant | null; at: number }>()

async function resolveCustomDomain(host: string): Promise<Tenant | null> {
  if (!FRAPPE_DIRECTORY_URL) return null

  // In-process memo on top of the fetch cache: middleware runs on the edge
  // runtime, where the Data Cache does not apply, so without this a busy custom
  // domain would re-ask the directory on every single request.
  const memo = customDomainMemo.get(host)
  if (memo && Date.now() - memo.at < CUSTOM_DOMAIN_TTL_MS) return memo.value

  const url =
    `${FRAPPE_DIRECTORY_URL.replace(/\/$/, '')}/api/method/${RESOLVE_DOMAIN_METHOD}` +
    `?host=${encodeURIComponent(host)}`
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300, tags: [`domain:${host}`] },
    })
    let value: Tenant | null = null
    if (res.ok) {
      const json = (await res.json()) as { message?: { backend?: string } | null }
      const backend = (json?.message?.backend ?? '').replace(/\/$/, '')
      if (backend && isAllowedBackend(backend)) value = { host, backend, slug: '' }
    }
    customDomainMemo.set(host, { value, at: Date.now() })
    return value
  } catch {
    // Do NOT memoise a transient network failure — a school's site would stay
    // unreachable for a full minute after one blip.
    return null
  }
}

/**
 * Map a public host to its tenant. Returns null when the host belongs to no
 * school, so the caller can 404 rather than render someone else's site.
 *
 * `slugHint` is the `?school=` dev override; it is honoured only on dev hosts,
 * where there are no real subdomains to resolve.
 */
export async function resolveTenant(host: string, slugHint = ''): Promise<Tenant | null> {
  const clean = normalizeHost(host)
  if (!clean) return null

  if (isDevHost(clean)) {
    // `<slug>.localhost` names the bench site directly; otherwise fall back to
    // the configured dev backend and let `?school=` pick the school.
    const label = clean.endsWith('.localhost')
      ? clean.slice(0, -'.localhost'.length).split('.').pop() ?? ''
      : ''
    return {
      host: clean,
      backend: FRAPPE_URL.replace(/\/$/, ''),
      slug: slugHint || label || process.env.NEXT_PUBLIC_DEV_SUBDOMAIN || '',
    }
  }

  const label = platformLabel(clean)
  if (label) return { host: clean, backend: backendForLabel(label), slug: label }

  // The bare platform apex belongs to no school.
  if (clean === PLATFORM_DOMAIN) return null

  return resolveCustomDomain(clean)
}

/**
 * Rebuild a tenant from the path segments `middleware.ts` wrote, WITHOUT any
 * request-scoped API — this is what keeps a page statically renderable.
 *
 * Platform subdomains and dev hosts are re-derived arithmetically. A custom
 * domain still needs the directory, but that lookup is a cached fetch, so it
 * costs nothing on a cache hit and does not make the page dynamic.
 */
export async function tenantFromParams(host: string, slug: string): Promise<Tenant | null> {
  const decodedHost = normalizeHost(decodeURIComponent(host))
  const decodedSlug = slug === NO_SLUG ? '' : decodeURIComponent(slug)
  return resolveTenant(decodedHost, decodedSlug)
}

/** The cache tag every read of a school's content carries. */
export function siteTag(backend: string): string {
  let hostname = backend
  try {
    hostname = new URL(backend).hostname.toLowerCase()
  } catch {
    /* keep the raw value — a malformed backend simply gets its own tag */
  }
  return `site:${hostname}`
}

/** Build the internal path for a tenant + public pathname. */
export function sitePath(tenant: Tenant, pathname: string, prefix = SITE_PREFIX): string {
  const slug = tenant.slug ? encodeURIComponent(tenant.slug) : NO_SLUG
  const rest = pathname === '/' ? '' : pathname
  return `${prefix}/${encodeURIComponent(tenant.host)}/${slug}${rest}`
}
