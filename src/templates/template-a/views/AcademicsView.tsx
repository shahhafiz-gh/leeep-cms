import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import AcademicsHero from '../components/academics/AcademicsHero'
import StreamsSection from '../components/academics/StreamsSection'
import MethodologySection from '../components/academics/MethodologySection'
import ResultsSection from '../components/academics/ResultsSection'
import ClubsSection from '../components/academics/ClubsSection'

/** Template A — Academics Page View (IEIskp style) */
export default function AcademicsView({ data }: { data: SchoolData }) {
  return (
    <div className="font-(family-name:--font-dm-sans) bg-ta-background text-ta-on-background">
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
    </div>
  )
}
