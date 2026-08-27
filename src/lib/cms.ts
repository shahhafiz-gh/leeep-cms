import { createHmac, timingSafeEqual } from 'node:crypto'
import type { SchoolData } from '@/types/school.types'
import { isAllowedBackend, siteTag, type Tenant } from './tenant'
import { placeholderTemplateAData, mockKcgsData } from './mock'

/**
 * LEEEP CMS — the SINGLE data layer for the renderer.
 *
 * Every server-side render gets its content through `getSiteData`. No component
 * fetches Frappe directly and nothing fetches site content from the browser, so
 * there are no CORS calls to the backend.
 *
 * CACHING (this is the point of the module's shape). `getSiteData` takes a
 * `Tenant` resolved from the URL rather than reading `headers()`, because a
 * page that touches a request-scoped API can never be statically rendered. With
 * the tenant arriving as a plain argument, the published read is an ordinary
 * cached `fetch` tagged `site:<backend-host>`, so:
 *
 *   - the school's Frappe is hit once per publish, not once per visitor;
 *   - the rendered HTML is cached at the edge and revalidated on demand;
 *   - the last good page keeps being served while a school's site is down.
 *
 * Frappe calls `POST /api/revalidate` on publish, which calls
 * `revalidateTag(siteTag(backend))` — see `app/api/revalidate/route.ts`.
 *
 * DRAFT reads are never cached: they are per-editor, authenticated, and change
 * on every keystroke of the builder.
 *
 * Backend methods used (do not invent others):
 *   - Content:  education.education.website_builder.get_site?school=&mode=
 */

/** Dotted Frappe method path, kept in one place (env-overridable). */
const GET_SITE_METHOD =
  process.env.FRAPPE_GET_SITE_METHOD ?? 'education.education.website_builder.get_site'

/**
 * How long a published page may serve before Next re-fetches it on its own.
 * On-demand revalidation from Frappe is the PRIMARY freshness mechanism; this
 * is only the backstop for a publish whose webhook never arrived.
 */
const PUBLISHED_TTL_SECONDS = Number(process.env.SITE_REVALIDATE_SECONDS ?? 3600)

export type SiteMode = 'published' | 'draft'

/**
 * The requested host belongs to no school — as opposed to a school whose
 * backend is merely unwell.
 *
 * The distinction decides what the visitor gets, and it has to be drawn
 * carefully now that renders are cached: a 404 is a correct, cacheable answer
 * for a host nobody owns, but caching one for a school that was briefly
 * unreachable would take a real site down until the next publish. So only two
 * unambiguous, permanent signals count as "no such school" — Frappe answering
 * 404, or its hostname not existing in DNS. Timeouts, refused connections and
 * 5xx are treated as outages and re-thrown, which lets Next keep serving the
 * last good render instead.
 */
export class SiteNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SiteNotFoundError'
  }
}

/** Does this thrown value mean the backend hostname does not exist at all? */
function isDnsFailure(err: unknown): boolean {
  const cause = (err as { cause?: { code?: string } })?.cause
  return cause?.code === 'ENOTFOUND'
}

/** Search-params shape passed by Next.js pages (already awaited). */
export type RouteSearchParams = Record<string, string | string[] | undefined>

// ── Draft-preview gating (token, server-side) ──

/**
 * Decide which content variant to request from `searchParams`.
 * `?preview=1&token=<signed>` → `"draft"`; otherwise `"published"`.
 *
 * Only the `/preview` route calls these — the public routes have no query
 * string at all, which is part of what keeps them cacheable.
 */
export function resolvePreviewMode(searchParams?: RouteSearchParams): SiteMode {
  return isEditPreview(searchParams) ? 'draft' : 'published'
}

/** Return the signed token only for a validated editor-preview request. */
export function resolvePreviewToken(searchParams?: RouteSearchParams): string | undefined {
  if (!isEditPreview(searchParams)) return undefined
  const raw = searchParams?.token
  return Array.isArray(raw) ? raw[0] : raw
}

/**
 * Whether the request is an editor PREVIEW — `?preview=1&token=<signed token>`.
 *
 * The token is minted by the authenticated builder (Frappe's
 * `website_builder.get_preview_token`, editor-gated) in the form
 * `<school>:<expiry>:<hmac-sha256(secret, school:expiry)>`. We recompute the
 * HMAC with the shared server-side secret (`PREVIEW_SECRET` — the same value
 * as Frappe's `preview_secret` site config) and accept only an unexpired
 * signature naming the school being previewed. The secret never reaches a
 * browser; leaked preview URLs go stale on expiry.
 *
 * The validated token is also forwarded server-to-server to Frappe when draft
 * content is requested. Frappe validates the same short-lived proof before it
 * returns any unpublished data.
 */
export function isEditPreview(searchParams?: RouteSearchParams): boolean {
  const previewRaw = searchParams?.preview
  if (previewRaw !== '1' && previewRaw !== 'true') return false
  const tokenRaw = searchParams?.token
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw
  const secret = process.env.PREVIEW_SECRET
  if (!token || !secret) return false

  const parts = token.split(':')
  if (parts.length !== 3) return false
  const [school, expiry, signature] = parts
  if (!school || !/^\d+$/.test(expiry)) return false
  if (Number(expiry) * 1000 < Date.now()) return false

  const expected = createHmac('sha256', secret).update(`${school}:${expiry}`).digest('hex')
  const given = Buffer.from(signature)
  const wanted = Buffer.from(expected)
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return false

  // Single-school proof: when the URL names the school it is previewing
  // (the builder always sends ?subdomain=), the token must be FOR that school.
  const subRaw = searchParams?.subdomain ?? searchParams?.school
  const requested = (Array.isArray(subRaw) ? subRaw[0] : subRaw)?.trim()
  return !requested || requested === school
}

// ── Editor navigation (editor preview only) ──

/** Canonical site pages, in the order they should appear in the editor nav. */
const EDITOR_NAV: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Updates', href: '/updates' },
  { label: 'About', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Contact', href: '/contact' },
]

/**
 * Ensure the navigation exposes EVERY standard page in the inline editor, so the
 * admin can reach (and edit) each page from the header — even if the school's
 * own navigation omits some.
 *
 * The school's own entries win for label/children/order; canonical pages it is
 * missing are inserted in the standard order, and any extra custom links the
 * school added are kept after them.
 *
 * ONLY call this when `isEditPreview` is true — the live site keeps exactly the
 * navigation the school configured.
 */
export function withEditorNavigation(data: SchoolData): SchoolData {
  const existing = data.navigation ?? []
  const editorNav = data.config?.extended_pages
    ? [...EDITOR_NAV, { label: 'Facilities', href: '/facilities' }]
    : EDITOR_NAV
  const norm = (href: string) => href.replace(/\/+$/, '') || '/'
  const byHref = new Map(existing.map((item) => [norm(item.href), item]))
  // Canonical pages first — reuse the school's own entry when it has one.
  const ordered = editorNav.map((page) => byHref.get(norm(page.href)) ?? page)
  // Keep any non-standard custom links the school added, after the canonical set.
  const canonical = new Set(editorNav.map((page) => norm(page.href)))
  const extras = existing.filter((item) => !canonical.has(norm(item.href)))
  return { ...data, navigation: [...ordered, ...extras] }
}

// ── Frappe asset URL resolution ──

/**
 * Frappe serves these roots from its OWN origin, but stores them as
 * ROOT-RELATIVE paths in content (e.g. an uploaded logo is `/files/logo.png`).
 * The renderer runs on a DIFFERENT origin, so a bare `/files/...` would resolve
 * against the renderer and 404. We rewrite those to absolute Frappe URLs at read
 * time so the stored blob stays portable.
 *
 * Only `is_private=0` uploads (`/files/`) and bundled `/assets/` are public; we
 * include `/private/files/` for completeness though private files need auth.
 */
const FRAPPE_ASSET_PREFIXES = ['/files/', '/private/files/', '/assets/']

/** Deep-rewrite any root-relative Frappe asset path to an absolute backend URL.
 *
 * Spaces are percent-encoded on the way out: Frappe keeps an uploaded file's
 * original name, so `/files/dpms logo (1).png` is entirely normal, and a raw
 * space is not valid in a URL. Browsers paper over it in `src`/`href`, but
 * anything else fetching the URL (link-preview bots, the favicon in a
 * `<link>`, a fetch from server code) gets a malformed request. Only the space
 * is touched, so an already-encoded path can never be double-encoded.
 */
function absolutizeAssetUrls<T>(node: T, base: string): T {
  if (typeof node === 'string') {
    return (FRAPPE_ASSET_PREFIXES.some((p) => node.startsWith(p))
      ? base + node.replace(/ /g, '%20')
      : node) as unknown as T
  }
  if (Array.isArray(node)) {
    return node.map((n) => absolutizeAssetUrls(n, base)) as unknown as T
  }
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(node)) out[k] = absolutizeAssetUrls(v, base)
    return out as unknown as T
  }
  return node
}

// ── Local fixtures (offline / fallback) ──

/** Pick the local mock that best matches the school slug. */
function pickLocalMock(school: string): SchoolData {
  return school === 'kcgs' || school === 'kcs' ? mockKcgsData : placeholderTemplateAData
}

// ── The single content layer ──

/**
 * Fetch the full `SchoolData` for a tenant.
 *
 * @param tenant  Resolved by `lib/tenant.ts` from the URL — never from headers.
 * @param mode    `"published"` (default) or `"draft"` (editor preview only).
 * @param previewToken  Forwarded to Frappe for a draft read.
 *
 * PUBLISHED reads are cached and tagged so the page they render can live at the
 * edge until the school publishes. DRAFT reads always go to the network.
 *
 * - `USE_LOCAL_DATA=true` → return the local mock fixture; never touches the
 *   network (works fully offline).
 * - On failure it RE-THROWS by default so dev failures are visible. A graceful
 *   fallback to the local mock is available but OPT-IN via `DEMO_FALLBACK=true`.
 *   Note that with the published read cached, an outage no longer takes the
 *   public site down: Next keeps serving the last good render.
 */
export async function getSiteData(
  tenant: Tenant,
  mode: SiteMode = 'published',
  previewToken?: string,
): Promise<SchoolData> {
  if (process.env.USE_LOCAL_DATA === 'true') {
    return pickLocalMock(tenant.slug)
  }

  const backend = tenant.backend.replace(/\/$/, '')
  if (!isAllowedBackend(backend)) {
    throw new Error(`getSiteData: refusing to fetch from disallowed backend "${backend}"`)
  }

  const params = new URLSearchParams({ mode })
  // `school` is optional: one Frappe site per school, so the backend already
  // identifies the site's single website. Sent when known for exactness.
  if (tenant.slug) params.set('school', tenant.slug)
  if (previewToken) params.set('token', previewToken)
  const url = `${backend}/api/method/${GET_SITE_METHOD}?${params.toString()}`

  // Draft is per-editor and changes constantly; published is shared by every
  // visitor and only changes on publish.
  const cacheOptions: RequestInit =
    mode === 'draft'
      ? { cache: 'no-store' }
      : { next: { revalidate: PUBLISHED_TTL_SECONDS, tags: [siteTag(backend)] } }

  try {
    const res = await fetch(url, {
      ...cacheOptions,
      headers: { Accept: 'application/json' },
    })
    if (res.status === 404) {
      throw new SiteNotFoundError(`No School Website behind ${backend} (404)`)
    }
    if (!res.ok) {
      throw new Error(`Frappe returned ${res.status} ${res.statusText} from ${url}`)
    }
    const json = (await res.json()) as { message?: SchoolData }
    if (json?.message == null) {
      throw new Error(`Frappe response missing "message" envelope from ${url}`)
    }
    // Frappe stores asset paths root-relative; resolve them against its own
    // origin so they don't 404 against the renderer's origin.
    return absolutizeAssetUrls(json.message, backend)
  } catch (err) {
    if (err instanceof SiteNotFoundError) throw err
    if (isDnsFailure(err)) {
      throw new SiteNotFoundError(`Backend host for "${tenant.host}" does not resolve`)
    }
    const reason = err instanceof Error ? err.message : String(err)
    if (process.env.DEMO_FALLBACK === 'true') {
      console.warn(
        `[cms] getSiteData failed for host="${tenant.host}" (mode=${mode}); ` +
          `serving local fallback (DEMO_FALLBACK=true). Reason: ${reason}`,
      )
      return pickLocalMock(tenant.slug)
    }
    throw new Error(
      `getSiteData: failed to load site data for host="${tenant.host}" (mode=${mode}): ${reason}`,
    )
  }
}
