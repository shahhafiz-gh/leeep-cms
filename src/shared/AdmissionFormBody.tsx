'use client'

import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import AdmissionFormFields, { type AdmissionFormStyles } from './AdmissionFormFields'
import type { AdmissionInfoChrome } from './AdmissionInfoBody'
import type { useAdmissionForm } from './useAdmissionForm'
import RichText from './RichText'

/**
 * The whole public application form, minus the template's outer shell.
 *
 * Every template renders the same flow — pick a class, answer the steps the
 * school's DocType defines, accept the declaration, submit — so it lives here
 * once. Templates supply their own look through `chrome` and wrap this in their
 * own section markup, which is the part that should differ between designs.
 */

/**
 * One template's complete admission look — shared by the information page and
 * the form page, so a template defines its language once.
 */
export interface AdmissionChrome extends AdmissionFormStyles, AdmissionInfoChrome {
  errorText: string
}

export interface AdmissionFormBodyProps {
  form: ReturnType<typeof useAdmissionForm>
  chrome: AdmissionChrome
  schoolName: string
  /** Optional per-template copy for the state panels. */
  successTitle?: string
  successText?: string
}

/** Keep the focused form control inside the part of the page left visible by
 * mobile software keyboards. VisualViewport is absent on older browsers, where
 * the browser's native focus scrolling remains the fallback. */
function revealFocusedControl(form: HTMLFormElement | null) {
  const viewport = window.visualViewport
  const focused = document.activeElement
  if (!viewport || !form || !(focused instanceof HTMLElement) || !form.contains(focused)) return

  const keyboardInset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
  if (keyboardInset < 80) return

  const rect = focused.getBoundingClientRect()
  const visibleTop = viewport.offsetTop + 16
  const visibleBottom = viewport.offsetTop + viewport.height - 24
  if (rect.bottom > visibleBottom) {
    window.scrollBy({ top: rect.bottom - visibleBottom, behavior: 'auto' })
  } else if (rect.top < visibleTop) {
    window.scrollBy({ top: rect.top - visibleTop, behavior: 'auto' })
  }
}

export default function AdmissionFormBody({
  form,
  chrome,
  schoolName,
  successTitle = 'Application Submitted',
  successText,
}: AdmissionFormBodyProps): ReactNode {
  const successRef = useRef<HTMLDivElement>(null)
  const activeStepRef = useRef<HTMLDivElement>(null)
  const classSelectorRef = useRef<HTMLDivElement>(null)
  const didRevealClassSelector = useRef(false)
  const [keyboardInset, setKeyboardInset] = useState(0)
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
    applicationNumber,
    successMessage,
    error,
    eligibilityError,
    eligibilityDialogOpen,
    dismissEligibilityDialog,
    submit,
  } = form
  const activeStep = steps[stepIndex]
  const previousStepIndex = useRef(stepIndex)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    let frame = 0
    const updateKeyboardSpace = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        setKeyboardInset(inset >= 80 ? inset : 0)
        if (inset >= 80) revealFocusedControl(formRef.current)
      })
    }

    updateKeyboardSpace()
    viewport.addEventListener('resize', updateKeyboardSpace)
    viewport.addEventListener('scroll', updateKeyboardSpace)
    return () => {
      window.cancelAnimationFrame(frame)
      viewport.removeEventListener('resize', updateKeyboardSpace)
      viewport.removeEventListener('scroll', updateKeyboardSpace)
    }
  }, [formRef])

  const keyboardStyle = keyboardInset
    ? ({
        paddingBottom: `${keyboardInset + 24}px`,
        scrollPaddingBottom: `${keyboardInset + 24}px`,
      } as CSSProperties)
    : undefined

  const handleFormFocus = (event: FocusEvent<HTMLFormElement>) => {
    if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement)) return
    // The keyboard viewport resize is asynchronous on iOS. This delayed pass
    // complements the VisualViewport resize listener when focus moves between
    // controls while the keyboard is already open.
    window.setTimeout(() => revealFocusedControl(formRef.current), 250)
  }

  useEffect(() => {
    if (loadingPrograms || !programs.length || didRevealClassSelector.current) return
    const target = classSelectorRef.current
    if (!target) return
    didRevealClassSelector.current = true
    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [loadingPrograms, programs.length, termsAccepted])

  useEffect(() => {
    if (!submitted) return

    // The multi-step form is much taller than the confirmation. On mobile the
    // browser can preserve the old bottom scroll offset AND calculate its first
    // smooth scroll against the still-open keyboard. Blur the field/button,
    // reveal the TOP of the confirmation, then re-anchor after the visual
    // viewport has settled so the result cannot remain above the screen.
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) activeElement.blur()

    let secondFrame = 0
    let settleTimer = 0
    const reveal = (behavior: ScrollBehavior) => {
      const target = successRef.current
      if (!target) return
      target.scrollIntoView({ behavior, block: 'start' })
    }
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const target = successRef.current
        if (!target) return
        target.focus({ preventScroll: true })
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const mobile = window.matchMedia('(max-width: 640px)').matches
        reveal(reduceMotion || mobile ? 'auto' : 'smooth')
        // Mobile Safari/Chrome resize the visual viewport only after the
        // software keyboard finishes closing. One final non-animated anchor is
        // intentionally boring and reliable.
        settleTimer = window.setTimeout(() => reveal('auto'), 450)
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      if (secondFrame) window.cancelAnimationFrame(secondFrame)
      if (settleTimer) window.clearTimeout(settleTimer)
    }
  }, [submitted, applicationNumber])

  useEffect(() => {
    if (previousStepIndex.current === stepIndex) return
    previousStepIndex.current = stepIndex

    // Continue/Back replaces one potentially tall group of questions with the
    // next. Return the reader to that group's heading instead of leaving mobile
    // users beside the navigation buttons at the bottom of the new step.
    let secondFrame = 0
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const target = activeStepRef.current
        if (!target) return
        target.focus({ preventScroll: true })
        target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        })
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      if (secondFrame) window.cancelAnimationFrame(secondFrame)
    }
  }, [stepIndex])

  // Final step. A confirmation that only says "thank you" leaves a family with
  // nothing to do and nothing to keep; the application number and where to use
  // it are the whole point of this screen.
  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="flex scroll-mt-24 flex-col items-center gap-4 py-14 text-center outline-none"
      >
        <span className="admission-success-tick inline-flex rounded-full" aria-hidden="true">
          <Icon icon="lucide:check-circle-2" className={`text-5xl ${chrome.accentIcon}`} />
        </span>
        <h3 className={chrome.stateTitle}>{successTitle}</h3>
        <p className={`max-w-[52ch] ${chrome.bodyText}`}>
          {successMessage ??
            successText ??
            `Thank you for applying to ${schoolName}. Our admissions team will review your application and contact you shortly.`}
        </p>

        {applicationNumber && (
          <div
            aria-label={`Your application number is ${applicationNumber}`}
            className={`${chrome.panel} mt-2 w-full max-w-[46ch] text-left`}
          >
            <p className={`m-0 mb-1 text-[12px] uppercase tracking-[0.14em] ${chrome.bodyText}`}>
              Your application number
            </p>
            {/* Selectable and monospaced: this is a reference a parent will copy
                or write down, not decoration. */}
            <p className="m-0 font-mono text-[22px] font-semibold break-all select-all">
              {applicationNumber}
            </p>
            <p className={`m-0 mt-3 ${chrome.bodyText}`}>
              Keep this number. You can check your application status any time with it and the
              student&rsquo;s date of birth.
            </p>
            <Link href="/admissions/status" className={`${chrome.primaryButton} mt-4 inline-flex`}>
              Check application status
              <Icon icon="lucide:arrow-right" />
            </Link>
          </div>
        )}
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

  const requiresTerms = Boolean(settings?.require_terms_acceptance)
  // The gate only stands while there is something to agree TO and it has not
  // been agreed yet; once accepted it never reappears, including on Back.
  const showRulesGate = requiresTerms && !termsAccepted && Boolean(program)

  if (showRulesGate) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className={chrome.heading}>Admission rules</h3>
          {settings?.terms_and_conditions ? (
            <RichText html={settings.terms_and_conditions} className={chrome.bodyText} />
          ) : (
            <p className={chrome.bodyText}>
              Please read these before you begin. By continuing you confirm that the information you
              provide will be true and correct to the best of your knowledge, and you understand that
              incorrect information may lead to the cancellation of admission.
            </p>
          )}
        </div>

        <div className={chrome.panel}>
          <label className={`flex cursor-pointer items-start gap-2 ${chrome.label}`}>
            <input
              className={`mt-1 ${chrome.tick ?? ''}`}
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
            />
            <span>
              I have read and agree to abide by the rules and regulations of {schoolName}.
              <span className="text-red-500"> *</span>
            </span>
          </label>

          <div className="mt-6 flex justify-end">
            {/* Disabled rather than hidden: the applicant can see what unlocks
                the form, instead of a button appearing out of nowhere. */}
            <button
              type="button"
              disabled={!termsAccepted}
              onClick={() => setStepIndex(0)}
              className={`${chrome.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Next
              <Icon icon="lucide:arrow-right" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-10"
      style={keyboardStyle}
      noValidate
      onFocusCapture={handleFormFocus}
      onSubmit={submit}
    >
      {/* Which class — it decides the age window, the fee, and (when the school
          scopes a form profile to it) the questions themselves. */}
      <div ref={classSelectorRef} id="admission-class-selector" className="scroll-mt-28">
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

      {/* The school's introduction belongs to the form as a whole, so it is said
          once, on the first step — repeating it above every step buried the
          questions under instructions the family had already read. */}
      {settings?.intro_message && stepIndex === 0 && (
        <RichText html={settings.intro_message} className={chrome.bodyText} />
      )}

      {loading && program && (
        <div className={`flex items-center gap-3 ${chrome.bodyText}`}>
          <Icon icon="lucide:loader-2" className="animate-spin text-xl" />
          <span>Loading the questions for this class…</span>
        </div>
      )}

      {!loading && activeStep && (
        <>
          {/* No numbered step strip: the count follows the school's sections and
              changes with their configuration, and numbering them told an applicant
              how much was left without letting them act on it. Back / Continue
              carry the navigation. */}
          <div ref={activeStepRef} tabIndex={-1} className="scroll-mt-28 outline-none">
            <h3 className={chrome.heading}>{activeStep.label || 'Application details'}</h3>
            <AdmissionFormFields step={activeStep} values={values} onChange={setValue} styles={chrome} />
          </div>
        </>
      )}

      {!loading && program && (
        <div className={chrome.panel}>
          {/* The declaration is asked up front, on the rules step, so it does not
              reappear here. */}

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
              <p className={`self-stretch whitespace-pre-line text-left ${chrome.errorText}`} role="alert">
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

      {eligibilityDialogOpen && eligibilityError && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) dismissEligibilityDialog()
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="eligibility-dialog-title"
            aria-describedby="eligibility-dialog-description"
            className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 text-slate-900 shadow-2xl sm:p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
              <Icon icon="lucide:circle-alert" className="h-6 w-6" />
            </div>
            <h3 id="eligibility-dialog-title" className="m-0 text-xl font-semibold text-slate-950">
              Applicant is not eligible
            </h3>
            <p id="eligibility-dialog-description" className="mt-3 whitespace-pre-line text-[15px] leading-7 text-slate-700">
              {eligibilityError}
            </p>
            <button
              type="button"
              autoFocus
              onClick={dismissEligibilityDialog}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Review date of birth
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
