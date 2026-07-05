import { cache } from 'react'
import { headers } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'
import type { SchoolData, WebsiteIdentity } from '@/types/school.types'
import { placeholderTemplateAData, mockKcgsData } from './mock'

/**
 * LEEEP CMS — the SINGLE data layer for the renderer.
 *
 * Every server-side render gets its content through `getSiteData`. No component
 * fetches Frappe directly and nothing fetches site content from the browser, so
 * there are no CORS calls to the backend. School resolution and draft-preview
 * gating also live here so the rules exist in exactly one place.
 *
 * Backend methods used (do not invent others):
 *   - Content:  education.education.website_builder.get_site?school=&mode=
 *   - Identity: education.education.api.get_website_registration
 */

// ── Config ──

/**
 * Base URL of the Frappe backend. One Frappe site PER SCHOOL, so the backend is
 * per-request: `middleware.ts` resolves the host to the school's own site and
 * injects it as `x-frappe-backend`. This env is only the dev/localhost fallback.
 */
const FRAPPE_URL_FALLBACK = process.env.FRAPPE_URL ?? 'http://localhost:8000'

/** The per-school backend for THIS request (from middleware), or the fallback. */
async function resolveBackend(): Promise<string> {
  const backend = (await headers()).get('x-frappe-backend')
  return backend && backend.trim() ? backend.trim().replace(/\/$/, '') : FRAPPE_URL_FALLBACK
}

/** Dotted Frappe method paths, kept in one place (env-overridable). */
const GET_SITE_METHOD =
  process.env.FRAPPE_GET_SITE_METHOD ?? 'education.education.website_builder.get_site'
const GET_IDENTITY_METHOD =
  process.env.FRAPPE_GET_IDENTITY_METHOD ?? 'education.education.api.get_website_registration'

export type SiteMode = 'published' | 'draft'

/** Search-params shape passed by Next.js pages (already awaited). */
export type RouteSearchParams = Record<string, string | string[] | undefined>

/** Minimal view of `headers()` — just the `.get` we need. */
interface HeaderReader {
  get(name: string): string | null
}

// ── School resolution (ONE place) ──

/**
 * Resolve which school to render. Precedence:
 *
 *   1. PRIMARY — the school slug resolved from the request host by `middleware.ts`
 *      and injected as the `x-school-subdomain` header (platform subdomain OR a
 *      custom domain looked up in Frappe). This is how EVERY page resolves in
 *      real (non-localhost) environments.
 *   2. DEV OVERRIDE — on localhost/dev ONLY, a `?school=<slug>` query param wins,
 *      because there are no real subdomains on localhost. Ignored in production.
 */
export function resolveSchool(
  headersList: HeaderReader,
  searchParams?: RouteSearchParams,
): string {
  const subdomain = headersList.get('x-school-subdomain') ?? ''

  const host = headersList.get('host') ?? ''
  const devOverrideAllowed =
    process.env.NODE_ENV !== 'production' ||
    host.includes('localhost') ||
    host.startsWith('127.0.0.1') ||
    // Raw Vercel deploy URLs (<project>-<hash>.vercel.app) carry no school
    // subdomain, so allow `?school=<slug>` there for testing a live deploy.
    host.endsWith('.vercel.app')

  if (devOverrideAllowed) {
    const raw = searchParams?.school
    const override = Array.isArray(raw) ? raw[0] : raw
    if (override && override.trim() !== '') return override.trim()
  }

  return subdomain
}

// ── Draft-preview gating (token, server-side) ──

/**
 * Decide which content variant to request from `searchParams`.
 * `?preview=1&token=<PREVIEW_SECRET>` → `"draft"`; otherwise `"published"`.
 * The secret is read server-side and never sent to the browser; the check is
 * per-request (no cookie/session).
 */
export function resolvePreviewMode(searchParams?: RouteSearchParams): SiteMode {
  return isEditPreview(searchParams) ? 'draft' : 'published'
}

/**
 * Whether the request is an editor PREVIEW — `?preview=1&token=<signed token>`.
 * This is the SAME token mechanism as `resolvePreviewMode`; it is exposed
 * separately so the inline-edit layer can be gated on it WITHOUT forcing the
 * content fetch into `draft` mode.
 *
 * The token is minted by the authenticated builder (Frappe's
 * `website_builder.get_preview_token`, editor-gated) in the form
 * `<school>:<expiry>:<hmac-sha256(secret, school:expiry)>`. We recompute the
 * HMAC with the shared server-side secret (`PREVIEW_SECRET` — the same value
 * as Frappe's `preview_secret` site config) and accept only an unexpired
 * signature naming the school being previewed. The secret never reaches a
 * browser; leaked preview URLs go stale on expiry.
 *
 * Why decoupled from the content fetch: fetching draft content requires
 * server-side auth to Frappe (the editor's session), which is wired in a later
 * step. Until then the editor preview renders PUBLISHED content with the edit
 * layer on top — capture only, nothing is saved.
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
 * own navigation omits some (e.g. Updates / Admissions are missing from this
 * school's Frappe nav, so they never appear in the menu).
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
  const norm = (href: string) => href.replace(/\/+$/, '') || '/'
  const byHref = new Map(existing.map((item) => [norm(item.href), item]))
  // Canonical pages first — reuse the school's own entry when it has one.
  const ordered = EDITOR_NAV.map((page) => byHref.get(norm(page.href)) ?? page)
  // Keep any non-standard custom links the school added, after the canonical set.
  const canonical = new Set(EDITOR_NAV.map((page) => norm(page.href)))
  const extras = existing.filter((item) => !canonical.has(norm(item.href)))
  return { ...data, navigation: [...ordered, ...extras] }
}

// ── Frappe asset URL resolution ──

/**
 * Frappe serves these roots from its OWN origin (FRAPPE_URL), but stores them as
 * ROOT-RELATIVE paths in content (e.g. an uploaded logo is `/files/logo.png`,
 * the demo emblem is `/assets/education/leeep/logo.svg`). The renderer runs on a
 * DIFFERENT origin, so a bare `/files/...` would resolve against the renderer
 * (localhost:3000) and 404. We rewrite those to absolute Frappe URLs at read
 * time so the stored blob stays portable (prod just changes FRAPPE_URL).
 *
 * Only `is_private=0` uploads (`/files/`) and bundled `/assets/` are public; we
 * include `/private/files/` for completeness though private files need auth.
 */
const FRAPPE_ASSET_PREFIXES = ['/files/', '/private/files/', '/assets/']

/** Deep-rewrite any root-relative Frappe asset path to an absolute FRAPPE_URL. */
function absolutizeAssetUrls<T>(node: T, base: string): T {
  if (typeof node === 'string') {
    return (FRAPPE_ASSET_PREFIXES.some((p) => node.startsWith(p))
      ? base + node
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
 * Fetch the full `SchoolData` for a school.
 *
 * @param school  School slug (resolve it with `resolveSchool`).
 * @param mode    `"published"` (default) or `"draft"` (from `resolvePreviewMode`).
 *
 * - `USE_LOCAL_DATA=true` → return the local mock fixture; never touches the
 *   network (works fully offline).
 * - Otherwise fetch `GET /api/method/<get_site>?school=&mode=` server-side with
 *   `cache: "no-store"` and unwrap Frappe's `{ message }` envelope.
 * - On failure it RE-THROWS by default so dev failures are visible. A graceful
 *   fallback to the local mock is available but OPT-IN via `DEMO_FALLBACK=true`
 *   (for resilient demo environments) — never a silent default.
 *
 * Wrapped in React `cache()` so `generateMetadata` + the page body share one
 * fetch per render (same `school`/`mode`).
 */
export const getSiteData = cache(
  async (school: string, mode: SiteMode = 'published'): Promise<SchoolData> => {
    if (process.env.USE_LOCAL_DATA === 'true') {
      return pickLocalMock(school)
    }

    const backend = await resolveBackend()
    const url =
      `${backend}/api/method/${GET_SITE_METHOD}` +
      `?school=${encodeURIComponent(school)}&mode=${encodeURIComponent(mode)}`

    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      })
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
      const reason = err instanceof Error ? err.message : String(err)
      if (process.env.DEMO_FALLBACK === 'true') {
        console.warn(
          `[cms] getSiteData failed for school="${school}" (mode=${mode}); ` +
            `serving local fallback (DEMO_FALLBACK=true). Reason: ${reason}`,
        )
        return pickLocalMock(school)
      }
      throw new Error(
        `getSiteData: failed to load site data for school="${school}" (mode=${mode}): ${reason}`,
      )
    }
  },
)

// ── Identity helper (auth; optional) ──

/**
 * Fetch the website identity/registration for the authenticated editor session.
 * Returns `null` when there is no School Website or the request is unauthenticated.
 * Server-side only. (Not required to render published content — the template
 * comes from `get_site`'s `config.template_id` — but available for editor flows.)
 */
export const getWebsiteIdentity = cache(async (): Promise<WebsiteIdentity | null> => {
  const backend = await resolveBackend()
  const url = `${backend}/api/method/${GET_IDENTITY_METHOD}`
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { message?: WebsiteIdentity | null }
    return json?.message ?? null
  } catch {
    return null
  }
})
