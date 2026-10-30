'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionFormBody from '@/shared/AdmissionFormBody'
import { chrome } from './chrome'
import { useAdmissionForm } from '@/shared/useAdmissionForm'

/**
 * Template A's admission application form.
 *
 * The QUESTIONS are not written here — they are derived from the school's
 * `Student Applicant` DocType and its `Admission Form Profile` and fetched at
 * runtime (see `shared/admission-schema.ts`), so a school that adds a field to
 * the doctype, or hides one in the admin, changes this form with no redeploy.
 * This file supplies Template A's look and its section chrome; the flow itself
 * lives in `AdmissionFormBody`.
 */

export default function ApplicationFormSection({ data }: { data: SchoolData }) {
  const form = useAdmissionForm()

  return (
    <section id="admission-application-form" className="bg-ta-surface-container-lowest py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-background mb-2 tracking-tight">
            Start Your Application
          </h2>
          <p className="font-(family-name:--font-ta-body-lg) text-lg text-ta-on-surface-variant max-w-2xl mx-auto">
            Please fill out the details below to begin the admission process.
          </p>
        </div>

        <div className="bg-ta-surface-container-lowest border border-ta-outline-variant rounded-xl p-6 md:p-10 shadow-sm">
          <AdmissionFormBody
            form={form}
            chrome={chrome}
            schoolName={data.name}
            rulesTitle={data.admissions?.rulesTitle}
          />
        </div>
      </div>
    </section>
  )
}
