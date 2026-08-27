import type { Metadata } from 'next'
import { buildSiteMetadata, loadSite, renderSitePage } from '@/lib/site-page'

/**
 * One announcement, at its own URL.
 *
 * The id is read again by `useParams()` inside the client-side UpdatesView,
 * which picks the matching announcement out of the content already rendered —
 * so this route loads the same site payload as `/updates` and every
 * announcement of a school shares one cache entry per id.
 */
type Props = { params: Promise<{ host: string; slug: string; id: string }> }

/** Backstop only — Frappe revalidates this page by tag the moment it publishes. */
export const revalidate = 3600

/**
 * Empty on purpose: schools are onboarded without redeploying the renderer, so
 * there is no list of hosts to prerender at build time. Declaring the function
 * is still what puts the route on the STATIC path — without it Next treats
 * `params` as a runtime value and renders every request from scratch. With it,
 * an unknown host renders once on first visit and is then served from the cache
 * until `revalidateTag` drops it.
 */
export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await loadSite(params)
  const announcement = data.updates.announcements.find((a) => a.id === id)
  return buildSiteMetadata(params, `/updates/${encodeURIComponent(id)}`, () => ({
    title: announcement?.title ?? 'Update',
    description: announcement?.short_description ?? undefined,
  }))
}

export default async function UpdateDetailPage({ params }: Props) {
  const { id } = await params
  return renderSitePage(params, 'updates', `/updates/${encodeURIComponent(id)}`)
}
