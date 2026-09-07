import type { SchoolData } from '@/types/school.types'
import { renderBlocks } from '@/lib/render-blocks'
import type { BlockRegistry } from '@/lib/layout'
import AboutSection from '@/templates/template-b/components/sections/AboutSection'
import AdmissionsSection from '@/templates/template-b/components/sections/AdmissionsSection'
import ProgramsSection from '@/templates/template-b/components/sections/ProgramsSection'
import GallerySection from '@/templates/template-b/components/sections/GallerySection'
import TestimonialsSection from '@/templates/template-b/components/sections/TestimonialsSection'
import AlumniSection from '@/templates/template-b/components/sections/AlumniSection'
import HeroSection from '../components/HeroSection'
import Noticeboard from '../components/Noticeboard'
import InstitutionalHighlights from '../components/InstitutionalHighlights'
import AchievementsSection from '../components/AchievementsSection'
import FacilitiesSection from '../components/FacilitiesSection'

/**
 * Template G ("Baramulla") — Home.
 *
 * The order below follows the Baramulla Public School reference: hero, welcome,
 * notices, registration callout, institutional strengths, achievements,
 * facilities and community media. It is this template's DEFAULT, not a fixed
 * sequence — a school can reorder or switch off any block, and its choice lives
 * in `data.layout.home` and `data.hiddenSections` (see `lib/layout.ts`). The
 * content itself remains CMS-owned.
 *
 * The ids are shared vocabulary, not per-template names: `homeAbout` is the same
 * id here as in Willow, so a school that reorders its home page and then changes
 * template keeps the order it chose. `achievements` and `facilities` are new
 * with this template; blocks a template does not have are ignored rather than
 * breaking the page.
 */
const BLOCKS: BlockRegistry = {
  hero: HeroSection,
  homeAbout: AboutSection,
  announcements: Noticeboard,
  admissionsCta: AdmissionsSection,
  whyChooseUs: InstitutionalHighlights,
  programs: ProgramsSection,
  achievements: AchievementsSection,
  facilities: FacilitiesSection,
  gallery: GallerySection,
  alumni: AlumniSection,
  testimonials: TestimonialsSection,
}

export const HOME_BLOCKS = [
  'hero',
  'homeAbout',
  'announcements',
  'admissionsCta',
  'whyChooseUs',
  'programs',
  'achievements',
  'facilities',
  'gallery',
  'alumni',
  'testimonials',
] as const

export default function HomeView({ data, editing }: { data: SchoolData; editing?: boolean }) {
  return (
    <div className="bg-tb-background text-tb-foreground">
      {renderBlocks(data, 'home', HOME_BLOCKS, BLOCKS, editing)}
    </div>
  )
}
