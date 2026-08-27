import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getSiteData } from '@/lib/cms'
import { canonicalHostFor } from '@/lib/canonical'
import { normalizeHost, resolveTenant } from '@/lib/tenant'

/**
 * `robots.txt`, per school.
 *
 * There was none at all, which for a school website is a real omission rather
 * than a tidiness one: being found in search IS the job. Without it crawlers
 * get no sitemap pointer, and the editor preview and admission API routes are
 * fair game for indexing.
 *
 * Served per host, so each school's file names its OWN sitemap. This route is
 * dynamic (it reads the Host header) but it is tiny, cached by the CDN for an
 * hour, and requested roughly never compared with page views.
 */

export const revalidate = 3600

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = normalizeHost((await headers()).get('host'))
  const tenant = await resolveTenant(host)

  // A host that belongs to no school gets a blanket disallow rather than an
  // invitation to crawl a 404.
  if (!tenant) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  let canonical = host
  try {
    const data = await getSiteData(tenant, 'published')
    canonical = canonicalHostFor(data, tenant)
  } catch {
    // Backend unreachable: still emit a valid, useful robots.txt.
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // `/preview` serves unpublished draft content and `/api` is machinery;
        // neither should ever appear in a result page.
        disallow: ['/api/', '/preview/', '/site/', '/demo'],
      },
    ],
    sitemap: `https://${canonical}/sitemap.xml`,
    host: canonical,
  }
}
