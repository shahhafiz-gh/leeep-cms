import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import AboutHero from '../components/about/AboutHero'
import ValuesSection from '../components/about/ValuesSection'
import HistorySection from '../components/about/HistorySection'
import MissionSection from '../components/about/MissionSection'

/** Template D ("Almanac") — About. */
export default function AboutView({ data }: { data: SchoolData }) {
  return (
    <>
      <AboutHero data={data} />
      <PageSection id="why-choose">
        <ValuesSection data={data} />
      </PageSection>
      <PageSection id="story">
        <HistorySection data={data} />
      </PageSection>
      <PageSection id="vision-mission">
        <MissionSection data={data} />
      </PageSection>
    </>
  )
}
