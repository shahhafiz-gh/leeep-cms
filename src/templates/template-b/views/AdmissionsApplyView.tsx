import type { SchoolData } from '@/types/school.types'
import PageHero from '../components/common/PageHero'
import ApplicationForm from '../components/admissions/ApplicationForm'
import BackToAdmissions from '@/shared/BackToAdmissions'

/** Template B — the application form on its own page. */
export default function AdmissionsApplyView({ data }: { data: SchoolData }) {
  return (
    <div className="font-[family-name:var(--font-hind)] bg-tb-background text-tb-foreground">
      <PageHero
        eyebrow="Admissions"
        title="Apply"
        description="Complete the form below to begin your application."
      />
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-8">
        <BackToAdmissions className="inline-flex items-center gap-2 text-sm font-semibold text-tb-primary-400 hover:underline" />
      </div>
      <ApplicationForm data={data} />
    </div>
  )
}
