import type { SchoolData } from '@/types/school.types'
import ApplicationForm from '../components/admissions/ApplicationForm'
import BackToAdmissions from '@/shared/BackToAdmissions'

/**
 * Template F ("Almanac") — the application form on its own page, with the
 * session's rules as its first step (see `ApplicationForm`).
 */
export default function AdmissionsApplyView({ data }: { data: SchoolData }) {
  return (
    <>
      <div className="mx-auto max-w-[1400px] px-5 pt-10 md:px-8 lg:px-12">
        {/* The admission details now live on THIS page, so the way back leads
            to the admissions page itself rather than to a block that moved. */}
        <BackToAdmissions
          label="Back to admissions"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-tf-accent hover:underline"
        />
      </div>
      <ApplicationForm data={data} />
    </>
  )
}
