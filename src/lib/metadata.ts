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
  /**
   * The school's logo, used as the browser-tab icon (`config.favicon` from
   * `get_site`). Passed per page rather than set once in the root layout,
   * because the layout would have to fetch site data for every route — including
   * `/demo`, which never talks to a backend — and `getSiteData` re-throws on
   * failure. Omitted → the platform default favicon.
   */
  favicon?: string
}

const DEFAULT_SCHOOL_NAME = 'LEEEP School'
const DEFAULT_DESCRIPTION = 'Welcome to our school website powered by LEEEP CMS'
/** Served from `public/`; used until a school sets its logo in Education Settings. */
const DEFAULT_FAVICON = '/favicon.ico'

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
    // A school's own logo, or the platform default. Declared explicitly (rather
    // than left to the browser's implicit /favicon.ico probe) and sourced from
    // `public/` rather than the `app/favicon.ico` file convention — file-based
    // metadata outranks this config, so keeping it in `app/` emitted BOTH icons
    // and left the browser to pick, which defeated the school's branding.
    icons: (() => {
      const icon = options.favicon || DEFAULT_FAVICON
      return { icon, shortcut: icon, apple: icon }
    })(),
    openGraph: {
      title,
      description,
      type: 'website',
      ...(images ? { images } : {}),
    },
    ...(images ? { twitter: { card: 'summary_large_image', title, description, images } } : {}),
  }
}
