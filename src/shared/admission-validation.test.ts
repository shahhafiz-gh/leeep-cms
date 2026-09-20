import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import type { SchemaField, SchemaStep } from './admission-schema.ts'
import {
  collectErrors,
  fieldError,
  fieldForServerMessage,
  formatError,
  requiredError,
} from './admission-validation.ts'

/**
 * Tests for the public admission form's field checks.
 *
 * Worth testing where the rest of the form is not: every rule here mirrors one
 * the backend enforces, and the whole point of the mirror is that the family
 * never reaches the last step to be told. A rule that silently stops matching
 * its server counterpart looks fine on screen and fails on submit — which is
 * exactly the bug this file exists to prevent coming back.
 *
 * Run with:  node --experimental-strip-types --test src/shared/admission-validation.test.ts
 */

const field = (overrides: Partial<SchemaField> & { fieldname: string }): SchemaField => ({
  fieldtype: 'Data',
  label: overrides.fieldname,
  ...overrides,
})

const stepOf = (...fields: SchemaField[]): SchemaStep => ({
  label: 'Step',
  tab: '',
  sections: [{ label: '', fields }],
})

const file = (size = 1024) => new File([new Uint8Array(size)], 'doc.pdf', { type: 'application/pdf' })

// --- format rules, mirroring StudentApplicant.validate_* --------------------

test('an empty answer is never a format problem', () => {
  assert.equal(formatError(field({ fieldname: 'aadhaar_number' }), ''), '')
  assert.equal(formatError(field({ fieldname: 'aadhaar_number' }), undefined), '')
})

test('Aadhaar must be twelve digits, spacing and dashes ignored', () => {
  const aadhaar = field({ fieldname: 'aadhaar_number', label: 'Aadhaar Number' })
  assert.equal(formatError(aadhaar, '1234 5678 9012'), '')
  assert.equal(formatError(aadhaar, '1234-5678-9012'), '')
  assert.match(formatError(aadhaar, '12345'), /exactly 12 digits/)
  assert.match(formatError(aadhaar, '12345678901x'), /exactly 12 digits/)
})

test('PEN must be eleven digits', () => {
  const pen = field({ fieldname: 'pen_number', label: 'PEN Number' })
  assert.equal(formatError(pen, '12345678901'), '')
  assert.match(formatError(pen, '1234567890'), /exactly 11 digits/)
})

test('a phone number is ten digits, with or without a country prefix', () => {
  const phone = field({ fieldname: 'fathers_contact', label: "Father's Contact" })
  assert.equal(formatError(phone, '9876543210'), '')
  assert.equal(formatError(phone, '+91 98765 43210'), '')
  assert.equal(formatError(phone, '09876543210'), '')
  assert.match(formatError(phone, '12345'), /10-digit mobile number/)
  // Indian mobiles start 6-9; a landline is not one.
  assert.match(formatError(phone, '1234567890'), /10-digit mobile number/)
  // Any field the school typed as a Phone gets the same rule.
  assert.match(formatError(field({ fieldname: 'custom_helpline', fieldtype: 'Phone' }), '55'), /mobile/)
})

test('an email field is checked by name or by its Email option', () => {
  assert.equal(formatError(field({ fieldname: 'email_address' }), 'a@b.com'), '')
  assert.match(formatError(field({ fieldname: 'email_address' }), 'not-an-email'), /valid email/)
  const custom = field({ fieldname: 'custom_email', fieldtype: 'Data', options: 'Email' })
  assert.match(formatError(custom, 'nope'), /valid email/)
})

test('a date of birth cannot be in the future', () => {
  const dob = field({ fieldname: 'date_of_birth', fieldtype: 'Date', label: 'Date of Birth' })
  assert.equal(formatError(dob, '2015-06-01'), '')
  const nextYear = new Date()
  nextYear.setFullYear(nextYear.getFullYear() + 1)
  assert.match(formatError(dob, nextYear.toISOString().slice(0, 10)), /later than today/)
  assert.match(formatError(dob, 'gibberish'), /not a valid date/)
})

// --- required ---------------------------------------------------------------

test('a required field is answered by anything but blank', () => {
  const name = field({ fieldname: 'first_name', label: 'First Name', reqd: 1 })
  assert.match(requiredError(name, {}, {}), /is required/)
  assert.match(requiredError(name, { first_name: '   ' }, {}), /is required/)
  assert.equal(requiredError(name, { first_name: 'Aisha' }, {}), '')
})

test('an unticked required checkbox is an answer, not a blank', () => {
  const check = field({ fieldname: 'hostel', fieldtype: 'Check', reqd: 1 })
  assert.equal(requiredError(check, { hostel: 0 }, {}), '')
})

test('a required attachment is satisfied by the file held in state', () => {
  const attach = field({ fieldname: 'birth_certificate', fieldtype: 'Attach', label: 'Birth Certificate', reqd: 1 })
  assert.match(requiredError(attach, {}, {}), /Please attach Birth Certificate/)
  assert.equal(requiredError(attach, {}, { birth_certificate: file() }), '')
})

test('a required child table wants at least one row', () => {
  const table = field({ fieldname: 'siblings', fieldtype: 'Table', label: 'Siblings', reqd: 1 })
  assert.match(requiredError(table, { siblings: [] }, {}), /at least one Sibling/)
  assert.equal(requiredError(table, { siblings: [{ full_name: 'Zoya' }] }, {}), '')
})

test('a conditional requirement only applies when its condition holds', () => {
  const siblings = field({
    fieldname: 'siblings',
    fieldtype: 'Table',
    label: 'Siblings',
    mandatory_depends_on: 'any_sibling_already_studying_in_this_school',
  })
  assert.equal(requiredError(siblings, { siblings: [] }, {}), '')
  assert.match(
    requiredError(siblings, { any_sibling_already_studying_in_this_school: 1, siblings: [] }, {}),
    /at least one Sibling/,
  )
})

// --- the two together, over a step -----------------------------------------

test('a hidden question is never reported', () => {
  const hidden = field({
    fieldname: 'previous_school_name',
    label: 'Previous School',
    reqd: 1,
    depends_on: 'eval:doc.has_previous_school',
  })
  assert.equal(fieldError(hidden, { has_previous_school: 0 }, {}), '')
  assert.match(fieldError(hidden, { has_previous_school: 1 }, {}), /is required/)
})

test('the blank answer is reported before the format rule, not both', () => {
  const email = field({ fieldname: 'email_address', label: 'Email', reqd: 1 })
  assert.match(fieldError(email, {}, {}), /is required/)
  assert.match(fieldError(email, { email_address: 'nope' }, {}), /valid email/)
})

test('a step reports every bad answer at once, keyed by field', () => {
  const step = stepOf(
    field({ fieldname: 'first_name', label: 'First Name', reqd: 1 }),
    field({ fieldname: 'aadhaar_number', label: 'Aadhaar Number' }),
    field({ fieldname: 'middle_name', label: 'Middle Name' }),
  )
  const errors = collectErrors([step], { aadhaar_number: '99' }, {})
  assert.deepEqual(Object.keys(errors).sort(), ['aadhaar_number', 'first_name'])
})

// --- mapping a server refusal back to its field -----------------------------

test('a server message is matched to the longest field label it names', () => {
  const fields = [
    field({ fieldname: 'first_name', label: 'Name' }),
    field({ fieldname: 'fathers_name', label: "Father's Name" }),
  ]
  const match = fieldForServerMessage("Father's Name is required.", fields)
  assert.equal(match?.fieldname, 'fathers_name')
  assert.equal(fieldForServerMessage('Something else went wrong.', fields), null)
})
