import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import AcademicsHero from '../components/academics/AcademicsHero'
import StreamsSection from '../components/academics/StreamsSection'
import MethodologySection from '../components/academics/MethodologySection'
import ResultsSection from '../components/academics/ResultsSection'
import ClubsSection from '../components/academics/ClubsSection'

/** Template D ("Almanac") — Academics. */
export default function AcademicsView({ data }: { data: SchoolData }) {
  return (
    <>
      <AcademicsHero data={data} />
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
    </>
  )
}
