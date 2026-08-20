import type { SchoolData } from '@/types/school.types'
import AdmissionStatusBody from '@/shared/AdmissionStatusBody'
import { chrome } from '../components/admissions/chrome'
import BackToAdmissions from '@/shared/BackToAdmissions'

/**
 * Quill — "check my application status", on its own route.
 *
 * A family that applied online has an application number and nothing to do with
 * it; this is where they use it. Kept off /admissions so that page stays an
 * information page, and this stays linkable from the confirmation screen.
 */
export default function AdmissionsStatusView({ data }: { data: SchoolData }) {
  return (
    <section className="mx-auto max-w-[900px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
      <BackToAdmissions className="mb-8 inline-flex items-center gap-2 text-[14px] font-medium text-td-accent hover:underline" />
      <h1 className="m-0 mb-3 text-[34px] leading-[1.05] text-td-ink sm:text-[42px] lg:text-[48px]">
        Check your application status
      </h1>
      <p className="m-0 mb-10 max-w-[60ch] text-[16px] leading-[1.6] text-td-body lg:text-[17px]">
        Enter the application number you were given when you applied, along with the
        student&rsquo;s date of birth.
      </p>
      <AdmissionStatusBody chrome={chrome} schoolName={data.name} />
    </section>
  )
}
