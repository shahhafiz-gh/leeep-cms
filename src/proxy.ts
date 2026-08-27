import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  NO_SLUG,
  PREVIEW_PREFIX,
  SITE_PREFIX,
  isAllowedBackend,
  normalizeHost,
  resolveTenant,
  sitePath,
  type Tenant,
} from '@/lib/tenant'

/**
 * Tenant routing for the multi-school renderer (Next 16 `proxy`, formerly
 * `middleware`).
 *
 * ONE deployment serves every school and each school runs its OWN Frappe site,
 * so every request has to be mapped to a backend. This used to be done by
 * injecting `x-frappe-backend` / `x-school-subdomain` headers and having each
 * page read them back — which quietly made every page uncacheable, because a
 * page that calls `headers()` can never be statically rendered.
 *
 * So the tenant now travels in the URL instead. This proxy REWRITES:
 *
 *   kcs.schools.leeep.in/about  ->  /site/kcs.schools.leeep.in/kcs/about
 *   ingeniousschool.com/about   ->  /site/ingeniousschool.com/-/about
 *   …/about?preview=1&token=…   ->  /preview/<host>/<slug>/about?preview=1&…
 *
 * A rewrite is invisible to the visitor — the address bar keeps the clean URL —
 * but it hands the page its tenant as ordinary `params`, which is what lets the
 * public routes be prerendered and served from the edge cache.
 *
 * The `/preview` branch stays dynamic on purpose: it is authenticated, shows
 * unpublished draft content, and must never be cached or shared between
 * editors.
 *
 * The legacy headers are still injected, because the `/api/admissions/*` route
 * handlers read them (they are request-scoped by nature and are not cached).
 *
 * NOTE: file must be `src/proxy.ts` for Next.js to pick it up — Next 16
 * renamed the `middleware` convention to `proxy`.
 */

/**
 * Static files shipped in `public/`.
 *
 * These MUST be excluded before anything else. Proxy runs ahead of Next's
 * static-file handler, so a rewrite here does not "fall through" to the file —
 * it turns `/assets/kcs/leeep.svg` into `/site/<host>/<slug>/assets/kcs/leeep.svg`,
 * which matches no route and 404s. That took out the "Powered by Leeep" logo in
 * every footer, template B's Canela fonts, and the demo images, all at once.
 *
 * Matched two ways so a file added to `public/` later cannot break the same way:
 * the `/assets/` tree, and any request whose last segment carries a known static
 * extension. The extension list is explicit rather than "anything with a dot",
 * because a content id in `/updates/<id>` is allowed to contain one.
 */
const STATIC_FILE = /\.(?:svg|png|jpe?g|gif|webp|avif|ico|bmp|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|pdf|txt|xml|json|csv|css|js|map|html|webmanifest)$/i

function isStaticAsset(pathname: string): boolean {
  return pathname.startsWith('/assets/') || STATIC_FILE.test(pathname)
}

/** Paths that own their routing and must never be rewritten to a tenant. */
function isReservedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname === '/api' ||
    pathname.startsWith('/demo') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/.well-known/') ||
    // Everything in `public/`, plus the generated robots/sitemap.
    isStaticAsset(pathname)
  )
}

/** Internal prefixes a visitor must not be able to address directly. */
function isInternalPath(pathname: string): boolean {
  return pathname.startsWith(`${SITE_PREFIX}/`) || pathname.startsWith(`${PREVIEW_PREFIX}/`)
}

/**
 * Builder preview override: the builder runs on the school's own Frappe site
 * and passes `?backend=<its origin>` (+ `?subdomain=`/`?school=`) so the shared
 * renderer host (*.vercel.app) knows which per-school site to load. Restricted
 * to our own zones by `isAllowedBackend` so it can't be pointed at an arbitrary
 * URL (SSRF guard).
 */
function previewOverride(request: NextRequest, host: string): Tenant | null {
  const sp = request.nextUrl.searchParams
  const rawBackend = sp.get('backend')
  if (!rawBackend) return null
  const backend = rawBackend.replace(/\/$/, '')
  if (!isAllowedBackend(backend)) return null
  return {
    host,
    backend,
    slug: (sp.get('subdomain') || sp.get('school') || '').trim(),
  }
}

/** Is this request an editor preview? (Validated properly server-side later.) */
function wantsPreview(request: NextRequest): boolean {
  const preview = request.nextUrl.searchParams.get('preview')
  return preview === '1' || preview === 'true'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = normalizeHost(request.headers.get('host'))

  // Someone poking at the internal tree directly. Those paths exist only as
  // rewrite targets; serving them would expose a second URL for every page.
  if (isInternalPath(pathname)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const preview = wantsPreview(request)
  const slugHint = (
    request.nextUrl.searchParams.get('school') ??
    request.nextUrl.searchParams.get('subdomain') ??
    ''
  ).trim()

  const tenant = previewOverride(request, host) ?? (await resolveTenant(host, slugHint))

  // Reserved paths keep their own routing, but the API handlers still need to
  // know which backend this request belongs to.
  if (isReservedPath(pathname)) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-frappe-backend', tenant?.backend ?? '')
    requestHeaders.set('x-school-subdomain', tenant?.slug ?? '')
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // A host that belongs to no school: let the app render its own 404 rather
  // than someone else's site.
  if (!tenant) return NextResponse.next()

  const target = request.nextUrl.clone()
  target.pathname = sitePath(tenant, pathname, preview ? PREVIEW_PREFIX : SITE_PREFIX)
  // The preview route needs the backend explicitly: on the shared *.vercel.app
  // host there is no subdomain to re-derive it from.
  if (preview) target.searchParams.set('backend', tenant.backend)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-frappe-backend', tenant.backend)
  requestHeaders.set('x-school-subdomain', tenant.slug || NO_SLUG)

  return NextResponse.rewrite(target, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    /*
     * Everything except the static assets Next serves itself. `/api` IS matched
     * (the handlers need the backend header) but is never rewritten.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
