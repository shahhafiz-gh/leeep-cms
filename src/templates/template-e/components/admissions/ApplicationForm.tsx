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
import { Container } from '../common/Bits'

/**
 * Ledger's application form.
 *
 * Same contract as every other template's — the fixed base sections plus the
 * school's own extra questions, submitted through `submitAdmissionApplication`
 * — restyled as a paper form: square white fields, serif numbered rules, no
 * cards inside cards.
 */

// The `[.show-errors_&]` variant turns empty required fields red — but ONLY after
// a submit attempt, never while the applicant is still filling the form in.
const invalidClass =
  ' [.show-errors_&]:invalid:border-red-600 [.show-errors_&]:invalid:ring-1 [.show-errors_&]:invalid:ring-red-500'
const invalidTickClass = ' [.show-errors_&]:invalid:ring-2 [.show-errors_&]:invalid:ring-red-500'
const inputClass =
  'border border-te-rule-strong bg-te-white px-3 py-2.5 text-[14px] text-te-ink outline-none transition-colors focus:border-te-accent' +
  invalidClass
const labelClass = 'text-[13px] font-semibold tracking-[0.02em] text-te-ink'

function Req() {
  return <span className="text-te-accent"> *</span>
}

function Field({ label, required, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}{required && <Req />}</span>
      <input className={inputClass} required={required} {...props} />
    </label>
  )
}

function SectionRule({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-3 border-b border-te-rule pb-2.5">
      <span className="font-(family-name:--font-te-serif) text-[15px] font-semibold text-te-accent">
        {String(n).padStart(2, '0')}
      </span>
      <h3 className="m-0 text-[19px] text-te-ink sm:text-[21px]">{title}</h3>
    </div>
  )
}

/** One document-upload box. The whole box opens the picker; the chosen file
 *  stays in the hidden input so the form's FormData carries it on submit. */
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
      className={`cursor-pointer border p-5 text-center transition-colors ${
        fileName ? 'border-te-accent bg-te-panel' : 'border-dashed border-te-rule-strong bg-te-panel hover:border-te-accent'
      }`}
    >
      <input ref={inputRef} type="file" name={slot.name} accept={slot.accept} className="hidden" onChange={onChange} />
      <Icon icon={fileName ? 'lucide:check-circle-2' : slot.icon} className="mx-auto mb-2 h-6 w-6 text-te-accent" />
      <p className="m-0 mb-1 text-[14px] font-semibold text-te-ink">{slot.title}{required && <Req />}</p>
      {fileName ? (
        <div className="flex items-center justify-center gap-2">
          <p className="m-0 max-w-[200px] truncate text-[12px] text-te-muted">{fileName}</p>
          <button type="button" onClick={clear} aria-label={`Remove ${slot.title}`} className="text-te-muted hover:text-te-ink">
            <Icon icon="lucide:x" className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <p className="m-0 text-[12px] text-te-muted">{slot.desc}</p>
      )}
      {error && <p className="m-0 mt-1 text-[12px] text-red-700">{error}</p>}
    </div>
  )
}

/** One school-defined extra question, rendered by its configured answer type. */
function CustomField({ field, index }: { field: CustomFormField; index: number }) {
  const name = customFieldName(index)
  const required = field.required === 'Required'
  const type = field.type || 'Text'

  if (isFileField(field)) return <UploadBox slot={customFileSlot(field, index)} required={required} />
  if (type === 'Long text') {
    return (
      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>{field.label}{required && <Req />}</span>
        <textarea className={inputClass} name={name} rows={3} required={required} />
      </label>
    )
  }
  if (type === 'Yes / No') {
    return (
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>{field.label}{required && <Req />}</span>
        <div className="flex items-center gap-4">
          {(['yes', 'no'] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2">
              <input className={'accent-te-accent' + invalidTickClass} name={name} type="radio" value={v} required={required} />
              <span className="text-[14px] text-te-body">{v === 'yes' ? 'Yes' : 'No'}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }
  if (type === 'Dropdown') {
    return (
      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>{field.label}{required && <Req />}</span>
        <select className={inputClass} name={name} required={required} defaultValue="">
          <option value="">Select…</option>
          {(field.options ?? []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>
    )
  }
  return <Field label={field.label} name={name} type={type === 'Date' ? 'date' : 'text'} required={required} />
}

function ParentBlock({ title, prefix }: { title: string; prefix: string }) {
  return (
    <div className="border border-te-rule bg-te-white p-5">
      <h4 className="m-0 mb-3.5 text-[17px] text-te-ink">{title}</h4>
      <div className="flex flex-col gap-3">
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

const GRADES = ['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']

const HEALTH_QUESTIONS = [
  { name: 'health_medical', question: 'Does the child have any pre-existing medical conditions?' },
  { name: 'health_allergies', question: 'Does the child have any allergies?' },
  { name: 'health_support', question: 'Does the child require any special educational support?' },
]

export default function ApplicationForm({ data }: { data: SchoolData }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Set on the first failed submit attempt — gates the red required styling.
  const [showErrors, setShowErrors] = useState(false)

  // School-defined extra questions. Live list so a field added in the builder
  // appears in the preview form immediately.
  const customFields = useLiveList<CustomFormField>(
    'admissions.formFields',
    (data.admissions?.formFields ?? []) as CustomFormField[],
  )
  // Custom fields for one part, keeping each field's ORIGINAL index — the index
  // is the form-input name, and the payload builder reads by index.
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
    // The form is noValidate, so WE surface missing required fields.
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
    <div id="admission-application-form" className="mt-12 border-t border-te-rule bg-te-panel py-12 lg:mt-14 lg:py-14">
      <Container>
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Icon icon="lucide:check-circle-2" className="h-9 w-9 text-te-accent" />
            <h2 className="m-0 font-(family-name:--font-te-serif) text-[26px] text-te-accent">
              Thank you — we have your application.
            </h2>
            <p className="m-0 max-w-[52ch] text-[15px] leading-[1.65] text-te-body">
              A member of the admissions team at {data.name} will review it and reply shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-9 max-w-[720px]">
              <h2 className="m-0 mb-3 text-[26px] text-te-ink sm:text-[32px]">Application</h2>
              <p className="m-0 text-[16px] leading-[1.7] text-te-body">
                Every file is read by a committee, not a filter. Take your time; fields marked with an
                asterisk are required.
              </p>
            </div>

            <form className={`flex flex-col gap-10 ${showErrors ? 'show-errors' : ''}`} noValidate onSubmit={handleSubmit}>
              {/* 1. Student Information */}
              <div>
                <SectionRule n={1} title="Student information" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="First Name" name="first_name" type="text" placeholder="Enter first name" required />
                  <Field label="Last Name" name="last_name" type="text" placeholder="Enter last name" />
                  <Field label="Date of Birth" name="date_of_birth" type="date" required />
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>Grade Applying For<Req /></span>
                    <select className={inputClass} name="grade" required defaultValue="">
                      <option value="">Select…</option>
                      {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </label>
                  {customFor('Student Information').map(({ field, index }) => (
                    <CustomField key={index} field={field} index={index} />
                  ))}
                </div>
              </div>

              {/* 2. Previous Academic Details */}
              <div>
                <SectionRule n={2} title="Previous academic details" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Previous School Name" name="previous_school" type="text" placeholder="Enter school name" />
                  <Field label="Board" name="board" type="text" placeholder="e.g., State Board, CBSE, ICSE" />
                  <Field label="Grade Attended" name="grade_attended" type="text" placeholder="e.g., Grade 4" />
                  <Field label="GPA/Percentage" name="gpa" type="text" placeholder="Enter GPA or %" />
                  <Field label="Year of Passing" name="year_of_passing" type="text" placeholder="e.g., 2024" />
                  <Field label="Reason for Leaving" name="reason_for_leaving" type="text" placeholder="Reason for leaving" />
                  <div className="flex flex-col gap-1.5 lg:col-span-3">
                    <span className={labelClass}>Transfer Certificate (TC) availability<Req /></span>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input className={'accent-te-accent' + invalidTickClass} name="tc_availability" type="radio" value="yes" required />
                        <span className="text-[14px] text-te-body">Yes, available</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input className={'accent-te-accent' + invalidTickClass} name="tc_availability" type="radio" value="no" required />
                        <span className="text-[14px] text-te-body">No, to be submitted later</span>
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
                <SectionRule n={3} title="Parent / guardian information" />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <ParentBlock title="Father's details" prefix="father" />
                  <ParentBlock title="Mother's details" prefix="mother" />
                </div>
                <p className="m-0 mt-3 text-[12.5px] text-te-muted">
                  Please provide at least one parent&apos;s contact number.<Req />
                </p>
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-te-ink">
                  <input className="accent-te-accent" name="has_guardian" type="checkbox" />
                  <span>Provide local guardian details (if applicable)</span>
                </label>
                {customFor('Parent/Guardian Information').length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {customFor('Parent/Guardian Information').map(({ field, index }) => (
                      <CustomField key={index} field={field} index={index} />
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Contact & Address */}
              <div>
                <SectionRule n={4} title="Contact & address" />
                <div className="flex flex-col gap-5">
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>Current address<Req /></span>
                    <textarea className={inputClass} name="current_address" placeholder="Enter full current address" rows={3} required />
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-te-ink">
                    <input defaultChecked className="accent-te-accent" name="permanent_same" type="checkbox" />
                    <span>Permanent address is the same as the current address</span>
                  </label>
                  {customFor('Contact & Address').map(({ field, index }) => (
                    <CustomField key={index} field={field} index={index} />
                  ))}
                </div>
              </div>

              {/* 5. Health & Special Requirements */}
              <div>
                <SectionRule n={5} title="Health & special requirements" />
                <div className="flex flex-col gap-5">
                  {HEALTH_QUESTIONS.map(({ name, question }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <span className={labelClass}>{question}</span>
                      <div className="flex items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input className="accent-te-accent" name={name} type="radio" value="yes" />
                          <span className="text-[14px] text-te-body">Yes</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input defaultChecked className="accent-te-accent" name={name} type="radio" value="no" />
                          <span className="text-[14px] text-te-body">No</span>
                        </label>
                      </div>
                    </div>
                  ))}
                  {customFor('Health & Special Requirements').map(({ field, index }) => (
                    <CustomField key={index} field={field} index={index} />
                  ))}
                </div>
              </div>

              {/* 6. Documents */}
              <div>
                <SectionRule n={6} title="Documents" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {DOCUMENT_SLOTS.map((slot) => <UploadBox key={slot.name} slot={slot} />)}
                  {customFor('Document Upload').map(({ field, index }) => (
                    <UploadBox key={index} slot={customFileSlot(field, index)} required={field.required === 'Required'} />
                  ))}
                </div>
              </div>

              {/* 7. Additional Information */}
              <div>
                <SectionRule n={7} title="Anything else" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>How did you hear about us?</span>
                    <select className={inputClass} name="how_heard" defaultValue="">
                      <option value="">Select…</option>
                      <option value="website">Website/Search Engine</option>
                      <option value="social">Social Media</option>
                      <option value="referral">Friend/Family Referral</option>
                      <option value="ad">Advertisement</option>
                      <option value="walk-in">Walk-in</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <Field label="Sibling information (if studying here)" name="sibling_info" type="text" placeholder="Name and grade of sibling" />
                  {customFor('Additional Information').map(({ field, index }) => (
                    <CustomField key={index} field={field} index={index} />
                  ))}
                </div>
              </div>

              {/* 8. Declaration */}
              <div className="border border-te-rule bg-te-white p-6 lg:p-8">
                <h3 className="m-0 mb-3 text-[19px] text-te-ink">Declaration</h3>
                <p className="m-0 mb-4 text-[15px] leading-[1.65] text-te-body">
                  I declare that the information provided above is true and correct to the best of my
                  knowledge, and understand that false information may lead to the cancellation of
                  admission.
                </p>
                <div className="mb-6 flex flex-col gap-3">
                  <label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-te-body">
                    <input className={'mt-1 accent-te-accent' + invalidTickClass} name="agree_rules" type="checkbox" required />
                    <span>I agree to abide by the rules and regulations of {data.name}.<Req /></span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-te-body">
                    <input className="mt-1 accent-te-accent" name="consent_media" type="checkbox" />
                    <span>I consent to the use of my child&apos;s photographs for school purposes.</span>
                  </label>
                </div>
                <div className="flex flex-col gap-3 border-t border-te-rule pt-5 sm:flex-row sm:items-center sm:justify-end">
                  {error && (
                    <p className="m-0 text-[14px] text-red-700 sm:mr-auto" role="alert">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 bg-te-accent px-7 py-3 text-[14px] font-semibold tracking-[0.04em] text-te-paper transition-colors hover:bg-te-accent-ink disabled:opacity-60"
                  >
                    {submitting && <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin" />}
                    {submitting ? 'Submitting…' : 'Submit application'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </Container>
    </div>
  )
}
