'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionFormBody, { type AdmissionChrome } from '@/shared/AdmissionFormBody'
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

const chrome: AdmissionChrome = {
  input:
    'w-full border border-ta-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-ta-primary focus:border-ta-primary bg-ta-surface-container-lowest text-ta-on-surface font-(family-name:--font-ta-body-md) text-ta-body-md transition-colors disabled:opacity-70',
  label: 'font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface font-bold',
  help: 'font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant',
  sectionTitle: 'font-(family-name:--font-ta-h3) text-xl text-ta-on-surface',
  heading:
    'font-(family-name:--font-ta-h3) text-2xl text-ta-on-surface mb-5 border-b border-ta-outline-variant pb-3',
  bodyText: 'font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant',
  stateTitle: 'font-(family-name:--font-ta-h3) text-2xl text-ta-on-surface',
  errorText: 'font-(family-name:--font-ta-body-md) text-ta-body-md text-red-600',
  accentIcon: 'text-ta-primary',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  chip: 'inline-flex items-center gap-1.5 rounded-full bg-ta-surface-container-low border border-ta-outline-variant px-3 py-1.5 font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant',
  uploadCard:
    'border-2 border-dashed border-ta-outline-variant bg-ta-surface-container-low hover:bg-ta-surface-container rounded-xl p-6 text-center transition-colors cursor-pointer text-ta-primary',
  uploadCardFilled:
    'border-2 border-dashed border-ta-primary bg-ta-surface-container-low rounded-xl p-6 text-center transition-colors cursor-pointer text-ta-primary',
  tick: 'accent-ta-primary rounded',
  subtleButton: 'font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-primary hover:underline',
  panel: 'bg-ta-surface-container-low p-6 rounded-xl border border-ta-outline-variant',
  primaryButton:
    'inline-flex items-center gap-2 bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full px-8 py-4 hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:hover:scale-100',
  secondaryButton:
    'inline-flex items-center gap-2 border border-ta-outline-variant text-ta-on-surface font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full px-6 py-4 hover:bg-ta-surface-container transition-colors',
  stepActive:
    'rounded-full px-4 py-2 font-(family-name:--font-ta-label-md) text-ta-label-md bg-ta-primary-container text-ta-on-primary transition-colors',
  stepIdle:
    'rounded-full px-4 py-2 font-(family-name:--font-ta-label-md) text-ta-label-md bg-ta-surface-container-low text-ta-on-surface-variant hover:bg-ta-surface-container transition-colors',
}

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
          <AdmissionFormBody form={form} chrome={chrome} schoolName={data.name} />
        </div>
      </div>
    </section>
  )
}
