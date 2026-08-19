'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionFormBody, { type AdmissionChrome } from '@/shared/AdmissionFormBody'
import { useAdmissionForm } from '@/shared/useAdmissionForm'

/**
 * Template B's admission application form.
 *
 * The questions come from the school's own `Student Applicant` DocType plus its
 * `Admission Form Profile`, fetched at runtime — see `shared/admission-schema.ts`.
 * This file only carries Template B's look; the flow lives in `AdmissionFormBody`.
 */

const chrome: AdmissionChrome = {
  input:
    'w-full border border-tb-border rounded-lg px-4 py-3 text-tb-heading placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-tb-primary-400 focus:border-tb-primary-400 transition-colors bg-white disabled:opacity-70',
  label: 'block text-sm font-semibold text-tb-heading mb-2',
  help: 'text-xs text-tb-body',
  sectionTitle: 'text-lg font-bold text-tb-heading',
  heading: 'text-xl font-bold text-tb-heading mb-5 border-b border-tb-border pb-3',
  bodyText: 'text-tb-body leading-relaxed',
  stateTitle: 'text-2xl font-bold text-tb-heading',
  errorText: 'text-sm font-medium text-red-600',
  accentIcon: 'text-tb-primary-400',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5',
  chip: 'inline-flex items-center gap-1.5 rounded-full border border-tb-border bg-tb-primary-50/60 px-3 py-1.5 text-xs font-medium text-tb-body',
  uploadCard:
    'border-2 border-dashed border-tb-border rounded-xl p-6 text-center transition-colors cursor-pointer bg-tb-primary-50/30 hover:bg-tb-primary-50 text-tb-primary-400',
  uploadCardFilled:
    'border-2 border-dashed border-tb-primary-400 rounded-xl p-6 text-center transition-colors cursor-pointer bg-tb-primary-50 text-tb-primary-400',
  tick: 'accent-tb-primary-400 rounded',
  subtleButton: 'text-sm font-semibold text-tb-primary-400 hover:underline',
  panel: 'bg-tb-primary-50/40 border border-tb-border rounded-xl p-6',
  primaryButton:
    'inline-flex items-center gap-2 bg-tb-primary-400 text-white font-semibold rounded-lg px-8 py-3.5 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60',
  secondaryButton:
    'inline-flex items-center gap-2 border border-tb-border text-tb-heading font-semibold rounded-lg px-6 py-3.5 hover:bg-white transition-colors',
  stepActive: 'rounded-lg px-4 py-2 text-sm font-semibold bg-tb-primary-400 text-white transition-colors',
  stepIdle:
    'rounded-lg px-4 py-2 text-sm font-semibold bg-white border border-tb-border text-tb-body hover:text-tb-heading transition-colors',
}

export default function ApplicationForm({ data }: { data: SchoolData }) {
  const form = useAdmissionForm()

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
