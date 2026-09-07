import type { SchoolData } from '@/types/school.types'
import { renderBlocks } from '@/lib/render-blocks'
import type { BlockRegistry } from '@/lib/layout'
import HeroSection from '../components/home/HeroSection'
import AnnouncementsSection from '../components/home/AnnouncementsSection'
import EventsSection from '../components/home/EventsSection'
import WhyChooseUsSection from '../components/home/WhyChooseUsSection'
import StatsSection from '../components/home/StatsSection'
import AboutSection from '../components/home/AboutSection'
import ProgramsSection from '../components/home/ProgramsSection'
import GallerySection from '../components/home/GallerySection'
import AlumniSection from '../components/home/AlumniSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import AdmissionsSection from '../components/home/AdmissionsSection'

/**
 * Template A ("Willow") — Home.
 *
 * The order below is this template's DEFAULT, not a fixed sequence. A school can
 * reorder or switch off any of these blocks; its choice lives in
 * `data.layout.home` and `data.hiddenSections` (see `lib/layout.ts`). A school
 * that has never touched the layout gets exactly this order.
 */
const BLOCKS: BlockRegistry = {
  hero: HeroSection,
  announcements: AnnouncementsSection,
  events: EventsSection,
  whyChooseUs: WhyChooseUsSection,
  stats: StatsSection,
  homeAbout: AboutSection,
  programs: ProgramsSection,
  gallery: GallerySection,
  alumni: AlumniSection,
  testimonials: TestimonialsSection,
  admissionsCta: AdmissionsSection,
}

export const HOME_BLOCKS = [
  'hero',
  'announcements',
  'events',
  'whyChooseUs',
  'stats',
  'homeAbout',
  'programs',
  'gallery',
  'alumni',
  'testimonials',
  'admissionsCta',
] as const

export default function HomeView({ data, editing }: { data: SchoolData; editing?: boolean }) {
  return <>{renderBlocks(data, 'home', HOME_BLOCKS, BLOCKS, editing)}</>
}
