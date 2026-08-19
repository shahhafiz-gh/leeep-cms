'use client'

import type { ReactNode } from 'react'
import { Icon } from '@iconify/react'
import AdmissionFormFields, { type AdmissionFormStyles } from './AdmissionFormFields'
import type { useAdmissionForm } from './useAdmissionForm'

/**
 * The whole public application form, minus the template's outer shell.
 *
 * Every template renders the same flow — pick a class, answer the steps the
 * school's DocType defines, accept the declaration, submit — so it lives here
 * once. Templates supply their own look through `chrome` and wrap this in their
 * own section markup, which is the part that should differ between designs.
 */

export interface AdmissionChrome extends AdmissionFormStyles {
  /** Small pill used for the class's criteria (age window, fee, closing date). */
  chip: string
  /** Primary and secondary actions. */
  primaryButton: string
  secondaryButton: string
  /** Step navigation pills. */
  stepActive: string
  stepIdle: string
  /** The declaration panel. */
  panel: string
  /** Step heading. */
  heading: string
  /** Body copy (intro, declaration, empty states). */
  bodyText: string
  /** Heading used by the empty / success states. */
  stateTitle: string
  errorText: string
  accentIcon: string
}

export interface AdmissionFormBodyProps {
  form: ReturnType<typeof useAdmissionForm>
  chrome: AdmissionChrome
  schoolName: string
  /** Optional per-template copy for the state panels. */
  successTitle?: string
  successText?: string
}

export default function AdmissionFormBody({
  form,
  chrome,
  schoolName,
  successTitle = 'Application Submitted',
  successText,
}: AdmissionFormBodyProps): ReactNode {
  const {
    formRef,
    programs,
    program,
    setProgram,
    steps,
    criteria,
    settings,
    values,
    setValue,
    termsAccepted,
    setTermsAccepted,
    honeypot,
    setHoneypot,
    stepIndex,
    setStepIndex,
    goNext,
    goBack,
    isLastStep,
    loading,
    loadingPrograms,
    submitting,
    submitted,
    successMessage,
    error,
    eligibilityError,
    submit,
  } = form

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <Icon icon="lucide:check-circle-2" className={`text-5xl ${chrome.accentIcon}`} />
        <h3 className={chrome.stateTitle}>{successTitle}</h3>
        <p className={`max-w-[52ch] ${chrome.bodyText}`}>
          {successMessage ??
            successText ??
            `Thank you for applying to ${schoolName}. Our admissions team will review your application and contact you shortly.`}
        </p>
      </div>
    )
  }

  if (loadingPrograms) {
    return (
      <div className={`flex items-center justify-center gap-3 py-14 ${chrome.bodyText}`}>
        <Icon icon="lucide:loader-2" className="animate-spin text-2xl" />
        <span>Loading the application form…</span>
      </div>
    )
  }

  if (!programs.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <Icon icon="lucide:calendar-clock" className={`text-4xl ${chrome.accentIcon}`} />
        <h3 className={chrome.stateTitle}>Admissions are closed</h3>
        <p className={`max-w-[52ch] ${chrome.bodyText}`}>
          There is no class open for application right now. Please check back, or contact us for the next
          admission window.
        </p>
      </div>
    )
  }

  if (settings && !settings.accepting_applications) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <Icon icon="lucide:pause-circle" className={`text-4xl ${chrome.accentIcon}`} />
        <h3 className={chrome.stateTitle}>Applications are paused</h3>
        <p className={`max-w-[52ch] ${chrome.bodyText}`}>
          We are not accepting online applications at the moment. Please contact the school office.
        </p>
      </div>
    )
  }

  const activeStep = steps[stepIndex]

  return (
    <form ref={formRef} className="flex flex-col gap-10" noValidate onSubmit={submit}>
      {/* Which class — it decides the age window, the fee, and (when the school
          scopes a form profile to it) the questions themselves. */}
      <div>
        <h3 className={chrome.heading}>Class you are applying for</h3>
        <div className={chrome.grid ?? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}>
          <div className={chrome.field ?? 'flex flex-col gap-1.5'}>
            <label className={chrome.label}>
              Class<span className="text-red-500"> *</span>
            </label>
            <select
              className={chrome.input}
              value={program}
              onChange={(event) => setProgram(event.target.value)}
            >
              <option value="">Select class</option>
              {programs.map((entry) => (
                <option key={`${entry.program}-${entry.academic_year}`} value={entry.program}>
                  {entry.label}
                  {entry.academic_year ? ` — ${entry.academic_year}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {criteria && (
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {(criteria.min_age || criteria.max_age) && (
              <span className={chrome.chip}>
                <Icon icon="lucide:cake" />
                Age {criteria.min_age ?? 0}
                {criteria.max_age ? `–${criteria.max_age}` : '+'} years
                {criteria.age_as_on ? ` as on ${criteria.age_as_on}` : ''}
              </span>
            )}
            {criteria.application_fee > 0 && (
              <span className={chrome.chip}>
                <Icon icon="lucide:receipt-indian-rupee" />
                Application fee {criteria.application_fee}
              </span>
            )}
            {criteria.admission_end_date && (
              <span className={chrome.chip}>
                <Icon icon="lucide:calendar-days" />
                Closes {criteria.admission_end_date}
              </span>
            )}
          </div>
        )}
        {criteria?.description && <p className={`${chrome.help} mt-3`}>{criteria.description}</p>}
      </div>

      {settings?.intro_message && (
        <div className={`${chrome.bodyText} [&_*]:my-1`} dangerouslySetInnerHTML={{ __html: settings.intro_message }} />
      )}

      {loading && program && (
        <div className={`flex items-center gap-3 ${chrome.bodyText}`}>
          <Icon icon="lucide:loader-2" className="animate-spin text-xl" />
          <span>Loading the questions for this class…</span>
        </div>
      )}

      {!loading && activeStep && (
        <>
          {/* One step per tab the school's doctype defines. */}
          {steps.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.label || index}
                  type="button"
                  onClick={() => setStepIndex(index)}
                  className={index === stepIndex ? chrome.stepActive : chrome.stepIdle}
                >
                  {index + 1}. {step.label || 'Details'}
                </button>
              ))}
            </div>
          )}

          <div>
            <h3 className={chrome.heading}>
              {steps.length > 1 ? `${stepIndex + 1}. ` : ''}
              {activeStep.label || 'Application details'}
            </h3>
            <AdmissionFormFields step={activeStep} values={values} onChange={setValue} styles={chrome} />
          </div>
        </>
      )}

      {!loading && program && (
        <div className={chrome.panel}>
          {settings?.require_terms_acceptance && (
            <>
              <h3 className={chrome.heading}>Declaration</h3>
              {settings.terms_and_conditions ? (
                <div
                  className={`${chrome.bodyText} mb-4 [&_*]:my-1`}
                  dangerouslySetInnerHTML={{ __html: settings.terms_and_conditions }}
                />
              ) : (
                <p className={`${chrome.bodyText} mb-4`}>
                  I hereby declare that the information provided above is true and correct to the best of my
                  knowledge. I understand that any false information may lead to the cancellation of admission.
                </p>
              )}
              <label className={`flex items-start gap-2 cursor-pointer mb-6 ${chrome.label}`}>
                <input
                  className={`mt-1 ${chrome.tick ?? ''}`}
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                />
                <span>
                  I agree to abide by the rules and regulations of {schoolName}.
                  <span className="text-red-500"> *</span>
                </span>
              </label>
            </>
          )}

          {/* Bots fill in everything they can see; a person never sees this. */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />

          <div className="flex flex-col items-end gap-3">
            {(error || eligibilityError) && (
              <p className={`self-stretch text-right ${chrome.errorText}`} role="alert">
                {error || eligibilityError}
              </p>
            )}
            <div className="flex items-center gap-3">
              {stepIndex > 0 && (
                <button type="button" onClick={goBack} className={chrome.secondaryButton}>
                  Back
                </button>
              )}
              {!isLastStep ? (
                <button type="button" onClick={goNext} className={chrome.primaryButton}>
                  Continue
                  <Icon icon="lucide:arrow-right" />
                </button>
              ) : (
                <button type="submit" disabled={submitting} className={chrome.primaryButton}>
                  {submitting && <Icon icon="lucide:loader-2" className="animate-spin text-lg" />}
                  {submitting ? 'Submitting…' : settings?.submit_button_label || 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
