/**
 * Format rules for the `Student Applicant` fields that are plain Data fields in
 * the DocType.
 *
 * Mirrors `StudentApplicant.validate_*` on the server — and the dashboard's own
 * copy in `PublicAdmission/fieldFormats.ts` — so a family sees the problem
 * beside the field, on the step they are standing on, instead of as a rejected
 * submission at the end of a long form. The server still has the final say.
 */

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

// A 10-digit Indian mobile, optionally written with +91 / 91 / 0 in front.
const PHONE_NUMBER = /^(?:\+?91|0)?[6-9]\d{9}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The problem with `value` for this field, or '' when it is fine (or empty). */
export function fieldFormatError(fieldname: string, value: unknown, label: string): string {
  const text = String(value ?? '').trim()
  if (!text) return ''

  if (AADHAAR_FIELDS.has(fieldname)) {
    return /^\d{12}$/.test(text.replace(/[\s-]/g, '')) ? '' : `${label} must be exactly 12 digits.`
  }
  if (fieldname === 'pen_number') {
    return /^\d{11}$/.test(text.replace(/\s/g, '')) ? '' : `${label} must be exactly 11 digits.`
  }
  if (PHONE_FIELDS.has(fieldname)) {
    return PHONE_NUMBER.test(text.replace(/[\s\-()]/g, ''))
      ? ''
      : `${label} must be a valid 10-digit mobile number.`
  }
  if (EMAIL_FIELDS.has(fieldname)) {
    return EMAIL.test(text) ? '' : `${label} must be a valid email address.`
  }
  return ''
}
