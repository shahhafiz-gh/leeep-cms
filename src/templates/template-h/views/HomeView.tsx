import type { SchoolData } from '@/types/school.types'
import HeroSection from '../components/HeroSection'
import ProgramsSection from '../components/ProgramsSection'
import TestimonialsSection from '../components/TestimonialsSection'
import WelcomeSection from '../components/WelcomeSection'
import QuoteAndNotices from '../components/QuoteAndNotices'
import StatsCounter from '../components/StatsCounter'
import AchievementsSection from '../components/AchievementsSection'
import GallerySection from '../components/GallerySection'

/**
 * Section order follows the school's existing home page: hero slider, the
 * quote-and-notices band, the counter strip, achievements, then the gallery.
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
export default function HomeView({ data }: { data: SchoolData }) {
  return (
    <div className="bg-white text-th-body">
      <HeroSection data={data} />
      <QuoteAndNotices data={data} />
      <WelcomeSection data={data} />
      <StatsCounter data={data} />
      <AchievementsSection data={data} />
      <ProgramsSection data={data} />
      <GallerySection data={data} />
      <TestimonialsSection data={data} />
    </div>
  )
}
