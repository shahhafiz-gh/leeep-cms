'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionFormBody from '@/shared/AdmissionFormBody'
import { chrome } from './chrome'
import { useAdmissionForm } from '@/shared/useAdmissionForm'

/**
 * Almanac's application form.
 *
 * Same contract as every other template's: the questions are derived from the
 * school's `Student Applicant` DocType plus its `Admission Form Profile` and
 * fetched at runtime (`shared/admission-schema.ts`), so the school changes the
 * form from the admin rather than through a redeploy. What stays here is Almanac's
 * flat, ruled language — hairline inputs on paper, no cards inside cards.
 */

export default function ApplicationForm({ data }: { data: SchoolData }) {
  const form = useAdmissionForm()

  return (
    <section
      id="admission-application-form"
      className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-18"
    >
      <div className="rounded-[28px] border border-tf-border bg-tf-card px-6 py-10 md:px-10 lg:px-14 lg:py-14">
        {!form.submitted && (
          <div className="mb-10">
            <h2 className="m-0 mb-2.5 text-[32px] text-tf-ink sm:text-[38px] lg:text-[42px]">
              Start your application
            </h2>
            <p className="m-0 max-w-[60ch] text-[16px] leading-[1.6] text-tf-body lg:text-[17px]">
              Everything below is read by a person, not a filter. Take your time.
            </p>
          </div>
        )}

        <AdmissionFormBody
          form={form}
          chrome={chrome}
          schoolName={data.name}
          successTitle="Application received."
          successText={`Thank you for applying to ${data.name}. Our admissions team will review your application and be in touch shortly.`}
        />
      </div>
    </section>
  )
}
