/* ────────────────────────────────────────────────────────────
 *  LEEEP CMS — Core Type Definitions
 *  Single source of truth for all school / template data shapes.
 * ──────────────────────────────────────────────────────────── */

// ── Page & Template Identifiers ──

// 'admissions' is the information page; 'admissions-apply' is the application
// form on its own route, so the first page stays readable and can say the
// school is not admitting without a dead form under it.
export type PageType =
  | 'home'
  | 'about'
  | 'team'
  | 'academics'
  | 'admissions'
  | 'admissions-apply'
  | 'admissions-status'
  | 'contact'
  | 'updates'
  | 'facilities'
  | 'gallery'

export type TemplateId =
  | 'template-a'
  | 'template-b'
  | 'template-c'
  | 'template-d'
  | 'template-e'
  | 'template-f'
  | 'template-g'
  | 'template-h'

// ── Template Configuration ──

export interface TemplateConfig {
  template_id: TemplateId
  /** Curated colour preset id (Settings/Builder). Empty → the template default. */
  palette?: string
  /** Curated Google Font id. Empty/legacy records default to BioRhyme. */
  font_family?: 'biorhyme' | 'roboto-slab'
  /**
   * Browser-tab icon for the public site: the school's own logo from Education
   * Settings (the same mark the school portal uses), falling back to the site's
   * header logo. Server-owned — folded in by `get_site`, never stored in the
   * content blob. Empty → the platform default favicon.
   */
  favicon?: string
  /** Whether the optional public page set is enabled for this school. */
  extended_pages?: boolean
  /** Nav hrefs the school has chosen to hide. Server-owned. */
  hidden_nav_items?: string[]
  /** The school's menu arrangement, as hrefs in order. Server-owned. */
  nav_order?: string[]
  /**
   * The school's own domain, once it has connected one. Server-owned, folded in
   * by `get_site` from `School Website.custom_domain`. Used to pick the
   * canonical host so the platform subdomain and the custom domain stop
   * competing as two copies of one site.
   */
  custom_domain?: string
  /** Vercel's verification state for `custom_domain` (`Active` once it is live). */
  custom_domain_status?: string
  /**
   * The school's own Google Analytics 4 measurement id (`G-XXXXXXX`), if it has
   * one. Empty/absent → no analytics script is emitted at all.
   */
  analytics_id?: string
}

// ── Facilities ──

export interface FacilityItem {
  name: string
  description: string
  image?: string
  highlights?: string[]
}

export interface FacilitiesData {
  title: string
  subtitle?: string
  description?: string
  heroImage?: string
  items?: FacilityItem[]
  /** Server-owned switch for the optional facilities/team/downloads page set. */
  extended_pages?: boolean
}

// ── Website Identity (education.education.api.get_website_registration) ──

/**
 * Identity/registration record for a school's website, returned by
 * `get_website_registration` (auth). `null` when the editor has no School Website.
 * `subdomain === web_address === slug`.
 */
export interface WebsiteIdentity {
  name: string
  website_name: string
  web_address: string
  subdomain: string
  template_id: TemplateId
}

// ── Navigation ──

export interface NavigationItem {
  label: string
  href: string
  children?: NavigationItem[]
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'linkedin' | string
  url: string
  icon?: string
}

// ── Badges (small, fully-editable icon + label chips) ──

/**
 * A small trust/info chip rendered across the templates (floating badges,
 * admissions highlights, contact cards, etc.). Every instance is editable
 * by the school admin — nothing is hardcoded in the components.
 */
export interface Badge {
  /** iconify icon name, e.g. "lucide:shield-check". Falls back to a sensible default per slot. */
  icon?: string
  /** Primary line, e.g. "Trusted Institution". */
  label: string
  /** Optional secondary line, e.g. "Local Excellence". */
  sublabel?: string
}

// ── Hero ──

export interface HeroSlide {
  title: string
  subtitle?: string
  description?: string
  image: string
  /** Optional video URL — when provided, renders a video hero background */
  video?: string
  /**
   * Where `video` plays in the hero. 'background' covers the whole hero panel;
   * 'lead image' plays it inside the framed lead photo instead. Values are the
   * builder's own select options (schema.ts `hero.slides.0.videoPlacement`), so
   * they are compared as written there, spaces included.
   */
  videoPlacement?: 'background' | 'lead image'
  cta?: {
    label: string
    href: string
  }
  /** Optional second, outline button beside `cta`. Rendered only when labelled. */
  secondaryCta?: {
    label: string
    href: string
  }
  /**
   * How long this slide stays on screen, in seconds, before the slider advances
   * (templates that rotate — currently Grand). The builder writes it as a string,
   * so read it through `slideDurationMs`. Blank/invalid falls back to 6s.
   */
  duration?: string | number
}

export interface HeroData {
  slides: HeroSlide[]
}

// ── About ──

export interface WhyChooseItem {
  title: string
  description: string
  icon?: string
}

export interface MissionItem {
  title: string
  description: string
  icon?: string
  image?: string
}

export interface Achievement {
  title: string
  description: string
  year?: string
  image?: string
  icon?: string
}

/**
 * A message from a member of the school's leadership (Chairman, Principal, ...).
 *
 * Schools that grew up on a page-per-message site keep that structure in the
 * menu — each message is a section on the About page, linked from the About
 * dropdown — without each one costing a route of its own.
 */
export interface LeadershipMessage {
  /** "Chairman", "Principal", "Management" — also the menu label and the anchor. */
  role: string
  /** Who is speaking, when the school names them. */
  name?: string
  image?: string
  message: string
}

export interface AboutData {
  title: string
  subtitle?: string
  description: string
  /** "Our Story" image on the About page (and the primary about photo). */
  image?: string
  /** Full-width hero image at the top of the About page. */
  heroImage?: string
  /** Image used in the About teaser section on the HOME page. */
  homeImage?: string
  /** Secondary/overlay image in the home About teaser (Template B layout). */
  homeSecondaryImage?: string
  mission?: MissionItem[]
  /** Single mission statement (distinct from the `mission` pillar list) */
  missionStatement?: string
  vision?: string
  /** @deprecated split into missionBadges / visionBadges */
  values?: string[]
  /** Badges shown inside the Mission and Vision cards (each stored separately). */
  missionBadges?: string[]
  visionBadges?: string[]
  /** Editable heading + intro for the "Why choose us" section. */
  whyChooseTitle?: string
  whyChooseDescription?: string
  whyChooseUs?: WhyChooseItem[]
  /** Editable heading + intro for the Achievements section. */
  achievementsTitle?: string
  achievementsDescription?: string
  achievements?: Achievement[]
  /** Small floating trust badges shown across the about sections (icon + label + sublabel). */
  badges?: Badge[]
  /** Chairman / Principal / Management messages, rendered as About sections. */
  messages?: LeadershipMessage[]
  /** Heading over the organisation chart. Empty falls back to a sensible default. */
  structureTitle?: string
  /** The school's organisation chart, as an image. */
  structureImage?: string
  story?: string
  recognition?: {
    title: string
    description: string
    items: { title: string; description: string; image?: string }[]
  }
}

// ── Team ──

export interface TeamMember {
  name: string
  role: string
  department?: string
  image?: string
  qualification?: string
  bio?: string
  email?: string
  phone?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  /** X profile URL; kept as `twitter` for compatibility with existing social data. */
  twitter?: string
}

export interface TeamData {
  title: string
  subtitle?: string
  description?: string
  message?: {
    name?: string
    role?: string
    image?: string
    content?: string
  }
  members?: TeamMember[]
}

/** Home-only "About our school" teaser content (Template A). Separate from
 *  AboutData so the home section is self-contained and editable on the Home tab. */
export interface HomeAboutData {
  /** Small eyebrow / decorative label, e.g. "About Us". */
  title?: string
  /** Section heading. */
  subtitle?: string
  description?: string
  image?: string
  /** Secondary/overlay image (used by the Template B layout). */
  secondaryImage?: string
  badges?: Badge[]
  mission?: MissionItem[]
}

// ── Academics ──

export interface Stream {
  name: string
  description: string
  subjects?: string[]
  image?: string
}

export interface Club {
  name: string
  description: string
  image?: string
}

export interface CourseData {
  id: string
  name: string
  description: string
  duration?: string
  image?: string
  subjects?: string[]
}

/** One downloadable file offered under an academic resource. */
export interface ResourceFile {
  label: string
  url: string
}

/**
 * A set of academic downloads — a syllabus, a booklist, a stationery list.
 *
 * Grouped rather than flat because these arrive class-by-class: one "Syllabus"
 * resource holds a file per grade, which is how families look for them.
 */
export interface AcademicResource {
  title: string
  description?: string
  files?: ResourceFile[]
}

export interface AcademicsData {
  title: string
  subtitle?: string
  description: string
  image?: string
  curriculum?: {
    title: string
    description: string
    items: { title: string; description: string }[]
  }
  /** Editable heading + intro for the Streams section. */
  streamsTitle?: string
  streamsDescription?: string
  streams?: Stream[]
  methodology?: {
    title: string
    description: string
    steps: { title: string; description: string; icon?: string }[]
  }
  /** Editable heading + intro for the Clubs section. */
  clubsTitle?: string
  clubsDescription?: string
  clubs?: Club[]
  results?: {
    title: string
    description: string
    stats: { label: string; value: string }[]
    image?: string
  }
  courses?: CourseData[]
  /** Editable heading + intro for the downloads section. */
  resourcesTitle?: string
  resourcesDescription?: string
  /** Syllabus / booklists / stationery lists, each with its own files. */
  resources?: AcademicResource[]
}

// ── Admissions ──

export interface FeeItem {
  grade: string
  tuition: string
  total: string
  details?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface AdmissionsData {
  title: string
  subtitle?: string
  description: string
  /** Editable heading in the application call-to-action card. */
  applicationCardTitle?: string
  /** Editable supporting copy in the application call-to-action card. */
  applicationCardDescription?: string
  /** Hero image on the Admissions page. */
  image?: string
  /** Image used in the Admissions teaser/CTA section on the HOME page. */
  homeImage?: string
  /** Image shown in the "New Student Admissions" requirements block (Template B). */
  requirementsImage?: string
  whyChoose?: WhyChooseItem[]
  feeStructure?: FeeItem[]
  faqs?: FAQ[]
  /**
   * DEPRECATED. Extra questions bolted onto the old fixed base form.
   *
   * The application form is now derived from the school's `Student Applicant`
   * DocType and its `Admission Form Profile` (see shared/admission-schema.ts),
   * so an extra question is a custom field on the doctype and needs no entry
   * here. Kept only so existing site blobs still parse; nothing reads it.
   */
  formFields?: {
    section: string
    label: string
    type?: string
    options?: string[]
    required?: string
  }[]
  process?: {
    title: string
    steps: { step: number; title: string; description: string }[]
  }
  /**
   * Heading over the admission rules a family accepts before the application
   * form (Almanac shows them as step one of `/admissions/apply`). Editable copy,
   * unlike the rules themselves, which come from `Student Admission`. Empty →
   * "Admission rules".
   */
  rulesTitle?: string
  /** Trust badges shown in the admissions hero (icon + label). */
  highlights?: Badge[]
  /** Highlight callout card, e.g. "Limited Seats" / "Apply Early". */
  callout?: Badge
  formEnabled?: boolean
}

// ── Contact ──

export interface ContactData {
  title: string
  subtitle?: string
  /** Intro paragraph under the Contact page hero title. */
  description?: string
  /** Campus photo shown in the Contact page hero. */
  image?: string
  address: string
  phone: (string | { label?: string; value: string })[]
  email: (string | { label?: string; value: string })[]
  mapUrl?: string
  mapEmbedUrl?: string
  coordinates?: {
    lat: number
    lng: number
  }
  workingHours?: string
  /** Nearby landmarks shown in the "Find Us" section. */
  landmarks?: { icon?: string; label: string }[]
  /** "How to reach" transport options, e.g. { type: "Train", detail: "..." }. */
  transport?: { type: string; detail: string }[]
  /** Visiting-hours rows, e.g. { label: "Main Reception", time: "9:00 AM - 3:00 PM" }. */
  visitingHours?: { label: string; time: string }[]
  /** Trust badges shown in the contact hero (icon + label + sublabel). */
  highlights?: Badge[]
}

// ── Updates / Announcements / Events ──

export interface Announcement {
  id: string
  title: string
  short_description?: string | null
  /** Full body — may be null/placeholder from the backend. */
  content?: string | null
  /** Image path/URL. May be null OR an empty string — components fall back to a placeholder. */
  thumbnail?: string | null
  published_date?: string
  /** Currently always null/placeholder from the backend. */
  author?: string | null
  /** Currently always null/placeholder from the backend. */
  category?: string | null
  /** Computed server-side at read time; defaults to false. */
  is_pinned?: boolean
}

export interface SchoolEvent {
  id: string
  title: string
  description?: string | null
  /** Formatted full event body; the list only uses the short description. */
  content?: string | null
  date: string
  end_date?: string | null
  location?: string | null
  /** Image path/URL. May be null OR an empty string — components fall back to a placeholder. */
  image?: string | null
  category?: string | null
}

export interface UpdatesData {
  announcements: Announcement[]
  events: SchoolEvent[]
}

// ── Testimonials ──

export interface TestimonialData {
  id: string
  name: string
  role: string
  content: string
  avatar?: string
  /**
   * Star rating. The Frappe `get_site` payload returns this as a STRING (e.g. "5"),
   * while local fixtures use a number — so it is `number | string`. Consumers must
   * coerce with `Number(...)` before arithmetic/array use.
   */
  rating?: number | string
  /** Portrait. Named `image` to match the builder field; `avatar` above is the
   *  older key and is still read as a fallback. */
  image?: string
  /** 'yes' pulls the quote to the front and sets it larger. String, not boolean:
   *  it comes from a builder select. */
  featured?: string
}

// ── Stats ──

export interface StatData {
  label: string
  value: string | number
  suffix?: string
  icon?: string
}

// ── Gallery ──

export interface GalleryImage {
  src: string
  alt: string
  /** Optional Website Event id — makes the tile link to /updates#<id>. */
  eventId?: string
}

export interface GalleryData {
  title?: string
  subtitle?: string
  /** 'marquee' drifts the photos sideways and pauses on hover; 'static grid'
   *  holds them still. Empty/undefined keeps the template default (marquee). */
  motion?: 'marquee' | 'static grid'
  speed?: 'slow' | 'medium' | 'fast'
  images: GalleryImage[]
}

export interface GalleryAlbum {
  title: string
  date?: string
  cover?: string
  images?: GalleryImage[]
}

export interface GalleryPageData {
  title?: string
  subtitle?: string
  description?: string
  showEventPhotos?: 'yes' | 'no' | ''
  images?: GalleryImage[]
  albums?: GalleryAlbum[]
}

// ── Faculty ──

export interface FacultyMember {
  id: string
  name: string
  designation: string
  department?: string
  image?: string
  bio?: string
  qualifications?: string[]
  email?: string
}

// ── Footer ──

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterData {
  description?: string
  columns: FooterColumn[]
  copyright?: string
}

// ── Alumni ──

export interface AlumniData {
  name: string
  batch: string
  achievement: string
  image?: string
  testimonial?: string
}

// ── Programs ──

export interface ProgramData {
  id: string
  name: string
  description: string
  image?: string
  grade_range?: string
  features?: string[]
}

// ── Login / Portals ──

export interface PortalLink {
  label: string
  url: string
  /** Visual emphasis — `primary` uses the brand colour, `dark` uses the neutral/ink colour. */
  variant?: 'primary' | 'dark'
}

// ────────────────────────────────────────────
//  ROOT SCHOOL DATA SHAPE
// ────────────────────────────────────────────

/**
 * Home "Latest notifications" band — the FRAME only.
 *
 * The notices themselves are never stored here: they are the same published
 * Website Announcements the Updates page shows, folded onto `updates.announcements`
 * by the server on every read. This block just controls the heading and how the
 * band behaves, so a school writes a notice once and it appears in both places.
 */
export interface NotificationsData {
  title?: string
  subtitle?: string
  /** How many to show. A builder select, so a STRING — coerce before slicing. */
  limit?: number | string
  layout?: 'ticker' | 'list' | 'cards'
  cta?: { label?: string }
  /** Shown instead of the band while there are no published announcements. */
  emptyText?: string
}

/**
 * "Quote of the Day" — a short daily passage on the home page.
 *
 * Modelled as up to three renderings of one passage (an original script, a
 * translation, a second translation) because the school that needs it publishes
 * Arabic with English and Urdu beneath. Every line is optional; the panel is
 * skipped when nothing is authored. Templates render these with `dir="auto"`,
 * so a right-to-left script lays out correctly without the school declaring it.
 */
/**
 * A video the school has published, identified by its watch URL.
 *
 * Only the URL is stored — never an embed snippet — so the renderer decides how
 * to present it and no school can paste arbitrary markup into the page.
 */
export interface VideoItem {
  title: string
  /** YouTube/Vimeo watch, share or embed URL. */
  url: string
  /** Optional custom poster; the provider's own thumbnail is used when empty. */
  thumbnail?: string
  description?: string
}

export interface VideoGalleryData {
  title?: string
  subtitle?: string
  videos?: VideoItem[]
}

/**
 * A campus, for schools that run more than one.
 *
 * Deliberately small: a campus here is a NAME and the places a family is sent
 * for it, not a second site's worth of content. A school whose campuses each
 * need their own pages runs them as separate sites.
 */
export interface CampusData {
  name: string
  /** Where "Apply" for this campus goes. Often another school site entirely. */
  admissionUrl?: string
  address?: string
  phone?: string
}

export interface QuoteOfTheDayData {
  /** Panel heading. Defaults to "Quote of the Day" when empty. */
  title?: string
  /** The passage in its original script, shown first and largest. */
  scriptText?: string
  /** Primary translation. */
  text?: string
  /** Optional second translation. */
  translationText?: string
  /** Source or speaker. */
  attribution?: string
}

export interface SocialPost {
  image?: string
  caption: string
  platform?: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | string
  url?: string
  date?: string
}

/**
 * "Social space" — a wall of AUTHORED posts, not an embed of a live third-party
 * timeline. Nothing here loads an external script onto a school site, so the
 * wall keeps working when a platform changes its embed rules.
 */
export interface SocialSpaceData {
  title?: string
  subtitle?: string
  handle?: string
  posts?: SocialPost[]
}

export interface MagazineIssue {
  title: string
  cover: string
  issue?: string
  date?: string
  summary?: string
  /** Outbound link, used when the issue has no `pages` to read in place. */
  url: string
  /**
   * The issue scanned to one image per page, in reading order. When present the
   * issue is read IN the site (see MagazineReader) instead of linking out, which
   * is what a school that only has page images — not a hosted PDF — actually has.
   * Absent or empty keeps the original link-out behaviour.
   */
  pages?: string[]
  /** Optional "download the whole issue" file, offered alongside the reader. */
  downloadUrl?: string
}

/** School magazine — issues a family can read or download, newest first. */
export interface MagazineData {
  title?: string
  subtitle?: string
  description?: string
  issues?: MagazineIssue[]
}

/**
 * Heading for a home-page block whose CONTENT is a list.
 *
 * A section like Programs stores an array, so its own heading has nowhere to
 * live inside it — which is why these headings were hardcoded in the templates
 * and could not be edited at all. A sibling `*Intro` object is the same shape
 * `testimonialsIntro` already used; templates fall back to their original
 * wording when it is empty, so nothing changes for a school until it edits one.
 */
export interface SectionIntroData {
  title?: string
}

/** Heading + layout for the testimonials block (the quotes are `testimonials`). */
export interface TestimonialsIntroData {
  title?: string
  subtitle?: string
  layout?: 'carousel' | 'grid' | 'marquee'
}

export interface SchoolData {
  name: string
  tagline: string
  logo: string
  config: TemplateConfig
  /** Admin-configured search/social defaults (Settings → SEO). Optional. */
  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
  /** Curated per-component style overrides (align / wrap / …), keyed by style
   *  path (e.g. `name`). Values are curated option ids resolved by component-styles. */
  styles?: Record<string, Record<string, string>>
  /**
   * The school's own running order for each page, as a list of block ids.
   *
   * Absent means "the order this template ships with" — which is what every
   * existing site has, so nothing changes until a school reorders something.
   * Stored per PAGE rather than per template, so an id naming a block the
   * current template does not have is ignored rather than breaking the page
   * (see `lib/layout.ts`).
   */
  layout?: Partial<Record<PageType, string[]>>

  hero: HeroData
  about: AboutData
  /** Optional About → Team page, enabled by `config.extended_pages`. */
  team?: TeamData
  /** Home-only "About our school" teaser (Template A) — independent of the
   *  About page so editing it never changes the About page. */
  homeAbout?: HomeAboutData
  academics: AcademicsData
  admissions: AdmissionsData
  contact: ContactData
  updates: UpdatesData
  /** Optional campus facilities page, enabled through Website Management. */
  facilities?: FacilitiesData
  /**
   * Updates PAGE header copy. Lives OUTSIDE `updates` because that key is
   * server-owned (announcements/events are folded into it on every read,
   * replacing whatever the blob holds).
   */
  updatesHero?: {
    subtitle?: string
    title?: string
    description?: string
  }
  testimonials: TestimonialData[]
  /** Heading/layout for the testimonials block. */
  testimonialsIntro?: TestimonialsIntroData
  /** Heading above the Programs cards on the home page. */
  programsIntro?: SectionIntroData
  /** Heading above the latest-news strip on the home page. */
  newsIntro?: SectionIntroData
  stats: StatData[]
  /** Frame for the home "Latest notifications" band (items come from
   *  `updates.announcements`). Quill shows this where other templates show stats. */
  notifications?: NotificationsData
  /** Home-page "Quote of the Day" panel. */
  quote?: QuoteOfTheDayData
  /** Published videos, shown on the Gallery page. */
  videoGallery?: VideoGalleryData
  /** Campuses, when the school runs more than one. Empty for most schools. */
  campuses?: CampusData[]
  /** Authored social wall. */
  socialSpace?: SocialSpaceData
  /** School magazine issues. */
  magazine?: MagazineData
  gallery: GalleryData
  /** Optional standalone gallery page, enabled with the extended page set. */
  galleryPage?: GalleryPageData
  faculty: FacultyMember[]
  alumni?: AlumniData[]
  programs?: ProgramData[]
  /** Administrator / staff portal links shown on the login page. */
  portalLinks?: PortalLink[]
  /**
   * Section ids the school has switched OFF (see shared/section-visibility.ts).
   * Absent or empty means everything is visible, so a site saved before this
   * existed is unaffected.
   */
  hiddenSections?: string[]
  navigation: NavigationItem[]
  socialLinks: SocialLink[]
  footer: FooterData
}
