'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionFormBody, { type AdmissionChrome } from '@/shared/AdmissionFormBody'
import { useAdmissionForm } from '@/shared/useAdmissionForm'

/**
 * Quill's application form.
 *
 * Same contract as every other template's: the questions are derived from the
 * school's `Student Applicant` DocType plus its `Admission Form Profile` and
 * fetched at runtime (`shared/admission-schema.ts`), so the school changes the
 * form from the admin rather than through a redeploy. What stays here is Quill's
 * flat, ruled language — hairline inputs on paper, no cards inside cards.
 */

const chrome: AdmissionChrome = {
  input:
    'w-full rounded-[10px] border border-td-border-strong bg-td-paper px-3.5 py-3 text-[15px] text-td-ink outline-none transition-colors focus:border-td-accent disabled:opacity-70',
  label: 'text-[13px] font-medium text-td-body',
  help: 'text-[12px] leading-[1.5] text-td-body/80',
  sectionTitle: 'text-[17px] tracking-[-0.02em] text-td-ink',
  heading: 'mb-6 border-b border-td-border pb-3 text-[21px] tracking-[-0.025em] text-td-ink',
  bodyText: 'text-[16px] leading-[1.6] text-td-body',
  stateTitle: 'text-[30px] tracking-[-0.025em] text-td-ink',
  errorText: 'text-[14px] text-td-accent',
  accentIcon: 'text-td-accent',
  grid: 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3',
  chip: 'inline-flex items-center gap-1.5 rounded-full border border-td-border bg-td-paper px-3 py-1.5 text-[12px] text-td-body',
  uploadCard:
    'cursor-pointer rounded-[10px] border border-dashed border-td-border-strong bg-td-paper p-6 text-center text-td-accent transition-colors hover:border-td-accent',
  uploadCardFilled:
    'cursor-pointer rounded-[10px] border border-dashed border-td-accent bg-td-paper p-6 text-center text-td-accent transition-colors',
  tick: 'accent-td-accent rounded',
  subtleButton: 'text-[13px] font-medium text-td-accent hover:underline',
  panel: 'rounded-[18px] border border-td-border bg-td-paper p-6',
  primaryButton:
    'inline-flex items-center gap-2 rounded-full bg-td-ink px-8 py-3.5 text-[14px] font-medium text-td-paper transition-opacity hover:opacity-90 disabled:opacity-60',
  secondaryButton:
    'inline-flex items-center gap-2 rounded-full border border-td-border-strong px-6 py-3.5 text-[14px] font-medium text-td-ink transition-colors hover:border-td-accent',
  stepActive: 'rounded-full bg-td-ink px-4 py-2 text-[13px] font-medium text-td-paper transition-colors',
  stepIdle:
    'rounded-full border border-td-border px-4 py-2 text-[13px] font-medium text-td-body transition-colors hover:border-td-accent',
}

export default function ApplicationForm({ data }: { data: SchoolData }) {
  const form = useAdmissionForm()

  return (
    <section
      id="admission-application-form"
      className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-18"
    >
      <div className="rounded-[28px] border border-td-border bg-td-card px-6 py-10 md:px-10 lg:px-14 lg:py-14">
        {!form.submitted && (
          <div className="mb-10">
            <h2 className="m-0 mb-2.5 text-[32px] text-td-ink sm:text-[38px] lg:text-[42px]">
              Start your application
            </h2>
            <p className="m-0 max-w-[60ch] text-[16px] leading-[1.6] text-td-body lg:text-[17px]">
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
