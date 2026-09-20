'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useClientSearchParams } from './hooks/useClientSearchParams'
import { fieldFormatError } from './admission-formats'
import {
  ageEligibilityError,
  fetchAdmissionPrograms,
  fetchAdmissionSchema,
  groupSchemaFields,
  initialValues,
  isFieldRequired,
  isFieldVisible,
  isFileField,
  isChildTable,
  submitAdmissionApplication,
  type AdmissionCriteria,
  type AdmissionSchema,
  type FormValue,
  type FormValues,
  type SchemaStep,
} from './admission-schema'

/** What is wrong with each answer, by fieldname. Empty means the step is clean. */
export type FieldErrors = Record<string, string>

/** Which field to reveal after a failed Continue, and a token so repeating the
 * same failure still scrolls. */
export interface InvalidFocus {
  fieldname: string
  token: number
}

/**
 * All the behaviour behind the public admission form, so each template only has
 * to supply markup and class names.
 *
 * The flow the schema implies:
 *   1. pick a class — the class decides the age window, the fee and (because a
 *      school can scope an `Admission Form Profile` to it) the field set itself
 *   2. fill the steps the form's sections define
 *   3. accept the declaration and submit
 *
 * Every step is checked as the family leaves it, never only at the end: a
 * question answered wrongly on step two is theirs to fix while they can still
 * see it, and each offending control is named so the form can paint it red.
 */
export function useAdmissionForm(contactPhone?: string) {
  const formRef = useRef<HTMLFormElement>(null)

  // The admissions page hands over which intake (and often which class) the
  // family chose, so the form opens where they left off instead of asking again.
  //
  // Read after mount (see useClientSearchParams): this page is statically
  // rendered and cached, so the query cannot be known while the HTML is being
  // produced. The prefill lands on hydration, which is before anyone has
  // finished reading the first field.
  const searchParams = useClientSearchParams()
  const admissionFromUrl = searchParams?.get('admission') ?? ''
  const programFromUrl = searchParams?.get('program') ?? ''

  const [programs, setPrograms] = useState<AdmissionCriteria[]>([])
  const [program, setProgramState] = useState(programFromUrl)
  const [schema, setSchema] = useState<AdmissionSchema | null>(null)

  const [values, setValues] = useState<FormValues>({})
  // Attachments live here rather than in their <input>: only the active step is
  // mounted, so a file left in an uncontrolled input is lost the moment the
  // family presses Continue — and then reported missing at submit, on a step
  // they can no longer see.
  const [files, setFiles] = useState<Record<string, File>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  const [stepIndex, setStepIndex] = useState(0)
  // The furthest step the family has reached. The stepper lets them click any
  // step up to here (back, or forward into ground they already cleared) but not
  // skip ahead past required fields they have not answered yet.
  const [maxStepReached, setMaxStepReached] = useState(0)
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [loadingSchema, setLoadingSchema] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [invalidFocus, setInvalidFocus] = useState<InvalidFocus | null>(null)
  const [eligibilityDialogOpen, setEligibilityDialogOpen] = useState(false)

  const setProgram = useCallback((value: string) => {
    setProgramState(value)
    setFieldErrors({})
    setError(null)
    if (!value) setSchema(null)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const result = await fetchAdmissionPrograms(undefined, admissionFromUrl || undefined)
      if (cancelled) return
      const open = result?.programs ?? []
      setPrograms(open)
      setProgramState((current) => {
        // Honour the class carried over from the admissions page, but only if it
        // is genuinely still open — a stale or hand-edited link must not select
        // a class the school is not admitting into.
        //
        // `programFromUrl` is consulted alongside `current` because the query is
        // now read after mount: on the first pass it was still empty, so the
        // deep-linked class arrives with this re-run rather than in the initial
        // state.
        const wanted = current || programFromUrl
        if (wanted && open.some((entry) => entry.program === wanted)) return wanted
        // One open class is not a choice; skip straight to the questions.
        return open.length === 1 ? open[0].program : ''
      })
      setLoadingPrograms(false)
    })()
    return () => {
      cancelled = true
    }
  }, [admissionFromUrl, programFromUrl])

  useEffect(() => {
    if (!program) return
    let cancelled = false
    ;(async () => {
      setLoadingSchema(true)
      const criteria = programs.find((entry) => entry.program === program)
      const result = await fetchAdmissionSchema(program, criteria?.academic_year)
      if (cancelled) return
      setSchema(result)
      // Keep whatever the family already typed; only fill in gaps the school
      // pre-fills, so switching class doesn't wipe the form.
      setValues((current) => ({ ...initialValues(result?.fields ?? []), ...current }))
      setStepIndex(0)
      setMaxStepReached(0)
      setLoadingSchema(false)
    })()
    return () => {
      cancelled = true
    }
  }, [program, programs])

  const steps: SchemaStep[] = useMemo(
    () => (schema ? groupSchemaFields(schema.fields) : []),
    [schema],
  )
  const criteria = schema?.criteria ?? null
  const settings = schema?.settings ?? null

  /** Drop one field's complaint — answering it is the fix, so the red goes at once. */
  const clearFieldError = useCallback((fieldname: string) => {
    setFieldErrors((current) => {
      if (!(fieldname in current)) return current
      const next = { ...current }
      delete next[fieldname]
      return next
    })
  }, [])

  const setValue = useCallback(
    (fieldname: string, value: FormValue) => {
      setValues((current) => ({ ...current, [fieldname]: value }))
      clearFieldError(fieldname)
      setError(null)
      if (fieldname === 'date_of_birth') setEligibilityDialogOpen(false)
    },
    [clearFieldError],
  )

  const setFile = useCallback(
    (fieldname: string, file: File | null) => {
      setFiles((current) => {
        const next = { ...current }
        if (file) next[fieldname] = file
        else delete next[fieldname]
        return next
      })
      if (file) {
        clearFieldError(fieldname)
        setError(null)
      }
    },
    [clearFieldError],
  )

  /**
   * Everything wrong on one step (or across every step when `index` is omitted):
   * required answers left blank, and answers whose format the server would
   * reject anyway — Aadhaar, PEN, phone, email.
   */
  const errorsOn = useCallback(
    (index?: number): FieldErrors => {
      const scope = index === undefined ? steps : steps.slice(index, index + 1)
      const errors: FieldErrors = {}
      for (const step of scope) {
        for (const section of step.sections) {
          for (const field of section.fields) {
            if (!isFieldVisible(field, values)) continue
            const required = isFieldRequired(field, values)
            const label = field.label || field.fieldname

            if (isFileField(field)) {
              if (required && !(files[field.fieldname] instanceof File)) {
                errors[field.fieldname] = `Please attach ${label}.`
              }
              continue
            }
            if (isChildTable(field)) {
              const rows = values[field.fieldname]
              if (required && (!Array.isArray(rows) || !rows.length)) {
                errors[field.fieldname] = `Please add at least one ${label.replace(/s$/, '')}.`
              }
              continue
            }

            const text = String(values[field.fieldname] ?? '').trim()
            if (!text) {
              if (required) errors[field.fieldname] = `${label} is required.`
              continue
            }
            const message = fieldFormatError(field.fieldname, text, label)
            if (message) errors[field.fieldname] = message
          }
        }
      }
      return errors
    },
    [steps, values, files],
  )

  /**
   * One line above the buttons — where the family just pressed. It only points
   * upwards: every problem is already written beside the answer that caused it,
   * so repeating it here would say the same thing twice.
   */
  const summarise = useCallback((errors: FieldErrors): string => {
    const count = Object.keys(errors).length
    return count === 1
      ? 'Please check the highlighted question above before continuing.'
      : `Please check the ${count} highlighted questions above before continuing.`
  }, [])

  /** Show the problems and send the family to the first of them. */
  const reportErrors = useCallback(
    (errors: FieldErrors) => {
      setFieldErrors(errors)
      setError(summarise(errors))
      setInvalidFocus({ fieldname: Object.keys(errors)[0], token: Date.now() })
    },
    [summarise],
  )

  /** The class's own age rule, checked while the family is still filling in. */
  const eligibilityError = useMemo(
    () => ageEligibilityError(criteria, values.date_of_birth as string | undefined, contactPhone),
    [criteria, values.date_of_birth, contactPhone],
  )

  const goNext = useCallback(() => {
    if (!steps.length) return
    const errors = errorsOn(stepIndex)
    if (Object.keys(errors).length) {
      reportErrors(errors)
      return
    }
    if (eligibilityError) {
      setError(eligibilityError)
      setEligibilityDialogOpen(true)
      return
    }
    setError(null)
    setFieldErrors({})
    setStepIndex((current) => {
      const next = Math.min(current + 1, steps.length - 1)
      setMaxStepReached((furthest) => Math.max(furthest, next))
      return next
    })
  }, [errorsOn, stepIndex, steps.length, eligibilityError, reportErrors])

  const goBack = useCallback(() => {
    setError(null)
    setStepIndex((current) => Math.max(current - 1, 0))
  }, [])

  /**
   * Jump straight to a step from the stepper. Allowed only up to the furthest
   * step already reached, so a family can revisit anything they have passed
   * through without skipping the required fields on a step they have not seen.
   */
  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index > maxStepReached) return
      setError(null)
      setStepIndex(index)
    },
    [maxStepReached],
  )

  const isLastStep = steps.length > 0 && stepIndex === steps.length - 1

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (submitting || !schema) return

      // Each step in turn, so a problem is shown on the step that owns it
      // rather than as a complaint about a question the family cannot see.
      for (let index = 0; index < steps.length; index++) {
        const errors = errorsOn(index)
        if (Object.keys(errors).length) {
          setStepIndex(index)
          setMaxStepReached((furthest) => Math.max(furthest, index))
          reportErrors(errors)
          return
        }
      }
      if (eligibilityError) {
        setError(eligibilityError)
        setEligibilityDialogOpen(true)
        return
      }
      if (settings?.require_terms_acceptance && !termsAccepted) {
        setError('Please accept the declaration to submit your application.')
        return
      }

      setError(null)
      setFieldErrors({})
      setSubmitting(true)
      const result = await submitAdmissionApplication({
        schema,
        values,
        files,
        termsAccepted,
        honeypot,
      })
      setSubmitting(false)

      if (!result.ok) {
        setError(result.error)
        return
      }
      setSuccessMessage(result.message ?? settings?.success_message ?? null)
      // `applicant` is the Student Applicant name — the application number the
      // family quotes to check their status. Without it the confirmation step
      // has nothing actionable to show.
      setApplicationNumber(result.applicant ?? null)
      setSubmitted(true)
    },
    [
      submitting,
      schema,
      steps.length,
      errorsOn,
      reportErrors,
      eligibilityError,
      settings,
      termsAccepted,
      values,
      files,
      honeypot,
    ],
  )

  return {
    formRef,
    // data
    programs,
    program,
    setProgram,
    schema,
    steps,
    criteria,
    settings,
    values,
    setValue,
    files,
    setFile,
    // declaration + anti-spam
    termsAccepted,
    setTermsAccepted,
    honeypot,
    setHoneypot,
    // navigation
    stepIndex,
    setStepIndex,
    maxStepReached,
    goToStep,
    goNext,
    goBack,
    isLastStep,
    // state
    loading: loadingPrograms || loadingSchema,
    loadingPrograms,
    submitting,
    submitted,
    applicationNumber,
    successMessage,
    error,
    fieldErrors,
    invalidFocus,
    eligibilityError,
    eligibilityDialogOpen,
    dismissEligibilityDialog: () => setEligibilityDialogOpen(false),
    submit,
  }
}
