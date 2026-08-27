import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { isAllowedBackend, siteTag } from '@/lib/tenant'

/**
 * On-demand cache invalidation, called BY Frappe when a school publishes.
 *
 * The public pages are cached at the edge and would otherwise wait out their
 * hour-long backstop TTL before showing an edit. This endpoint is what makes a
 * publish feel instant while still letting every other visit be served from
 * cache: Frappe posts the backend it just published, we drop that school's tag,
 * and the next request re-renders once.
 *
 * Callers (education app):
 *   - `website_builder.publish()`            — content went live
 *   - `Website Announcements` / `Website Event` doc events — dated content that
 *     `get_site` folds in at read time, so it changes a published page without
 *     anyone pressing Publish
 *   - `website_domains` — a custom domain was connected, verified or removed,
 *     which changes the canonical URL baked into every page
 *
 * AUTH: a shared secret. Frappe reads it from `common_site_config.json`, so
 * every school site on the bench has the same value without per-site setup;
 * the renderer reads the same value from `REVALIDATE_SECRET`. Compared in
 * constant time — a timing oracle here would leak the secret one byte at a time.
 *
 * Scoping matters: the secret is shared across schools, so a caller could name
 * any backend. That is acceptable because the worst a forged call can do is
 * make one school's pages re-render — there is no data to read and nothing to
 * destroy. It is still restricted to our own zones so it cannot be used to
 * probe arbitrary hosts.
 */

/** Never cache the invalidation endpoint itself. */
export const dynamic = 'force-dynamic'

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

interface RevalidateBody {
  /** Origin of the school's Frappe site, e.g. `https://kcs.leeep.in`. */
  backend?: string
  /** Shared secret (may also be sent as the `x-revalidate-secret` header). */
  secret?: string
  /** Extra tags to drop, e.g. `domain:kcs.edu` when a domain changes. */
  tags?: string[]
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    // Fail loudly rather than silently accepting every caller.
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET is not configured on the renderer' },
      { status: 503 },
    )
  }

  let body: RevalidateBody
  try {
    body = (await request.json()) as RevalidateBody
  } catch {
    return NextResponse.json({ ok: false, error: 'Expected a JSON body' }, { status: 400 })
  }

  const given = request.headers.get('x-revalidate-secret') ?? body.secret ?? ''
  if (!timingSafeEqual(given, secret)) {
    return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 401 })
  }

  const backend = (body.backend ?? '').replace(/\/$/, '')
  if (!backend || !isAllowedBackend(backend)) {
    return NextResponse.json(
      { ok: false, error: `Unknown or disallowed backend "${backend}"` },
      { status: 400 },
    )
  }

  // One tag covers every page of that school: each page's content fetch carries
  // it, so dropping it invalidates the whole site in a single call.
  const tags = [siteTag(backend), ...(body.tags ?? []).filter((t) => typeof t === 'string')]
  // `{ expire: 0 }` rather than the `'max'` profile: `'max'` marks the tag stale
  // and serves stale-while-revalidate, so the school that just pressed Publish
  // would reload its own site and still see the old page. Expiring immediately
  // costs one blocking render and makes Publish mean what it says.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })

  return NextResponse.json({ ok: true, revalidated: tags, at: Date.now() })
}

/** A plain GET is a health check — useful when wiring the Frappe side up. */
export async function GET() {
  return NextResponse.json({ ok: true, configured: Boolean(process.env.REVALIDATE_SECRET) })
}
