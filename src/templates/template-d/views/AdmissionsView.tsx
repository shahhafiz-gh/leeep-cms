import type { SchoolData } from '@/types/school.types'
import AdmissionsHero from '../components/admissions/AdmissionsHero'
import FeesSection from '../components/admissions/FeesSection'
import ApplicationForm from '../components/admissions/ApplicationForm'
import FaqSection from '../components/admissions/FaqSection'

/** Template D ("Quill") — Admissions. */
export default function AdmissionsView({ data }: { data: SchoolData }) {
  return (
    <>
      <AdmissionsHero data={data} />
      <FeesSection data={data} />
      {/* The form is the point of the page — but a school can switch it off and
          keep the process, fees and FAQs as an information-only page. */}
      {data.admissions?.formEnabled !== false && <ApplicationForm data={data} />}
      <FaqSection data={data} />
    </>
  )
}
