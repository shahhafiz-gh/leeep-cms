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
  return buildSiteMetadata(params, '/admissions/apply', (d) => ({ title: 'Apply', description: `Apply for admission to ${d.name}.` }))
}

export default async function AdmissionsApplyPage({ params }: Props) {
  return renderSitePage(params, 'admissions-apply', '/admissions/apply')
}
