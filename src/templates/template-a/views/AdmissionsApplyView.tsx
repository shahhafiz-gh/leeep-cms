import type { SchoolData } from '@/types/school.types'
import ApplicationFormSection from '../components/admissions/ApplicationFormSection'
import BackToAdmissions from '@/shared/BackToAdmissions'

/** Template A — the application form on its own page. */
export default function AdmissionsApplyView({ data }: { data: SchoolData }) {
  return (
    <div className="font-(family-name:--font-dm-sans) bg-ta-background text-ta-on-background">
      <div className="container mx-auto px-4 md:px-6 pt-10">
        <BackToAdmissions className="inline-flex items-center gap-2 font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-primary hover:underline" />
      </div>
      <ApplicationFormSection data={data} />
    </div>
  )
}
