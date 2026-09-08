import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import PageHero from '@/templates/template-b/components/common/PageHero'
import StreamsSection from '@/templates/template-b/components/academics/StreamsSection'
import MethodologySection from '@/templates/template-b/components/academics/MethodologySection'
import ResultsSection from '@/templates/template-b/components/academics/ResultsSection'
import ClubsSection from '@/templates/template-b/components/academics/ClubsSection'
import AcademicResources from '../components/AcademicResources'

/**
 * Template H — Academics.
 *
 * Heritage's academics sections, followed by the school's downloads. The old
 * site hung Syllabus / Referred Books / Notebooks off its Academics menu, and
 * they belong to academics rather than to a downloads page the renderer has no
 * route for.
 */
export default function AcademicsView({ data }: { data: SchoolData }) {
  return (
    <div className="font-[family-name:var(--font-hind)] bg-tb-background text-tb-foreground">
      <PageHero
        eyebrow={data.academics?.subtitle || 'Academic Excellence'}
        eyebrowEditPath="academics.subtitle"
        title={data.academics?.title || 'Academics'}
        titleEditPath="academics.title"
        description={data.academics?.description}
        descriptionEditPath="academics.description"
      />
      <PageSection id="streams">
        <StreamsSection data={data} />
      </PageSection>
      <PageSection id="methodology">
        <MethodologySection data={data} />
      </PageSection>
      <PageSection id="results">
        <ResultsSection data={data} />
      </PageSection>
      <PageSection id="clubs">
        <ClubsSection data={data} />
      </PageSection>
      <AcademicResources data={data} />
    </div>
  )
}
