import type { CustomPage, SchoolData, TemplateId } from '@/types/school.types'

/**
 * School-authored pages (`SchoolData.pages`), served at `/<slug>`.
 *
 * MUST STAY IN SYNC with `website_builder.py` (CUSTOM_PAGE_TEMPLATES,
 * RESERVED_PAGE_SLUGS, `_slugify`, `_fold_custom_pages`): the server builds the
 * menu from these rules and this file serves the pages the menu links to. A
 * rule that differs between the two is a menu entry that 404s.
 */

/** Templates whose design renders custom pages. Every other template 404s them. */
export const CUSTOM_PAGE_TEMPLATES: readonly TemplateId[] = ['template-i']

const RESERVED = new Set([
  'about', 'academics', 'admissions', 'contact', 'updates', 'facilities', 'gallery',
  'privacy', 'api', 'demo', 'preview', 'site', 'assets', '_next', 'robots.txt', 'sitemap.xml',
])

const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/

export function supportsCustomPages(data: SchoolData): boolean {
  return CUSTOM_PAGE_TEMPLATES.includes(data.config?.template_id)
}

/** Same as the server's `_slugify`: lowercase, runs of anything else → one hyphen. */
export function slugify(text: string | undefined | null): string {
  return String(text ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validPageSlug(slug: string | undefined | null): string {
  const value = String(slug ?? '').trim().toLowerCase()
  return SLUG.test(value) && !RESERVED.has(value) ? value : ''
}

/** The pages that can actually be served — valid slug, a title, first slug wins. */
export function customPages(data: SchoolData): CustomPage[] {
  const seen = new Set<string>()
  return (Array.isArray(data.pages) ? data.pages : []).filter((page) => {
    const slug = validPageSlug(page?.slug)
    if (!slug || seen.has(slug) || !page.title?.trim()) return false
    seen.add(slug)
    return true
  })
}

export function findCustomPage(data: SchoolData, slug: string): CustomPage | null {
  const wanted = validPageSlug(slug)
  return wanted ? customPages(data).find((page) => validPageSlug(page.slug) === wanted) ?? null : null
}

/** Pages filed under one menu label, in authored order (case-insensitive). */
export function pagesInGroup(data: SchoolData, label: string): CustomPage[] {
  const key = label.trim().toLowerCase()
  return customPages(data).filter((page) => (page.menu ?? '').trim().toLowerCase() === key)
}

/**
 * The group a `/<slug>` names when no page has that slug — the index page the
 * menu's group link points at (e.g. `/boarding-facilities`).
 */
export function findGroup(data: SchoolData, slug: string): { label: string; pages: CustomPage[] } | null {
  const wanted = slugify(slug)
  if (!wanted) return null
  const page = customPages(data).find((p) => slugify(p.menu) === wanted)
  if (!page?.menu) return null
  return { label: page.menu.trim(), pages: pagesInGroup(data, page.menu) }
}

/** The page an old address (`/SchoolHistory.aspx`) belongs to, matched case-insensitively. */
export function findAliasTarget(data: SchoolData, segment: string): CustomPage | null {
  const wanted = oldPath(segment)
  return (
    customPages(data).find((page) =>
      (page.aliases ?? []).some((alias) => `/${String(alias).replace(/^\/+/, '')}`.toLowerCase() === wanted),
    ) ?? null
  )
}

/** `/SchoolHistory.aspx` from a route segment; a malformed escape is kept as typed. */
function oldPath(segment: string): string {
  let value = segment
  try {
    value = decodeURIComponent(segment)
  } catch {
    /* not valid percent-encoding — compare it raw */
  }
  return `/${value.replace(/^\/+/, '')}`.toLowerCase()
}

export function pageHref(page: CustomPage): string {
  return `/${validPageSlug(page.slug)}`
}

/** Where a school's old single-segment address now lives, if it listed one. */
export function findRedirect(data: SchoolData, segment: string): string | null {
  const wanted = oldPath(segment)
  for (const entry of Array.isArray(data.redirects) ? data.redirects : []) {
    const from = `/${String(entry?.from ?? '').replace(/^\/+/, '')}`.toLowerCase()
    const to = String(entry?.to ?? '')
    // Only same-site paths: a redirect list is content, and content must not be
    // able to bounce a visitor to another domain.
    if (from === wanted && to.startsWith('/') && !to.startsWith('//')) return to
  }
  const page = findAliasTarget(data, segment)
  return page ? pageHref(page) : null
}
