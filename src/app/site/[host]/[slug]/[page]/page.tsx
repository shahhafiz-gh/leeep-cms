import { notFound, redirect } from 'next/navigation'
import { buildSiteMetadata, loadSite, renderSitePage } from '@/lib/site-page'
import { findCustomPage, findGroup, findRedirect, supportsCustomPages } from '@/lib/custom-pages'

type Props = { params: Promise<{ host: string; slug: string; page: string }> }

/** Backstop only — Frappe revalidates this page by tag the moment it publishes. */
export const revalidate = 3600

/** See `about/page.tsx`: empty, but it is what keeps the route static. */
export function generateStaticParams() {
  return []
}

/**
 * A school-authored page (`SchoolData.pages`) at `/<slug>`, or the index of a
 * menu group at `/<group>` — the link a dropdown like "Boarding Facilities"
 * points at.
 *
 * Every fixed route (`/about`, `/contact`, …) is a static sibling of this one
 * and wins over it, so a custom page can never shadow a real page. Anything
 * else that matches no page falls through to the school's `redirects` and page
 * `aliases`, which is what keeps links into its previous site (`/About.aspx`)
 * working once its domain points here.
 */
export async function generateMetadata({ params }: Props) {
  const { page } = await params
  return buildSiteMetadata(params, `/${page}`, (data) => {
    const custom = findCustomPage(data, page)
    if (custom) return { title: custom.title, description: custom.summary }
    const group = findGroup(data, page)
    return group ? { title: group.label } : {}
  })
}

export default async function CustomSitePage({ params }: Props) {
  const { page } = await params
  const { data } = await loadSite(params)
  if (!supportsCustomPages(data)) notFound()

  if (findCustomPage(data, page) || findGroup(data, page)) {
    return renderSitePage(params, 'custom', `/${page}`, undefined, page)
  }

  const target = findRedirect(data, page)
  // 307, not 308: the list is content, and a school that corrects an entry
  // must not be fighting a redirect every visitor's browser has cached.
  if (target) redirect(target)
  notFound()
}
