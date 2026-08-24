'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionFormBody from '@/shared/AdmissionFormBody'
import { chrome } from './chrome'
import { useAdmissionForm } from '@/shared/useAdmissionForm'
import { contactEntryValue } from '@/lib/contact-entry'

/**
 * Template B's admission application form.
 *
 * The questions come from the school's own `Student Applicant` DocType plus its
 * `Admission Form Profile`, fetched at runtime — see `shared/admission-schema.ts`.
 * This file only carries Template B's look; the flow lives in `AdmissionFormBody`.
 */

export default function ApplicationForm({ data }: { data: SchoolData }) {
  const form = useAdmissionForm(contactEntryValue(data.contact?.phone?.[0]))

  return (
    <section id="admission-application-form" className="py-16 md:py-24 bg-tb-primary-50/30">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">Apply Now</p>
          <h2 className="text-3xl md:text-4xl font-bold text-tb-heading mb-3">Start Your Application</h2>
          <p className="text-tb-body text-lg max-w-2xl mx-auto leading-relaxed">
            Please fill out the details below to begin the admission process.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-tb-border p-6 md:p-10">
          <AdmissionFormBody form={form} chrome={chrome} schoolName={data.name} />
        </div>
      </div>
    </section>
  )
}
