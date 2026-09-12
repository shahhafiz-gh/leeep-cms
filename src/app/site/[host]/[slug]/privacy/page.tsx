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
  return buildSiteMetadata(params, '/privacy', (d) => ({
    title: d.privacy?.title || 'Privacy Policy',
    description: d.privacy?.description || `How ${d.name} handles information collected through this website.`,
  }))
}

/**
 * No `guard` — unlike Facilities or Team this page exists for EVERY school,
 * whether or not the extended page set is on. The footer of every template
 * links here, and the site collects admission enquiries from the day it is
 * published, so the notice cannot be optional (see `shared/privacy-baseline.ts`
 * for what a school that has not written one gets).
 */
export default async function PrivacyPage({ params }: Props) {
  return renderSitePage(params, 'privacy', '/privacy')
}
