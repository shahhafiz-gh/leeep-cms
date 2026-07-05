import type { Metadata } from 'next'

interface SiteSeo {
  title?: string
  description?: string
  ogImage?: string
}

interface MetadataOptions {
  title?: string
  description?: string
  keywords?: string[]
  schoolName?: string
  // Admin-configured search/social defaults (Settings → SEO). Page-level title /
  // description win when present; otherwise these fill in, and ogImage is global.
  seo?: SiteSeo
}

const DEFAULT_SCHOOL_NAME = 'LEEEP School'
const DEFAULT_DESCRIPTION = 'Welcome to our school website powered by LEEEP CMS'

/**
 * Build SEO metadata for any page.
 * Prepends school name to page title, provides sensible defaults, and layers in
 * the admin's Settings → SEO defaults (meta title/description + social image).
 */
export function buildMetadata(options: MetadataOptions = {}): Metadata {
  const seo = options.seo ?? {}
  const schoolName = options.schoolName ?? DEFAULT_SCHOOL_NAME
  // A specific page (About, Academics…) keeps its own title; the home page (no
  // page title) uses the admin's SEO meta title if set.
  const title = options.title
    ? `${options.title} | ${schoolName}`
    : seo.title || schoolName
  const description = options.description || seo.description || DEFAULT_DESCRIPTION
  const images = seo.ogImage ? [{ url: seo.ogImage }] : undefined

  return {
    title,
    description,
    keywords: options.keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(images ? { images } : {}),
    },
    ...(images ? { twitter: { card: 'summary_large_image', title, description, images } } : {}),
  }
}
