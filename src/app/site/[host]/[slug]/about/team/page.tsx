import { buildSiteMetadata, renderSitePage, type TenantParams } from '@/lib/site-page'

type Props = { params: TenantParams }

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

export function generateMetadata({ params }: Props) {
  return buildSiteMetadata(params, '/about/team', (d) => ({
    title: d.team?.title || 'Our Team',
    description: d.team?.description || `Meet the people behind ${d.name}.`,
  }))
}

export default async function TeamPage({ params }: Props) {
  // The backend exposes this navigation item only for schools that opted into
  // the extended page set. Keep direct URL access governed by that same flag.
  return renderSitePage(params, 'team', '/about/team', (d) => Boolean(d.config?.extended_pages))
}
