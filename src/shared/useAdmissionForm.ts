'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
  filePartName,
  type AdmissionCriteria,
  type AdmissionSchema,
  type FormValue,
  type FormValues,
  type SchemaStep,
} from './admission-schema'

/**
 * All the behaviour behind the public admission form, so each template only has
 * to supply markup and class names.
 *
 * The flow the schema implies:
 *   1. pick a class — the class decides the age window, the fee and (because a
 *      school can scope an `Admission Form Profile` to it) the field set itself
 *   2. fill the steps the DocType's tabs define
 *   3. accept the declaration and submit
 */
export function useAdmissionForm() {
  const formRef = useRef<HTMLFormElement>(null)

  // The admissions page hands over which intake (and often which class) the
  // family chose, so the form opens where they left off instead of asking again.
  const searchParams = useSearchParams()
  const admissionFromUrl = searchParams?.get('admission') ?? ''
  const programFromUrl = searchParams?.get('program') ?? ''

  const [programs, setPrograms] = useState<AdmissionCriteria[]>([])
  const [program, setProgram] = useState(programFromUrl)
  const [schema, setSchema] = useState<AdmissionSchema | null>(null)

  const [values, setValues] = useState<FormValues>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  const [stepIndex, setStepIndex] = useState(0)
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [loadingSchema, setLoadingSchema] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showErrors, setShowErrors] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const result = await fetchAdmissionPrograms(undefined, admissionFromUrl || undefined)
      if (cancelled) return
      const open = result?.programs ?? []
      setPrograms(open)
      setProgram((current) => {
        // Honour the class carried over from the admissions page, but only if it
        // is genuinely still open — a stale or hand-edited link must not select
        // a class the school is not admitting into.
        if (current && open.some((entry) => entry.program === current)) return current
        // One open class is not a choice; skip straight to the questions.
        return open.length === 1 ? open[0].program : ''
      })
      setLoadingPrograms(false)
    })()
    return () => {
      cancelled = true
    }
  }, [admissionFromUrl])

  useEffect(() => {
    if (!program) {
      setSchema(null)
      return
    }
    let cancelled = false
    setLoadingSchema(true)
    ;(async () => {
      const criteria = programs.find((entry) => entry.program === program)
      const result = await fetchAdmissionSchema(program, criteria?.academic_year)
      if (cancelled) return
      setSchema(result)
      // Keep whatever the family already typed; only fill in gaps the school
      // pre-fills, so switching class doesn't wipe the form.
      setValues((current) => ({ ...initialValues(result?.fields ?? []), ...current }))
      setStepIndex(0)
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

  const setValue = useCallback((fieldname: string, value: FormValue) => {
    setValues((current) => ({ ...current, [fieldname]: value }))
  }, [])

  /**
   * Missing answers on one step (or across every step when `index` is omitted).
   * Files are checked against the live form because their inputs are
   * uncontrolled — and a hidden required file input would otherwise make the
   * browser block submission with nothing on screen to explain why.
   */
  const missingOn = useCallback(
    (index?: number): string[] => {
      const scope = index === undefined ? steps : steps.slice(index, index + 1)
      const formData = formRef.current ? new FormData(formRef.current) : null
      const missing: string[] = []
      for (const step of scope) {
        for (const section of step.sections) {
          for (const field of section.fields) {
            if (!isFieldVisible(field, values) || !isFieldRequired(field, values)) continue
            if (isFileField(field)) {
              const file = formData?.get(filePartName(field.fieldname))
              if (!(file instanceof File) || file.size === 0) missing.push(field.label)
            } else if (isChildTable(field)) {
              const rows = values[field.fieldname]
              if (!Array.isArray(rows) || !rows.length) missing.push(field.label)
            } else {
              const value = values[field.fieldname]
              if (value === undefined || String(value).trim() === '') missing.push(field.label)
            }
          }
        }
      }
      return missing
    },
    [steps, values],
  )

  /** The class's own age rule, checked while the family is still filling in. */
  const eligibilityError = useMemo(
    () => ageEligibilityError(criteria, values.date_of_birth as string | undefined),
    [criteria, values.date_of_birth],
  )

  const goNext = useCallback(() => {
    const missing = missingOn(stepIndex)
    if (missing.length) {
      setShowErrors(true)
      setError(`Please answer: ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? '…' : ''}`)
      return
    }
    if (eligibilityError) {
      setError(eligibilityError)
      return
    }
    setError(null)
    setShowErrors(false)
    setStepIndex((current) => Math.min(current + 1, steps.length - 1))
  }, [missingOn, stepIndex, steps.length, eligibilityError])

  const goBack = useCallback(() => {
    setError(null)
    setStepIndex((current) => Math.max(current - 1, 0))
  }, [])

  const isLastStep = steps.length > 0 && stepIndex === steps.length - 1

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (submitting || !schema) return

      const missing = missingOn()
      if (missing.length) {
        setShowErrors(true)
        setError(`Please answer: ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? '…' : ''}`)
        return
      }
      if (eligibilityError) {
        setError(eligibilityError)
        return
      }
      if (settings?.require_terms_acceptance && !termsAccepted) {
        setError('Please accept the declaration to submit your application.')
        return
      }

      setError(null)
      setSubmitting(true)
      const result = await submitAdmissionApplication({
        schema,
        values,
        form: event.currentTarget,
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
    [submitting, schema, missingOn, eligibilityError, settings, termsAccepted, values, honeypot],
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
    // declaration + anti-spam
    termsAccepted,
    setTermsAccepted,
    honeypot,
    setHoneypot,
    // navigation
    stepIndex,
    setStepIndex,
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
    showErrors,
    eligibilityError,
    submit,
  }
}
