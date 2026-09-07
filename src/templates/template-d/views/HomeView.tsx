import type { SchoolData } from '@/types/school.types'
import { renderBlocks } from '@/lib/render-blocks'
import type { BlockRegistry } from '@/lib/layout'
import HeroSection from '../components/home/HeroSection'
import StatsSection from '../components/home/StatsSection'
import ProgramsSection from '../components/home/ProgramsSection'
import QuoteSection from '../components/home/QuoteSection'
import GallerySection from '../components/home/GallerySection'
import NewsSection from '../components/home/NewsSection'
import AdmissionsCta from '../components/home/AdmissionsCta'

/**
 * Template D ("Quill") — Home.
 *
 * The order below is this template's DEFAULT, not a fixed sequence. A school can
 * reorder or switch off any of these blocks; its choice lives in
 * `data.layout.home` and `data.hiddenSections` (see `lib/layout.ts`). A school
 * that has never touched the layout gets exactly this order.
 */
const BLOCKS: BlockRegistry = {
  hero: HeroSection,
  stats: StatsSection,
  programs: ProgramsSection,
  quote: QuoteSection,
  gallery: GallerySection,
  news: NewsSection,
  admissionsCta: AdmissionsCta,
}

export const HOME_BLOCKS = [
  'hero',
  'stats',
  'programs',
  'quote',
  'gallery',
  'news',
  'admissionsCta',
] as const

export default function HomeView({ data, editing }: { data: SchoolData; editing?: boolean }) {
  return <>{renderBlocks(data, 'home', HOME_BLOCKS, BLOCKS, editing)}</>
}
