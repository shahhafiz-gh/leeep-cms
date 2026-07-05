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
  'w-full border border-tb-border rounded-lg px-4 py-3 text-tb-heading placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-tb-primary-400 focus:border-tb-primary-400 transition-colors bg-white' +
  invalidClass
const labelClass = 'block text-sm font-semibold text-tb-heading mb-2'
const stepTitleClass = 'text-xl font-bold text-tb-heading mb-5 border-b border-tb-border pb-3'

/** Red asterisk marking a required field. */
function Req() {
  return <span className="text-red-500"> *</span>
}

function Field({ label, required, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
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
        fileName ? 'border-tb-primary-400 bg-tb-primary-50/60' : 'border-tb-border bg-tb-primary-50/30 hover:bg-tb-primary-50/60'
      }`}
    >
      <input ref={inputRef} type="file" name={slot.name} accept={slot.accept} className="hidden" onChange={onChange} />
      <Icon icon={fileName ? 'lucide:check-circle-2' : slot.icon} className="text-tb-primary-400 text-4xl mx-auto mb-2" />
      <p className="text-sm font-bold text-tb-heading mb-1">{slot.title}{required && <Req />}</p>
      {fileName ? (
        <div className="flex items-center justify-center gap-2">
          <p className="text-xs text-tb-body truncate max-w-[220px]">{fileName}</p>
          <button
            type="button"
            onClick={clear}
            aria-label={`Remove ${slot.title}`}
            className="text-slate-400 hover:text-tb-heading"
          >
            <Icon icon="lucide:x" className="text-sm" />
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400">{slot.desc}</p>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
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
      <div>
        <label className={labelClass}>{field.label}{required && <Req />}</label>
        <textarea className={inputClass} name={name} rows={3} required={required} />
      </div>
    )
  }
  if (type === 'Yes / No') {
    return (
      <div>
        <label className={labelClass}>{field.label}{required && <Req />}</label>
        <div className="flex items-center gap-4">
          {(['yes', 'no'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer text-tb-body text-sm">
              <input className={'accent-tb-primary-400 rounded-full' + invalidTickClass} name={name} type="radio" value={v} required={required} />
              {v === 'yes' ? 'Yes' : 'No'}
            </label>
          ))}
        </div>
      </div>
    )
  }
  if (type === 'Dropdown') {
    return (
      <div>
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
    <div className="border border-tb-border p-5 rounded-xl bg-tb-primary-50/30">
      <h4 className="text-lg font-bold text-tb-heading mb-4">{title}</h4>
      <div className="space-y-4">
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

export default function ApplicationForm({ data }: { data: SchoolData }) {
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
    <section id="admission-application-form" className="py-16 md:py-24 bg-tb-primary-50/30">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">Apply Now</p>
          <h2 className="text-3xl md:text-4xl font-bold text-tb-heading mb-3">Start Your Application</h2>
          <p className="text-tb-body text-lg max-w-2xl mx-auto leading-relaxed">
            Please fill out the details below to begin the admission process.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-tb-border p-6 md:p-10 text-center py-16">
            <Icon icon="lucide:check-circle-2" className="text-tb-primary-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-tb-heading mb-2">Application Submitted</h3>
            <p className="text-tb-body max-w-xl mx-auto leading-relaxed">
              Thank you for applying to {data.name}. Our admissions team will review your application and contact you shortly.
            </p>
          </div>
        ) : (
        <form className={`bg-white rounded-2xl border border-tb-border p-6 md:p-10 space-y-12 ${showErrors ? 'show-errors' : ''}`} noValidate onSubmit={handleSubmit}>
          {/* 1. Student Information */}
          <div>
            <h3 className={stepTitleClass}>1. Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="First Name" name="first_name" type="text" placeholder="Enter first name" required />
              <Field label="Last Name" name="last_name" type="text" placeholder="Enter last name" />
              <Field label="Date of Birth" name="date_of_birth" type="date" required />
              <div>
                <label className={labelClass}>Grade Applying For<Req /></label>
                <select className={inputClass} name="grade" defaultValue="" required>
                  <option value="" disabled>Select Grade</option>
                  {GRADES.map((g) => <option key={g}>{g}</option>)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="Previous School Name" name="previous_school" type="text" placeholder="Enter school name" />
              <Field label="Board" name="board" type="text" placeholder="e.g., JKBOSE, CBSE" />
              <Field label="Grade Attended" name="grade_attended" type="text" placeholder="e.g., Grade 4" />
              <Field label="GPA/Percentage" name="gpa" type="text" placeholder="Enter GPA or %" />
              <Field label="Year of Passing" name="year_of_passing" type="text" placeholder="e.g., 2024" />
              <Field label="Reason for Leaving" name="reason_for_leaving" type="text" placeholder="Reason for leaving" />
              <div className="lg:col-span-3">
                <label className={labelClass}>Transfer Certificate (TC) Availability<Req /></label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-tb-body text-sm">
                    <input className={'accent-tb-primary-400 rounded-full' + invalidTickClass} name="tc_availability" type="radio" value="yes" required />
                    Yes, available
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-tb-body text-sm">
                    <input className={'accent-tb-primary-400 rounded-full' + invalidTickClass} name="tc_availability" type="radio" value="no" required />
                    No, to be submitted later
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ParentCard title="Father's Details" prefix="father" />
              <ParentCard title="Mother's Details" prefix="mother" />
            </div>
            <p className="mt-3 text-xs text-tb-body">
              Please provide at least one parent&apos;s contact number.<Req />
            </p>
            <label className="flex items-center gap-2 text-sm font-semibold text-tb-heading cursor-pointer mt-4">
              <input className="accent-tb-primary-400" name="has_guardian" type="checkbox" />
              Provide Local Guardian Details (if applicable)
            </label>
            {customFor('Parent/Guardian Information').length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                {customFor('Parent/Guardian Information').map(({ field, index }) => (
                  <CustomField key={index} field={field} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* 4. Contact & Address Details */}
          <div>
            <h3 className={stepTitleClass}>4. Contact &amp; Address Details</h3>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Current Address<Req /></label>
                <textarea className={inputClass} name="current_address" placeholder="Enter full current address" rows={3} required />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-tb-heading cursor-pointer">
                <input defaultChecked className="accent-tb-primary-400" name="permanent_same" type="checkbox" />
                Permanent address is same as current address
              </label>
              {customFor('Contact & Address').map(({ field, index }) => (
                <CustomField key={index} field={field} index={index} />
              ))}
            </div>
          </div>

          {/* 5. Health & Special Requirements */}
          <div>
            <h3 className={stepTitleClass}>5. Health &amp; Special Requirements</h3>
            <div className="space-y-5">
              {HEALTH_QUESTIONS.map(({ name, question }) => (
                <div key={name}>
                  <label className={labelClass}>{question}</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-tb-body text-sm">
                      <input className="accent-tb-primary-400" name={name} type="radio" value="yes" />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-tb-body text-sm">
                      <input defaultChecked className="accent-tb-primary-400" name={name} type="radio" value="no" />
                      No
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>How did you hear about us?</label>
                <select className={inputClass} name="how_heard" defaultValue="">
                  <option value="" disabled>Select Option</option>
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
          <div className="bg-tb-primary-50/40 p-6 rounded-xl border border-tb-border">
            <h3 className="text-xl font-bold text-tb-heading mb-4">Declaration</h3>
            <p className="text-tb-body text-sm mb-4 leading-relaxed">
              I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to the cancellation of admission.
            </p>
            <div className="flex flex-col gap-3 mb-6">
              <label className="flex items-start gap-2 text-sm text-tb-heading cursor-pointer">
                <input className={'accent-tb-primary-400 mt-1 rounded' + invalidTickClass} name="agree_rules" type="checkbox" required />
                <span>I agree to abide by the rules and regulations of {data.name}.<Req /></span>
              </label>
              <label className="flex items-start gap-2 text-sm text-tb-heading cursor-pointer">
                <input className="accent-tb-primary-400 mt-1" name="consent_media" type="checkbox" />
                <span>I consent to the use of my child&apos;s photographs/videos for school promotional purposes.</span>
              </label>
            </div>
            {error && (
              <p className="text-sm text-red-600 mb-4" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-tb-primary-400 text-white font-semibold rounded-full hover:bg-tb-primary-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit Application'}
              {!submitting && <span>→</span>}
            </button>
          </div>
        </form>
        )}
      </div>
    </section>
  )
}
