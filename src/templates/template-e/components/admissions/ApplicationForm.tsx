'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionFormBody from '@/shared/AdmissionFormBody'
import { chrome } from './chrome'
import { useAdmissionForm } from '@/shared/useAdmissionForm'
import { Container } from '../common/Bits'

/**
 * Ledger's application form.
 *
 * Same contract as every other template's: the questions are derived from the
 * school's `Student Applicant` DocType plus its `Admission Form Profile` and
 * fetched at runtime (`shared/admission-schema.ts`). What stays here is Ledger's
 * paper-form language — square white fields, serif rules, no cards inside cards.
 */

export default function ApplicationForm({ data }: { data: SchoolData }) {
  const form = useAdmissionForm()

  return (
    <div
      id="admission-application-form"
      className="mt-12 border-t border-te-rule bg-te-panel py-12 lg:mt-14 lg:py-14"
    >
      <Container>
        {!form.submitted && (
          <div className="mb-9 max-w-[720px]">
            <h2 className="m-0 mb-3 text-[26px] text-te-ink sm:text-[32px]">Application</h2>
            <p className="m-0 text-[16px] leading-[1.7] text-te-body">
              Every file is read by a committee, not a filter. Take your time; fields marked with an
              asterisk are required.
            </p>
          </div>
        )}

        <AdmissionFormBody
          form={form}
          chrome={chrome}
          schoolName={data.name}
          successTitle="Thank you — we have your application."
          successText={`A member of the admissions team at ${data.name} will review it and reply shortly.`}
        />
      </Container>
    </div>
  )
}
