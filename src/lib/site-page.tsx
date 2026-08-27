import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import type { PageType, SchoolData } from '@/types/school.types'
import { getSiteData, SiteNotFoundError } from './cms'
import { tenantFromParams, type Tenant } from './tenant'
import { renderTemplate } from './render-template'
import { buildMetadata } from './metadata'
import { canonicalUrlFor, redirectHostFor, schemeFor } from './canonical'
import SiteHead from '@/shared/SiteHead'

/**
 * The shared body of every public page.
 *
 * All twelve public routes do exactly the same three things — resolve the
 * tenant, load its published content, render the school's template for one page
 * type — and differ only in the page type and the metadata title. Keeping that
 * in one place is what makes the caching rules a single decision instead of
 * twelve: nothing here touches `headers()`, `cookies()` or `searchParams`, so
 * every route built on it stays statically renderable and lives in the edge
 * cache until the school publishes.
 *
 * The editor preview is a DIFFERENT route (`app/preview/…`) precisely because
 * it must be dynamic. Mixing the two is what made the public site pay the
 * editor's costs.
 */

/** Params written by `proxy.ts`: the public host and the school slug. */
export type TenantParams = Promise<{ host: string; slug: string }>

interface LoadedSite {
  tenant: Tenant
  data: SchoolData
}

/**
 * Resolve the tenant and load its published content, or 404.
 *
 * Not memoised across the metadata and body passes on purpose: `getSiteData`'s
 * underlying fetch is itself cached and tagged, so the second call is a cache
 * read rather than a second round trip to Frappe.
 */
export async function loadSite(params: TenantParams): Promise<LoadedSite> {
  const { host, slug } = await params
  const tenant = await tenantFromParams(host, slug)
  if (!tenant) notFound()
  try {
    const data = await getSiteData(tenant, 'published')
    return { tenant, data }
  } catch (err) {
    // A host that maps to no school gets a plain 404 — cacheable and true.
    // Anything else is an outage and is re-thrown, so Next serves the last good
    // render rather than caching a 404 over a school that is merely down.
    if (err instanceof SiteNotFoundError) notFound()
    throw err
  }
}

/** Per-page metadata overrides, derived from the school's own content. */
type MetaFor = (data: SchoolData) => { title?: string; description?: string }

/**
 * Build a page's metadata from the school's SEO settings plus a per-page title.
 *
 * `canonicalUrlFor` points the canonical URL at the school's own domain once it
 * has a verified one, so the platform subdomain and the custom domain stop
 * competing as two copies of the same site.
 */
export async function buildSiteMetadata(
  params: TenantParams,
  pathname: string,
  metaFor?: MetaFor,
): Promise<Metadata> {
  const { tenant, data } = await loadSite(params)
  const extra = metaFor?.(data) ?? {}
  return buildMetadata({
    favicon: data.config?.favicon,
    seo: data.seo,
    schoolName: data.name,
    description: data.tagline,
    canonicalUrl: canonicalUrlFor(data, tenant, pathname),
    ...extra,
  })
}

/**
 * Render one page of a school's site.
 *
 * `guard` gates routes that only exist for schools on the extended page set —
 * a school must never be able to reach a page its navigation does not offer.
 */
export async function renderSitePage(
  params: TenantParams,
  page: PageType,
  pathname: string,
  guard?: (data: SchoolData) => boolean,
) {
  const { tenant, data } = await loadSite(params)
  if (guard && !guard(data)) notFound()

  // Once a school's own domain verifies, send visitors there. The canonical tag
  // tells crawlers which host to prefer, but only a redirect stops people
  // sharing and linking the platform URL — which is what keeps a second copy of
  // the site alive in the index. A 307 rather than a 301 on purpose: browsers
  // cache permanent redirects hard, so a school that later drops its domain
  // would strand every visitor who had seen one.
  const target = redirectHostFor(data, tenant)
  if (target) {
    redirect(`${schemeFor(target)}://${target}${pathname === '/' ? '' : pathname}`)
  }

  const origin = canonicalUrlFor(data, tenant, '/')

  return (
    <>
      <SiteHead data={data} origin={origin} />
      {renderTemplate(data, page, tenant.slug || tenant.host, false)}
    </>
  )
}
