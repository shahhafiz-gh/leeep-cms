'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useClientSearchParams } from './hooks/useClientSearchParams'
import {
  ageEligibilityError,
  fetchAdmissionPrograms,
  fetchAdmissionSchema,
  groupSchemaFields,
  initialValues,
  isFieldVisible,
  submitAdmissionApplication,
  STRUCTURAL_TYPES,
  type AdmissionCriteria,
  type AdmissionSchema,
  type FormValue,
  type FormValues,
  type SchemaField,
  type SchemaStep,
} from './admission-schema'
import {
  collectErrors,
  fieldError,
  fieldForServerMessage,
  stepFields,
  type FieldErrors,
  type FormFiles,
} from './admission-validation'

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
 * Validation runs AT THE FIELD: a question is checked when the family leaves it
 * and again on Continue, each problem is shown under the control it belongs to,
 * and a rejected submit jumps back to the step that owns the first bad answer.
 * Anything the browser can decide — required, Aadhaar length, a phone number, an
 * email address, the class's age window — is decided here rather than being
 * saved up for the server to refuse at the end (which is what the last screen
 * used to do, naming fields the family could no longer see).
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
  /**
   * The live answers and files, mirrored outside React state.
   *
   * A `<select>` blurs in the same tick it changes, and the blur handler closes
   * over the render that produced it — so the check that runs on blur would
   * otherwise judge the PREVIOUS answer and flag a field the family has just
   * filled in correctly.
   */
  const valuesRef = useRef<FormValues>({})
  const filesRef = useRef<FormFiles>({})
  /**
   * Chosen files, held HERE rather than in the `<input type="file">` elements.
   *
   * Only the current step is mounted, so an uncontrolled input from step two is
   * gone from the DOM the moment the family clicks Continue — which is why
   * attachments had to be picked again after every step change, and why the
   * final check reported them as missing.
   */
  const [files, setFiles] = useState<FormFiles>({})
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
  /** Per-field problems, keyed by fieldname — what the controls render. */
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [eligibilityDialogOpen, setEligibilityDialogOpen] = useState(false)

  // Written in an effect, not during render: the setters below already refresh
  // them synchronously, and this only catches the state changes that come from
  // elsewhere (the schema's prefill, a class change).
  useEffect(() => {
    valuesRef.current = values
  }, [values])
  useEffect(() => {
    filesRef.current = files
  }, [files])

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
      setFieldErrors({})
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

  /** Every answerable field, by fieldname — used to re-check one at a time. */
  const fieldIndex = useMemo(() => {
    const index: Record<string, SchemaField> = {}
    for (const field of schema?.fields ?? []) {
      if (STRUCTURAL_TYPES.has(field.fieldtype)) continue
      index[field.fieldname] = field
    }
    return index
  }, [schema])

  /** Drop one field's error — used the moment an answer changes. */
  const clearFieldError = useCallback((fieldname: string) => {
    setFieldErrors((current) => {
      if (!current[fieldname]) return current
      const next = { ...current }
      delete next[fieldname]
      return next
    })
  }, [])

  const setValue = useCallback(
    (fieldname: string, value: FormValue) => {
      valuesRef.current = { ...valuesRef.current, [fieldname]: value }
      setValues((current) => ({ ...current, [fieldname]: value }))
      // Typing is a correction in progress: take the red away now and judge the
      // answer again when the family leaves the field.
      clearFieldError(fieldname)
      if (fieldname === 'date_of_birth') {
        setEligibilityDialogOpen(false)
      }
      setError(null)
    },
    [clearFieldError],
  )

  const setFile = useCallback(
    (fieldname: string, file: File | null) => {
      const next = { ...filesRef.current }
      if (file) next[fieldname] = file
      else delete next[fieldname]
      filesRef.current = next
      setFiles(next)
      clearFieldError(fieldname)
      setError(null)
    },
    [clearFieldError],
  )

  /**
   * The class's age rule, mirrored for the same reason as the answers: the DOB
   * field's own check runs on blur and must see the verdict for what was just
   * typed. Assigned from the memo below, which is where it is derived.
   */
  const eligibilityRef = useRef<string | null>(null)

  /**
   * Check ONE field, when the family leaves it. This is what turns "everything
   * is wrong at the end" into "this answer is wrong, here, now".
   */
  const validateField = useCallback(
    (fieldname: string) => {
      const field = fieldIndex[fieldname]
      if (!field) return
      const message =
        fieldError(field, valuesRef.current, filesRef.current) ||
        (fieldname === 'date_of_birth' ? eligibilityRef.current ?? '' : '')
      setFieldErrors((current) => {
        if (!message && !current[fieldname]) return current
        const next = { ...current }
        if (message) next[fieldname] = message
        else delete next[fieldname]
        return next
      })
    },
    [fieldIndex],
  )

  /** Put the family in front of the first thing they have to fix. */
  const focusField = useCallback((fieldname: string) => {
    const form = formRef.current
    if (!form) return
    const holder = form.querySelector<HTMLElement>(`[data-field="${CSS.escape(fieldname)}"]`)
    if (!holder) return
    holder.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    })
    const control = holder.querySelector<HTMLElement>(
      'input:not([type="hidden"]):not([type="file"]), select, textarea, button[type="button"]',
    )
    control?.focus({ preventScroll: true })
  }, [])

  /** A short summary for the panel by the buttons; the detail is at each field. */
  const summarise = useCallback((errors: FieldErrors): string => {
    const messages = Object.values(errors)
    if (!messages.length) return ''
    if (messages.length === 1) return messages[0]
    return `Please check ${messages.length} answers highlighted above.`
  }, [])

  /**
   * Validate one step (or the whole form when `index` is omitted) and show the
   * result. Returns the fieldname of the first problem, or null when clean.
   */
  const validate = useCallback(
    (index?: number): string | null => {
      const scope = index === undefined ? steps : steps.slice(index, index + 1)
      const errors = collectErrors(scope, valuesRef.current, filesRef.current)
      // Only the checked fields' verdicts change; a problem found on another
      // step stays on record until that step is re-checked.
      const checked = new Set(scope.flatMap((step) => stepFields(step)).map((f) => f.fieldname))
      // The age window belongs to the date of birth, so it is shown there as
      // well as in the dialog — a family that comes back to the step still sees
      // why it was refused.
      if (checked.has('date_of_birth') && eligibilityRef.current && !errors.date_of_birth) {
        errors.date_of_birth = eligibilityRef.current
      }
      setFieldErrors((current) => {
        const next: FieldErrors = {}
        for (const [fieldname, message] of Object.entries(current)) {
          if (!checked.has(fieldname)) next[fieldname] = message
        }
        return { ...next, ...errors }
      })

      const ordered = scope
        .flatMap((step) => stepFields(step))
        .find((field) => errors[field.fieldname])
      if (ordered) {
        setError(summarise(errors))
        return ordered.fieldname
      }
      setError(null)
      return null
    },
    [steps, summarise],
  )

  /** The class's own age rule, checked while the family is still filling in. */
  const eligibilityError = useMemo(
    () => ageEligibilityError(criteria, values.date_of_birth as string | undefined, contactPhone),
    [criteria, values.date_of_birth, contactPhone],
  )
  useEffect(() => {
    eligibilityRef.current = eligibilityError
  }, [eligibilityError])

  /** True when this step asks for the date of birth, i.e. owns the age rule. */
  const stepHasDob = useCallback(
    (index: number) =>
      stepFields(steps[index]).some((field) => field.fieldname === 'date_of_birth'),
    [steps],
  )

  const goNext = useCallback(() => {
    const firstBad = validate(stepIndex)
    if (firstBad) {
      focusField(firstBad)
      // The age window is the one refusal a family cannot fix by editing the
      // answer, so it is also stated as a dialog rather than only in red.
      if (firstBad === 'date_of_birth' && eligibilityError) {
        setError(eligibilityError)
        setEligibilityDialogOpen(true)
      }
      return
    }
    if (eligibilityError && stepHasDob(stepIndex)) {
      setError(eligibilityError)
      setEligibilityDialogOpen(true)
      return
    }
    setError(null)
    setStepIndex((current) => {
      const next = Math.min(current + 1, steps.length - 1)
      setMaxStepReached((furthest) => Math.max(furthest, next))
      return next
    })
  }, [validate, stepIndex, steps.length, eligibilityError, stepHasDob, focusField])

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

  /** Which step owns a field — where to send the family to fix it. */
  const stepOfField = useCallback(
    (fieldname: string): number =>
      steps.findIndex((step) => stepFields(step).some((f) => f.fieldname === fieldname)),
    [steps],
  )

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (submitting || !schema) return

      // Every step, not only the last one: a blank required field on step two is
      // still blank, and the server would refuse it with a message naming a
      // question that is no longer on screen. Take the family back to it instead.
      const firstBad = validate()
      if (firstBad) {
        if (firstBad === 'date_of_birth' && eligibilityError) {
          setError(eligibilityError)
          setEligibilityDialogOpen(true)
        }
        const owner = stepOfField(firstBad)
        if (owner >= 0 && owner !== stepIndex) {
          setStepIndex(owner)
          setMaxStepReached((furthest) => Math.max(furthest, owner))
          // The step has to render before its field can be scrolled to.
          window.setTimeout(() => focusField(firstBad), 0)
        } else {
          focusField(firstBad)
        }
        return
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
        // The backend answers in prose ("Aadhaar Number must be exactly 12
        // digits."). Where that names a field, show it at the field and go back
        // to the step holding it rather than leaving the message stranded on the
        // last screen.
        const culprit = fieldForServerMessage(result.error, Object.values(fieldIndex))
        if (culprit && isFieldVisible(culprit, values)) {
          setFieldErrors((current) => ({ ...current, [culprit.fieldname]: result.error }))
          const owner = stepOfField(culprit.fieldname)
          if (owner >= 0) {
            setStepIndex(owner)
            setMaxStepReached((furthest) => Math.max(furthest, owner))
            window.setTimeout(() => focusField(culprit.fieldname), 0)
          }
        }
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
      validate,
      stepOfField,
      stepIndex,
      focusField,
      eligibilityError,
      settings,
      termsAccepted,
      values,
      files,
      honeypot,
      fieldIndex,
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
    validateField,
    focusField,
    eligibilityError,
    eligibilityDialogOpen,
    dismissEligibilityDialog: () => setEligibilityDialogOpen(false),
    submit,
  }
}
