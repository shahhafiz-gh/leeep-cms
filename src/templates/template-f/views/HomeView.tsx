import type { SchoolData } from '@/types/school.types'
import { renderBlocks } from '@/lib/render-blocks'
import type { BlockRegistry } from '@/lib/layout'
import HeroSection from '../components/home/HeroSection'
import NotificationsSection from '../components/home/NotificationsSection'
import ProgramsSection from '../components/home/ProgramsSection'
import GallerySection from '../components/home/GallerySection'
import SocialSpaceSection from '../components/home/SocialSpaceSection'
import MagazineSection from '../components/home/MagazineSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import NewsSection from '../components/home/NewsSection'
import AdmissionsCta from '../components/home/AdmissionsCta'

/**
 * Template F ("Almanac") — Home.
 *
 * The order below is Almanac's DEFAULT, not a fixed sequence: a school can
 * reorder or switch off any of these blocks and its choice is stored in
 * `data.layout.home` (see `lib/layout.ts`). A school that has never touched it
 * gets exactly this order.
 *
 * The default differs from Quill's in one deliberate way: the noticeboard takes
 * the slot directly under the hero, where Quill puts its stats band. On a school
 * site that position belongs to whatever changed this week — the people who
 * visit most are already enrolled and are checking for news, not being sold to.
 *
 * After that the page alternates paper and ink panels: programmes, the drifting
 * gallery, the social wall (ink), the magazine shelf, testimonials, then events.
 */
const BLOCKS: BlockRegistry = {
  hero: HeroSection,
  notifications: NotificationsSection,
  programs: ProgramsSection,
  gallery: GallerySection,
  socialSpace: SocialSpaceSection,
  magazine: MagazineSection,
  testimonials: TestimonialsSection,
  news: NewsSection,
  admissionsCta: AdmissionsCta,
}

export const HOME_BLOCKS = [
  'hero',
  'notifications',
  'programs',
  'gallery',
  'socialSpace',
  'magazine',
  'testimonials',
  'news',
  'admissionsCta',
] as const

export default function HomeView({ data, editing }: { data: SchoolData; editing?: boolean }) {
  return <>{renderBlocks(data, 'home', HOME_BLOCKS, BLOCKS, editing)}</>
}
