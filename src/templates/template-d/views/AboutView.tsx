import type { SchoolData } from '@/types/school.types'
import AboutHero from '../components/about/AboutHero'
import ValuesSection from '../components/about/ValuesSection'
import HistorySection from '../components/about/HistorySection'
import MissionSection from '../components/about/MissionSection'

/** Template D ("Quill") — About. */
export default function AboutView({ data }: { data: SchoolData }) {
  return (
    <>
      <AboutHero data={data} />
      <ValuesSection data={data} />
      <HistorySection data={data} />
      <MissionSection data={data} />
    </>
  )
}
