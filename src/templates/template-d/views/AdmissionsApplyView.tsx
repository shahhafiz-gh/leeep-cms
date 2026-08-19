import type { SchoolData } from '@/types/school.types'
import ApplicationForm from '../components/admissions/ApplicationForm'
import BackToAdmissions from '@/shared/BackToAdmissions'

/** Template D ("Quill") — the application form on its own page. */
export default function AdmissionsApplyView({ data }: { data: SchoolData }) {
  return (
    <>
      <div className="mx-auto max-w-[1400px] px-5 pt-10 md:px-8 lg:px-12">
        <BackToAdmissions className="inline-flex items-center gap-2 text-[14px] font-medium text-td-accent hover:underline" />
      </div>
      <ApplicationForm data={data} />
    </>
  )
}
