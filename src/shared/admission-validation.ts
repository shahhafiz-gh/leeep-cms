/**
 * Field-level validation for the public admission form.
 *
 * Every rule here MIRRORS one the backend already enforces — the required flags
 * the schema ships, `StudentApplicant.validate_*` (Aadhaar, PEN, phone, email,
 * date of birth) and the class's age window. The server still has the final say;
 * the point of the mirror is that a family sees the problem BESIDE the question
 * while they are still on it, instead of as one line at the end of a seven-step
 * form that names a field they can no longer see.
 *
 * Keep in step with:
 *   education/education/doctype/student_applicant/student_applicant.py
 *   leeep/src/pages/PublicAdmission/fieldFormats.ts   (the in-app portal's copy)
 */

import {
  isChildTable,
  isFieldRequired,
  isFieldVisible,
  isFileField,
  type FormValues,
  type SchemaField,
  type SchemaStep,
} from './admission-schema.ts'

/** Files held in memory, keyed by fieldname, until they ride along on submit. */
export type FormFiles = Record<string, File | undefined>

/** Errors keyed by fieldname. A missing key means the field is fine. */
export type FieldErrors = Record<string, string>

// --- The named-field rules the Student Applicant controller applies ----------

const AADHAAR_FIELDS = new Set(['aadhaar_number', 'fathers_aadhaar', 'mothers_aadhaar'])
const PHONE_FIELDS = new Set([
  'student_mobile_number',
  'additional_contact_number',
  'fathers_contact',
  'mothers_contact',
  'fathers_whatsapp',
  'mothers_whatsapp',
])
const EMAIL_FIELDS = new Set(['email_address', 'student_email_id', 'fathers_email', 'mothers_email'])

/** A 10-digit Indian mobile, optionally written with +91 / 91 / 0 in front. */
const PHONE_NUMBER = /^(?:\+?91|0)?[6-9]\d{9}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const NUMERIC_TYPES = new Set(['Int', 'Float', 'Currency', 'Percent'])

/** Email fields are Data with `options: "Email"` in Frappe. */
export function isEmailField(field: SchemaField): boolean {
  return (
    EMAIL_FIELDS.has(field.fieldname) ||
    (field.fieldtype === 'Data' && String(field.options ?? '').trim() === 'Email')
  )
}

function isPhoneField(field: SchemaField): boolean {
  return PHONE_FIELDS.has(field.fieldname) || field.fieldtype === 'Phone'
}

function today(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function parseDate(value: string): Date | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  const date = iso ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])) : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * What is wrong with a value the family HAS entered, or '' when it is fine.
 *
 * An empty value is never a format problem — that is what the required check is
 * for, and reporting both at once would say the same thing twice.
 */
export function formatError(field: SchemaField, value: unknown): string {
  if (Array.isArray(value)) return ''
  const text = String(value ?? '').trim()
  if (!text) return ''
  const label = field.label || field.fieldname

  if (AADHAAR_FIELDS.has(field.fieldname)) {
    return /^\d{12}$/.test(text.replace(/[\s-]/g, '')) ? '' : `${label} must be exactly 12 digits.`
  }
  if (field.fieldname === 'pen_number') {
    return /^\d{11}$/.test(text.replace(/\s/g, '')) ? '' : `${label} must be exactly 11 digits.`
  }
  if (isPhoneField(field)) {
    return PHONE_NUMBER.test(text.replace(/[\s\-()]/g, ''))
      ? ''
      : `${label} must be a valid 10-digit mobile number.`
  }
  if (isEmailField(field)) {
    return EMAIL.test(text) ? '' : `${label} must be a valid email address.`
  }
  if (field.fieldtype === 'Date') {
    const date = parseDate(text)
    if (!date) return `${label} is not a valid date.`
    // Mirrors StudentApplicant.validate_dates.
    if (field.fieldname === 'date_of_birth' && date > today()) {
      return 'Date of Birth cannot be later than today.'
    }
    return ''
  }
  if (NUMERIC_TYPES.has(field.fieldtype) && Number.isNaN(Number(text))) {
    return `${label} must be a number.`
  }
  return ''
}

/** The "you have not answered this" message, or '' when the field is answered. */
export function requiredError(
  field: SchemaField,
  values: FormValues,
  files: FormFiles,
): string {
  if (!isFieldRequired(field, values)) return ''
  const label = field.label || field.fieldname

  if (isFileField(field)) {
    const file = files[field.fieldname]
    return file && file.size > 0 ? '' : `Please attach ${label}.`
  }
  if (isChildTable(field)) {
    const rows = values[field.fieldname]
    return Array.isArray(rows) && rows.length ? '' : `Please add at least one ${label.replace(/s$/, '')}.`
  }
  const value = values[field.fieldname]
  if (value === undefined || value === null) return `${label} is required.`
  if (Array.isArray(value)) return value.length ? '' : `${label} is required.`
  // A Check answers "no" with 0, which is a real answer rather than a blank.
  if (field.fieldtype === 'Check') return ''
  return String(value).trim() === '' ? `${label} is required.` : ''
}

/** Everything wrong with ONE field right now, required first. */
export function fieldError(field: SchemaField, values: FormValues, files: FormFiles): string {
  if (!isFieldVisible(field, values)) return ''
  return requiredError(field, values, files) || formatError(field, values[field.fieldname])
}

/** Every field of the given steps, with its problem. */
export function collectErrors(
  steps: SchemaStep[],
  values: FormValues,
  files: FormFiles,
): FieldErrors {
  const errors: FieldErrors = {}
  for (const step of steps) {
    for (const section of step.sections) {
      for (const field of section.fields) {
        const message = fieldError(field, values, files)
        if (message) errors[field.fieldname] = message
      }
    }
  }
  return errors
}

/** The fields of one step, in the order they are rendered. */
export function stepFields(step: SchemaStep | undefined): SchemaField[] {
  if (!step) return []
  return step.sections.flatMap((section) => section.fields)
}

/**
 * The field a server-side rejection is about, so the message can be shown at
 * the question rather than only at the foot of the form.
 *
 * Frappe throws prose ("Father's Name is required.", "Aadhaar Number must be
 * exactly 12 digits."), so the label it names is the only handle available. The
 * longest matching label wins, because "Name" is a substring of half of them.
 */
export function fieldForServerMessage(
  message: string,
  fields: SchemaField[],
): SchemaField | null {
  const text = message.toLowerCase()
  let best: SchemaField | null = null
  for (const field of fields) {
    const label = (field.label || '').trim().toLowerCase()
    if (label.length < 3 || !text.includes(label)) continue
    if (!best || label.length > (best.label || '').trim().length) best = field
  }
  return best
}
