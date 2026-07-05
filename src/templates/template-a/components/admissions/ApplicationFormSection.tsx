'use client'

import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import {
  DOCUMENT_SLOTS,
  customFieldName,
  customFileSlot,
  isFileField,
  submitAdmissionApplication,
  type CustomFormField,
  type DocumentSlot,
} from '@/shared/admission-form'
import { useLiveList } from '@/shared/hooks/useLiveList'

// The `[.show-errors_&]` variant turns empty required fields red — but ONLY
// after a submit attempt (the form gains .show-errors), never while the
// applicant is still filling the form in.
const invalidClass =
  ' [.show-errors_&]:invalid:border-red-500 [.show-errors_&]:invalid:ring-1 [.show-errors_&]:invalid:ring-red-400'
const invalidTickClass = ' [.show-errors_&]:invalid:ring-2 [.show-errors_&]:invalid:ring-red-400'
const inputClass =
  'border border-ta-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-ta-primary focus:border-ta-primary bg-ta-surface-container-lowest text-ta-on-surface font-(family-name:--font-ta-body-md) text-ta-body-md transition-colors' +
  invalidClass
const labelClass = 'font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface font-bold'
const stepTitleClass =
  'font-(family-name:--font-ta-h3) text-2xl text-ta-on-surface mb-5 border-b border-ta-outline-variant pb-3'

/** Red asterisk marking a required field. */
function Req() {
  return <span className="text-red-500"> *</span>
}

function Field({ label, required, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}{required && <Req />}</label>
      <input className={inputClass} required={required} {...props} />
    </div>
  )
}

const GRADES = ['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']

const HEALTH_QUESTIONS = [
  { name: 'health_medical', question: 'Does the child have any pre-existing medical conditions?' },
  { name: 'health_allergies', question: 'Does the child have any allergies?' },
  { name: 'health_support', question: 'Does the child require any special educational support?' },
]

/**
 * One document-upload box. The whole card opens the file picker; the chosen
 * file stays in the (hidden) input so the form's FormData carries it on submit.
 */
function UploadBox({ slot, required = false }: { slot: DocumentSlot; required?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setFileName(null)
      return
    }
    if (file.size > slot.maxMB * 1024 * 1024) {
      event.target.value = ''
      setFileName(null)
      setError(`File is larger than ${slot.maxMB}MB`)
      return
    }
    setError(null)
    setFileName(file.name)
  }

  const clear = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (inputRef.current) inputRef.current.value = ''
    setFileName(null)
    setError(null)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
        fileName
          ? 'border-ta-primary bg-ta-surface-container-low'
          : 'border-ta-outline-variant bg-ta-surface-container-low hover:bg-ta-surface-container'
      }`}
    >
      <input ref={inputRef} type="file" name={slot.name} accept={slot.accept} className="hidden" onChange={onChange} />
      <Icon icon={fileName ? 'lucide:check-circle-2' : slot.icon} className="text-ta-primary text-4xl mx-auto mb-2" />
      <p className="font-(family-name:--font-ta-label-md) text-ta-label-md font-bold mb-1">{slot.title}{required && <Req />}</p>
      {fileName ? (
        <div className="flex items-center justify-center gap-2">
          <p className="font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant truncate max-w-[220px]">{fileName}</p>
          <button
            type="button"
            onClick={clear}
            aria-label={`Remove ${slot.title}`}
            className="text-ta-on-surface-variant hover:text-ta-on-surface"
          >
            <Icon icon="lucide:x" className="text-sm" />
          </button>
        </div>
      ) : (
        <p className="font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant">{slot.desc}</p>
      )}
      {error && <p className="font-(family-name:--font-ta-caption) text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

/** One school-defined extra question, rendered by its configured answer type. */
function CustomField({ field, index }: { field: CustomFormField; index: number }) {
  const name = customFieldName(index)
  const required = field.required === 'Required'
  const type = field.type || 'Text'

  if (isFileField(field)) {
    return <UploadBox slot={customFileSlot(field, index)} required={required} />
  }
  if (type === 'Long text') {
    return (
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>{field.label}{required && <Req />}</label>
        <textarea className={inputClass} name={name} rows={3} required={required} />
      </div>
    )
  }
  if (type === 'Yes / No') {
    return (
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>{field.label}{required && <Req />}</label>
        <div className="flex items-center gap-4">
          {(['yes', 'no'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer">
              <input className={'accent-ta-primary rounded-full' + invalidTickClass} name={name} type="radio" value={v} required={required} />
              <span className="font-(family-name:--font-ta-body-md) text-ta-body-md">{v === 'yes' ? 'Yes' : 'No'}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }
  if (type === 'Dropdown') {
    return (
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>{field.label}{required && <Req />}</label>
        <select className={inputClass} name={name} required={required} defaultValue="">
          <option value="">Select option</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )
  }
  return <Field label={field.label} name={name} type={type === 'Date' ? 'date' : 'text'} required={required} />
}

function ParentCard({ title, prefix }: { title: string; prefix: string }) {
  return (
    <div className="border border-ta-outline-variant p-4 rounded-lg bg-ta-surface-container-low">
      <h4 className="font-(family-name:--font-ta-h3) text-xl text-ta-on-surface mb-3">{title}</h4>
      <div className="space-y-3">
        <Field label="Name" name={`${prefix}_name`} type="text" placeholder="Full name" />
        <Field label="Qualification" name={`${prefix}_qualification`} type="text" placeholder="Highest qualification" />
        <Field label="Occupation" name={`${prefix}_occupation`} type="text" placeholder="Occupation" />
        <Field label="Annual Income" name={`${prefix}_annual_income`} type="text" placeholder="Annual income" />
        <Field label="Contact Number" name={`${prefix}_contact_number`} type="tel" placeholder="Phone number" />
        <Field label="Aadhar Number" name={`${prefix}_aadhar_number`} type="text" placeholder="Aadhar number" />
      </div>
    </div>
  )
}

export default function ApplicationFormSection({ data }: { data: SchoolData }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Set on the first failed submit attempt — gates the red required styling.
  const [showErrors, setShowErrors] = useState(false)

  // School-defined extra questions, appended per form part. Live list so a
  // field added in the builder appears in the preview form immediately.
  const customFields = useLiveList<CustomFormField>(
    'admissions.formFields',
    (data.admissions.formFields ?? []) as CustomFormField[],
  )
  // Custom fields for one part, keeping each field's ORIGINAL index — the
  // index is the form-input name, and the payload builder reads by index.
  const customFor = (part: string) =>
    customFields
      .map((field, index) => ({ field, index }))
      .filter(({ field }) => field.section === part && (field.label ?? '').trim())

  // Checks native `required` can't express: cross-field (at least ONE parent
  // contact) and required FILE fields (their inputs are hidden, and a hidden
  // required input makes the browser block submission with no visible message).
  const validate = (fd: FormData): string | null => {
    const father = String(fd.get('father_contact_number') ?? '').trim()
    const mother = String(fd.get('mother_contact_number') ?? '').trim()
    if (!father && !mother) return "Please provide at least one parent's contact number."
    for (let i = 0; i < customFields.length; i++) {
      const field = customFields[i]
      if (!isFileField(field) || field.required !== 'Required' || !(field.label ?? '').trim()) continue
      const file = fd.get(customFieldName(i))
      if (!(file instanceof File) || file.size === 0) return `${field.label} is required — please upload the file.`
    }
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    const form = event.currentTarget
    // The form is noValidate, so WE surface missing required fields: flag the
    // form (turns every empty required field red via CSS), show a red summary,
    // and bring the first missing field into view.
    if (!form.checkValidity()) {
      setShowErrors(true)
      setError('Please fill in all the required fields (marked *) — they are highlighted in red.')
      const firstInvalid = form.querySelector(':invalid') as HTMLElement | null
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      firstInvalid?.focus?.({ preventScroll: true })
      return
    }
    const fd = new FormData(form)
    const invalid = validate(fd)
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    setSubmitting(true)
    const result = await submitAdmissionApplication(fd, customFields)
    setSubmitting(false)
    if (result.ok) setSubmitted(true)
    else setError(result.error)
  }

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
          {submitted ? (
            <div className="text-center py-16">
              <Icon icon="lucide:check-circle-2" className="text-ta-primary text-6xl mx-auto mb-4" />
              <h3 className="font-(family-name:--font-ta-h3) text-2xl text-ta-on-surface mb-2">Application Submitted</h3>
              <p className="font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant max-w-xl mx-auto">
                Thank you for applying to {data.name}. Our admissions team will review your application and contact you shortly.
              </p>
            </div>
          ) : (
          <form className={`space-y-12 ${showErrors ? 'show-errors' : ''}`} noValidate onSubmit={handleSubmit}>
            {/* 1. Student Information */}
            <div>
              <h3 className={stepTitleClass}>1. Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="First Name" name="first_name" type="text" placeholder="Enter first name" required />
                <Field label="Last Name" name="last_name" type="text" placeholder="Enter last name" />
                <Field label="Date of Birth" name="date_of_birth" type="date" required />
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Grade Applying For<Req /></label>
                  <select className={inputClass} name="grade" required>
                    <option value="">Select Grade</option>
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                {customFor('Student Information').map(({ field, index }) => (
                  <CustomField key={index} field={field} index={index} />
                ))}
              </div>
            </div>

            {/* 2. Previous Academic Details */}
            <div>
              <h3 className={stepTitleClass}>2. Previous Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="Previous School Name" name="previous_school" type="text" placeholder="Enter school name" />
                <Field label="Board" name="board" type="text" placeholder="e.g., State Board, CBSE, ICSE" />
                <Field label="Grade Attended" name="grade_attended" type="text" placeholder="e.g., Grade 4" />
                <Field label="GPA/Percentage" name="gpa" type="text" placeholder="Enter GPA or %" />
                <Field label="Year of Passing" name="year_of_passing" type="text" placeholder="e.g., 2024" />
                <Field label="Reason for Leaving" name="reason_for_leaving" type="text" placeholder="Reason for leaving" />
                <div className="flex flex-col gap-1.5 lg:col-span-3">
                  <label className={labelClass}>Transfer Certificate (TC) Availability<Req /></label>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input className={'accent-ta-primary rounded-full' + invalidTickClass} name="tc_availability" type="radio" value="yes" required />
                      <span className="font-(family-name:--font-ta-body-md) text-ta-body-md">Yes, available</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input className={'accent-ta-primary rounded-full' + invalidTickClass} name="tc_availability" type="radio" value="no" required />
                      <span className="font-(family-name:--font-ta-body-md) text-ta-body-md">No, to be submitted later</span>
                    </label>
                  </div>
                </div>
                {customFor('Previous Academic Details').map(({ field, index }) => (
                  <CustomField key={index} field={field} index={index} />
                ))}
              </div>
            </div>

            {/* 3. Parent/Guardian Information */}
            <div>
              <h3 className={stepTitleClass}>3. Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ParentCard title="Father's Details" prefix="father" />
                <ParentCard title="Mother's Details" prefix="mother" />
              </div>
              <p className="mt-3 font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant">
                Please provide at least one parent&apos;s contact number.<Req />
              </p>
              <div className="mt-4">
                <label className="flex items-center gap-2 font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface font-bold cursor-pointer">
                  <input className="accent-ta-primary rounded" name="has_guardian" type="checkbox" />
                  <span>Provide Local Guardian Details (if applicable)</span>
                </label>
              </div>
              {customFor('Parent/Guardian Information').length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customFor('Parent/Guardian Information').map(({ field, index }) => (
                    <CustomField key={index} field={field} index={index} />
                  ))}
                </div>
              )}
            </div>

            {/* 4. Contact & Address Details */}
            <div>
              <h3 className={stepTitleClass}>4. Contact &amp; Address Details</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Current Address<Req /></label>
                  <textarea className={inputClass} name="current_address" placeholder="Enter full current address" rows={3} required />
                </div>
                <label className="flex items-center gap-2 font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface font-bold cursor-pointer">
                  <input defaultChecked className="accent-ta-primary rounded" name="permanent_same" type="checkbox" />
                  <span>Permanent address is same as current address</span>
                </label>
                {customFor('Contact & Address').map(({ field, index }) => (
                  <CustomField key={index} field={field} index={index} />
                ))}
              </div>
            </div>

            {/* 5. Health & Special Requirements */}
            <div>
              <h3 className={stepTitleClass}>5. Health &amp; Special Requirements</h3>
              <div className="grid grid-cols-1 gap-6">
                {HEALTH_QUESTIONS.map(({ name, question }) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <label className={labelClass}>{question}</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input className="accent-ta-primary" name={name} type="radio" value="yes" />
                        <span className="font-(family-name:--font-ta-body-md) text-ta-body-md">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input defaultChecked className="accent-ta-primary" name={name} type="radio" value="no" />
                        <span className="font-(family-name:--font-ta-body-md) text-ta-body-md">No</span>
                      </label>
                    </div>
                  </div>
                ))}
                {customFor('Health & Special Requirements').map(({ field, index }) => (
                  <CustomField key={index} field={field} index={index} />
                ))}
              </div>
            </div>

            {/* 6. Document Upload */}
            <div>
              <h3 className={stepTitleClass}>6. Document Upload</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DOCUMENT_SLOTS.map((slot) => (
                  <UploadBox key={slot.name} slot={slot} />
                ))}
                {customFor('Document Upload').map(({ field, index }) => (
                  <UploadBox key={index} slot={customFileSlot(field, index)} required={field.required === 'Required'} />
                ))}
              </div>
            </div>

            {/* 7. Additional Information */}
            <div>
              <h3 className={stepTitleClass}>7. Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>How did you hear about us?</label>
                  <select className={inputClass} name="how_heard">
                    <option value="">Select Option</option>
                    <option value="website">Website/Search Engine</option>
                    <option value="social">Social Media</option>
                    <option value="referral">Friend/Family Referral</option>
                    <option value="ad">Advertisement</option>
                    <option value="walk-in">Walk-in</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Field label="Sibling Information (if studying here)" name="sibling_info" type="text" placeholder="Name and Grade of sibling" />
                {customFor('Additional Information').map(({ field, index }) => (
                  <CustomField key={index} field={field} index={index} />
                ))}
              </div>
            </div>

            {/* 8. Declaration */}
            <div className="bg-ta-surface-container-low p-6 rounded-xl border border-ta-outline-variant">
              <h3 className="font-(family-name:--font-ta-h3) text-xl text-ta-on-surface mb-4">Declaration</h3>
              <p className="font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant mb-4">
                I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to the cancellation of admission.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                <label className="flex items-start gap-2 font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface cursor-pointer">
                  <input className={'accent-ta-primary rounded mt-1' + invalidTickClass} name="agree_rules" type="checkbox" required />
                  <span>I agree to abide by the rules and regulations of {data.name}.<Req /></span>
                </label>
                <label className="flex items-start gap-2 font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface cursor-pointer">
                  <input className="accent-ta-primary rounded mt-1" name="consent_media" type="checkbox" />
                  <span>I consent to the use of my child&apos;s photographs/videos for school promotional purposes.</span>
                </label>
              </div>
              <div className="flex flex-col items-end gap-3 pt-6 border-t border-ta-outline-variant">
                {error && (
                  <p className="font-(family-name:--font-ta-body-md) text-ta-body-md text-red-600 self-stretch text-right" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full px-8 py-4 hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:hover:scale-100"
                >
                  {submitting && <Icon icon="lucide:loader-2" className="animate-spin text-lg" />}
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </div>
          </form>
          )}
        </div>
      </div>
    </section>
  )
}
