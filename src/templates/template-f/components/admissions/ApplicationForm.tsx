'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import AdmissionFormBody from '@/shared/AdmissionFormBody'
import { chrome } from './chrome'
import { useAdmissionForm } from '@/shared/useAdmissionForm'
import RulesStep from './RulesStep'
import { contactEntryValue } from '@/lib/contact-entry'

/**
 * Almanac's application form.
 *
 * Same contract as every other template's: the questions are derived from the
 * school's `Student Applicant` DocType plus its `Admission Form Profile` and
 * fetched at runtime (`shared/admission-schema.ts`), so the school changes the
 * form from the admin rather than through a redeploy. What stays here is Almanac's
 * flat, ruled language — hairline inputs on paper, no cards inside cards.
 *
 * Almanac wraps that form in two visible stages, because it does NOT repeat the
 * session's admission details on the admissions page:
 *
 *   1. the rules — what is open, what each class asks for, and the declaration
 *   2. the application — pick a class, answer the school's questions, submit
 *
 * Accepting in stage one is the same `termsAccepted` the submission carries, so
 * the shared body's own rules gate never fires a second time.
 */
export default function ApplicationForm({ data }: { data: SchoolData }) {
  const form = useAdmissionForm(contactEntryValue(data.contact?.phone?.[0]))
  const [onRules, setOnRules] = useState(true)

  // The staged flow only makes sense while there is an application to make: a
  // finished submission, a still-loading page, a closed or paused admission all
  // belong to the shared body, which already says the right thing for each.
  const staged =
    !form.submitted &&
    !form.loadingPrograms &&
    form.programs.length > 0 &&
    form.settings?.accepting_applications !== false

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

        {staged && (
          <Stepper
            current={onRules ? 0 : 1}
            // Going back to re-read the rules is always allowed; going forward
            // is exactly what the declaration unlocks.
            onSelect={(index) => {
              if (index === 0) setOnRules(true)
              else if (form.termsAccepted) setOnRules(false)
            }}
          />
        )}

        {staged && onRules ? (
          <RulesStep
            data={data}
            chrome={chrome}
            schoolName={data.name}
            terms={form.settings ? form.settings.terms_and_conditions : undefined}
            accepted={form.termsAccepted}
            onAcceptedChange={form.setTermsAccepted}
            onContinue={() => setOnRules(false)}
          />
        ) : (
          <AdmissionFormBody
            form={form}
            chrome={chrome}
            schoolName={data.name}
            successTitle="Application received."
            successText={`Thank you for applying to ${data.name}. Our admissions team will review your application and be in touch shortly.`}
          />
        )}
      </div>
    </section>
  )
}

const STEPS = [
  { label: 'Rules and regulations', hint: 'Read and accept' },
  { label: 'Your application', hint: 'Class and details' },
]

/**
 * Two ruled stages across the top. Numbered on purpose: unlike the DocType's own
 * tabs — an authoring detail whose count the school changes — these two are
 * fixed, so telling an applicant which one they are on is information they can
 * actually use.
 */
function Stepper({ current, onSelect }: { current: number; onSelect: (index: number) => void }) {
  return (
    <ol className="m-0 mb-10 grid list-none grid-cols-1 gap-0 border-t border-tf-border p-0 sm:grid-cols-2">
      {STEPS.map((step, index) => {
        const active = index === current
        const done = index < current
        return (
          <li key={step.label} className="border-b border-tf-border">
            <button
              type="button"
              onClick={() => onSelect(index)}
              className="flex w-full items-center gap-3.5 px-1 py-4 text-left transition-colors hover:text-tf-accent"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                  active
                    ? 'bg-tf-accent text-white'
                    : done
                      ? 'bg-tf-accent-wash text-tf-accent'
                      : 'border border-tf-border-strong text-tf-faint'
                }`}
              >
                {done ? <Icon icon="lucide:check" className="h-4 w-4" /> : index + 1}
              </span>
              <span className="flex flex-col">
                <span
                  className={`text-[15px] tracking-[-0.015em] ${active ? 'font-semibold text-tf-ink' : 'text-tf-body'}`}
                >
                  {step.label}
                </span>
                <span className="text-[12.5px] text-tf-faint">{step.hint}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
