import type { SchoolData } from '@/types/school.types'
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
      <StreamsSection data={data} />
      <MethodologySection data={data} />
      <ResultsSection data={data} />
      <ClubsSection data={data} />
    </>
  )
}
