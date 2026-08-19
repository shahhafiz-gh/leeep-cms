import type { SchoolData } from '@/types/school.types'
import AdmissionsHero from '../components/admissions/AdmissionsHero'
import WhyChooseSection from '../components/admissions/WhyChooseSection'
import AdmissionDetailsSection from '../components/admissions/AdmissionDetailsSection'
import AdmissionsFaqSection from '../components/admissions/AdmissionsFaqSection'

/**
 * Template A — Admissions Page View (IEIskp style).
 *
 * An INFORMATION page: the process, why the school, and the live admission
 * details from `Student Admission`. The form itself is a separate page
 * (`/admissions/apply`) so this one stays readable and can honestly say
 * "we are not admitting" without a dead form under it.
 */
export default function AdmissionsView({ data }: { data: SchoolData }) {
  return (
    <div className="font-(family-name:--font-dm-sans) bg-ta-background text-ta-on-background">
      <AdmissionsHero data={data} />
      <WhyChooseSection data={data} />
      <AdmissionDetailsSection data={data} />
      <AdmissionsFaqSection data={data} />
    </div>
  )
}
