import type { SchoolData } from '@/types/school.types'
import PageHero from '../components/common/PageHero'
import AdmissionRequirements from '../components/admissions/AdmissionRequirements'
import AdmissionDetailsSection from '../components/admissions/AdmissionDetailsSection'
import AdmissionFaqSection from '../components/admissions/AdmissionFaqSection'

/**
 * Template B — Admissions Page View (Kashmir-Cambridge style).
 *
 * An INFORMATION page: requirements, the live admission details from
 * `Student Admission`, and FAQs. The form is a separate page (`/admissions/apply`).
 */
export default function AdmissionsView({ data }: { data: SchoolData }) {
  return (
    <div className="font-[family-name:var(--font-hind)] bg-tb-background text-tb-foreground">
      <PageHero
        eyebrow="Join Our Vibrant Community"
        title="Admissions"
        description={data.admissions.description}
      />
      <AdmissionRequirements data={data} />
      <AdmissionDetailsSection data={data} />
      <AdmissionFaqSection data={data} />
    </div>
  )
}
