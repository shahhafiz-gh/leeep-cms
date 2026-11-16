import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getSiteData } from '@/lib/cms'
import { canonicalHostFor, schemeFor } from '@/lib/canonical'
import { normalizeHost, resolveTenant } from '@/lib/tenant'
import { customPages, pageHref, supportsCustomPages } from '@/lib/custom-pages'

/**
 * `sitemap.xml`, per school.
 *
 * Every URL is built on the school's CANONICAL host, so a school with its own
 * domain submits a sitemap of its own domain rather than one advertising the
 * platform subdomain it is trying to retire.
 *
 * The page set is not fixed: the extended pages (Facilities, Team, Gallery)
 * only exist for schools that switched them on, and listing a URL that 404s is
 * a crawl error rather than a missed opportunity. Announcements get their own
 * entries because they are the only part of the site that changes weekly, and
 * they are what a parent searching the school's name plus "admission dates"
 * should land on.
 */

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = normalizeHost((await headers()).get('host'))
  const tenant = await resolveTenant(host)
  if (!tenant) return []

  let data
  try {
    data = await getSiteData(tenant, 'published')
  } catch {
    // A backend blip must not produce an empty sitemap that tells Google the
    // school has no pages; better to serve nothing and be retried.
    return []
  }

  const canonical = canonicalHostFor(data, tenant)
  const origin = `${schemeFor(canonical)}://${canonical}`
  const now = new Date()

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  ) => ({ url: `${origin}${path}`, lastModified: now, changeFrequency, priority })

  const pages: MetadataRoute.Sitemap = [
    entry('', 1.0, 'weekly'),
    entry('/about', 0.8, 'monthly'),
    entry('/academics', 0.8, 'monthly'),
    // The pages a prospective parent is actually searching for.
    entry('/admissions', 0.9, 'weekly'),
    entry('/admissions/apply', 0.9, 'monthly'),
    entry('/contact', 0.7, 'yearly'),
    entry('/updates', 0.7, 'weekly'),
    // Linked from every page's footer, so it is crawled anyway — declaring it
    // at a low priority keeps it out of the way of the pages that matter.
    entry('/privacy', 0.2, 'yearly'),
  ]

  if (data.config?.extended_pages) {
    pages.push(entry('/about/team', 0.5, 'monthly'))
    pages.push(entry('/facilities', 0.6, 'monthly'))
    pages.push(entry('/gallery', 0.5, 'monthly'))
  }

  // A school's own pages (History, Syllabus, ...) — only where the template
  // serves them.
  if (supportsCustomPages(data)) {
    for (const page of customPages(data)) pages.push(entry(pageHref(page), 0.6, 'monthly'))
  }

  for (const announcement of data.updates?.announcements ?? []) {
    if (!announcement?.id) continue
    pages.push({
      url: `${origin}/updates/${encodeURIComponent(announcement.id)}`,
      lastModified: announcement.published_date ? new Date(announcement.published_date) : now,
      changeFrequency: 'yearly',
      priority: 0.4,
    })
  }

  return pages
}
