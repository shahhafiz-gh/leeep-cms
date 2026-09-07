import type { SchoolData } from '@/types/school.types'
import { renderBlocks } from '@/lib/render-blocks'
import type { BlockRegistry } from '@/lib/layout'
import HeroSection from '../components/HeroSection'
import ProgramsSection from '../components/ProgramsSection'
import TestimonialsSection from '../components/TestimonialsSection'
import WelcomeSection from '../components/WelcomeSection'
import QuoteAndNotices from '../components/QuoteAndNotices'
import StatsCounter from '../components/StatsCounter'
import AchievementsSection from '../components/AchievementsSection'
import GallerySection from '../components/GallerySection'

/**
 * Template H ("Heritage") — Home.
 *
 * The order below follows the school's existing home page: hero slider, the
 * quote-and-notices band, the counter strip, achievements, then the gallery. It
 * is this template's DEFAULT — a school can reorder or switch off any block, and
 * its choice lives in `data.layout.home` and `data.hiddenSections` (see
 * `lib/layout.ts`).
 *
 * Every block here is this template's own. Heritage's three home-page sections
 * (welcome, programs, testimonials) hardcode its gold hexes rather than reading
 * its tokens, so the `.template-h` remap cannot re-theme them — they would stay
 * gold on a brick-red site. Its welcome block also bundles a stats bar, which
 * would print the figures a second time above the counter strip.
 *
 * That only affects those three: the other thirty-nine Heritage components are
 * token-clean, so every INNER page is reused as-is and re-themes correctly.
 */
const BLOCKS: BlockRegistry = {
  hero: HeroSection,
  quoteNotices: QuoteAndNotices,
  homeAbout: WelcomeSection,
  stats: StatsCounter,
  achievements: AchievementsSection,
  programs: ProgramsSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
}

export const HOME_BLOCKS = [
  'hero',
  'quoteNotices',
  'homeAbout',
  'stats',
  'achievements',
  'programs',
  'gallery',
  'testimonials',
] as const

export default function HomeView({ data, editing }: { data: SchoolData; editing?: boolean }) {
  return (
    <div className="bg-white text-th-body">
      {renderBlocks(data, 'home', HOME_BLOCKS, BLOCKS, editing)}
    </div>
  )
}
