import type { SchoolData } from '@/types/school.types'
import { renderBlocks } from '@/lib/render-blocks'
import type { BlockRegistry } from '@/lib/layout'
import HeroSection from '../components/sections/HeroSection'
import NewsSection from '../components/sections/NewsSection'
import EventsSection from '../components/sections/EventsSection'
import AboutSection from '../components/sections/AboutSection'
import WhyChooseUs from '../components/about/WhyChooseUs'
import ProgramsSection from '../components/sections/ProgramsSection'
import GallerySection from '../components/sections/GallerySection'
import AlumniSection from '../components/sections/AlumniSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import AdmissionsSection from '../components/sections/AdmissionsSection'

/**
 * Template B ("Heritage") — Home.
 *
 * The order below is this template's DEFAULT, not a fixed sequence. A school can
 * reorder or switch off any of these blocks; its choice lives in
 * `data.layout.home` and `data.hiddenSections` (see `lib/layout.ts`). A school
 * that has never touched the layout gets exactly this order.
 */
const BLOCKS: BlockRegistry = {
  hero: HeroSection,
  news: NewsSection,
  events: EventsSection,
  homeAbout: AboutSection,
  whyChooseUs: WhyChooseUs,
  programs: ProgramsSection,
  gallery: GallerySection,
  alumni: AlumniSection,
  testimonials: TestimonialsSection,
  admissionsCta: AdmissionsSection,
}

export const HOME_BLOCKS = [
  'hero',
  'news',
  'events',
  'homeAbout',
  'whyChooseUs',
  'programs',
  'gallery',
  'alumni',
  'testimonials',
  'admissionsCta',
] as const

export default function HomeView({ data, editing }: { data: SchoolData; editing?: boolean }) {
  return <>{renderBlocks(data, 'home', HOME_BLOCKS, BLOCKS, editing)}</>
}
