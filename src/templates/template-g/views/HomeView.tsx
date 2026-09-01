import type { SchoolData } from '@/types/school.types'
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
 * Section order follows the Baramulla Public School reference: hero, welcome,
 * notices, registration callout, institutional strengths, achievements,
 * facilities and community media. The content itself remains CMS-owned.
 */
export default function HomeView({ data }: { data: SchoolData }) {
  return (
    <div className="bg-tb-background text-tb-foreground">
      <HeroSection data={data} />
      <AboutSection data={data} />
      <Noticeboard data={data} />
      <AdmissionsSection data={data} />
      <InstitutionalHighlights data={data} />
      <ProgramsSection data={data} />
      <AchievementsSection data={data} />
      <FacilitiesSection data={data} />
      <GallerySection data={data} />
      <AlumniSection data={data} />
      <TestimonialsSection data={data} />
    </div>
  )
}
