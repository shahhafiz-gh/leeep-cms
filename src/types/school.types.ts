/* ────────────────────────────────────────────────────────────
 *  LEEEP CMS — Core Type Definitions
 *  Single source of truth for all school / template data shapes.
 * ──────────────────────────────────────────────────────────── */

// ── Page & Template Identifiers ──

export type PageType = 'home' | 'about' | 'academics' | 'admissions' | 'contact' | 'updates' | 'login'

export type TemplateId = 'template-a' | 'template-b'

// ── Template Configuration ──

export interface TemplateConfig {
  template_id: TemplateId
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
  cta?: {
    label: string
    href: string
  }
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
  values?: string[]
  whyChooseUs?: WhyChooseItem[]
  achievements?: Achievement[]
  /** Small floating trust badges shown across the about sections (icon + label + sublabel). */
  badges?: Badge[]
  story?: string
  recognition?: {
    title: string
    description: string
    items: { title: string; description: string; image?: string }[]
  }
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
  streams?: Stream[]
  methodology?: {
    title: string
    description: string
    steps: { title: string; description: string; icon?: string }[]
  }
  clubs?: Club[]
  results?: {
    title: string
    description: string
    stats: { label: string; value: string }[]
    image?: string
  }
  courses?: CourseData[]
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
  /** Hero image on the Admissions page. */
  image?: string
  /** Image used in the Admissions teaser/CTA section on the HOME page. */
  homeImage?: string
  /** Image shown in the "New Student Admissions" requirements block (Template B). */
  requirementsImage?: string
  whyChoose?: WhyChooseItem[]
  feeStructure?: FeeItem[]
  faqs?: FAQ[]
  process?: {
    title: string
    steps: { step: number; title: string; description: string }[]
  }
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
  /** Campus photo shown in the Contact page hero. */
  image?: string
  address: string
  phone: string[]
  email: string[]
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
}

export interface GalleryData {
  title?: string
  images: GalleryImage[]
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

export interface SchoolData {
  name: string
  tagline: string
  logo: string
  config: TemplateConfig

  hero: HeroData
  about: AboutData
  /** Home-only "About our school" teaser (Template A) — independent of the
   *  About page so editing it never changes the About page. */
  homeAbout?: HomeAboutData
  academics: AcademicsData
  admissions: AdmissionsData
  contact: ContactData
  updates: UpdatesData
  testimonials: TestimonialData[]
  stats: StatData[]
  gallery: GalleryData
  faculty: FacultyMember[]
  alumni?: AlumniData[]
  programs?: ProgramData[]
  /** Administrator / staff portal links shown on the login page. */
  portalLinks?: PortalLink[]
  navigation: NavigationItem[]
  socialLinks: SocialLink[]
  footer: FooterData
}
