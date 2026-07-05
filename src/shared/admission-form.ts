/**
 * Shared submit pipeline for the PUBLIC admission application form.
 *
 * The form itself is STATIC — its fields are fixed and not school-configurable
 * (only the surrounding page copy is editable in the builder). Both templates
 * render the same field set with the same `name` attributes, so one payload
 * builder serves both.
 *
 * The browser never talks to Frappe directly (same rule as content fetching in
 * `lib/cms.ts`): submissions go to the renderer's own `/api/admissions/apply`
 * route, which resolves the school and proxies server-side.
 */

function text(fd: FormData, key: string): string {
  const raw = fd.get(key)
  return typeof raw === 'string' ? raw.trim() : ''
}

function checked(fd: FormData, key: string): boolean {
  return fd.get(key) === 'on'
}

function parent(fd: FormData, prefix: string) {
  return {
    name: text(fd, `${prefix}_name`),
    qualification: text(fd, `${prefix}_qualification`),
    occupation: text(fd, `${prefix}_occupation`),
    annualIncome: text(fd, `${prefix}_annual_income`),
    contactNumber: text(fd, `${prefix}_contact_number`),
    aadharNumber: text(fd, `${prefix}_aadhar_number`),
  }
}

/**
 * A school-defined extra question on the application form. Defined in the
 * builder (Admissions → "Custom application form fields", stored at
 * `admissions.formFields` in the content blob) and appended to the fixed base
 * form. `section` must be one of FORM_PARTS.
 */
export interface CustomFormField {
  section: string
  label: string
  type?: string // 'Text' | 'Long text' | 'Yes / No' | 'Date' | 'Dropdown'
  options?: string[]
  required?: string // 'Optional' | 'Required'
}

/** Base-form parts a custom field can be appended to (builder options match). */
export const FORM_PARTS = [
  'Student Information',
  'Previous Academic Details',
  'Parent/Guardian Information',
  'Contact & Address',
  'Health & Special Requirements',
  'Document Upload',
  'Additional Information',
] as const

/** The form-input name for custom field #i (index into the formFields array). */
export function customFieldName(index: number) {
  return `custom_${index}`
}

/**
 * The multipart PART name for custom file field #i. Distinct `custom_file_`
 * prefix so the backend can safely accept school-defined document parts
 * (`^custom_file_\d+$`) alongside the fixed base slots.
 */
export function customFileName(index: number) {
  return `custom_file_${index}`
}

/**
 * A custom field collects a FILE when its answer type says so — or whenever it
 * is placed in the Document Upload part (whatever the type says: that part is
 * upload boxes, so we don't let a mis-picked type render a text input there).
 */
export function isFileField(field: CustomFormField): boolean {
  return field.type === 'File upload' || field.section === 'Document Upload'
}

/** Materialise a custom file field as an upload box (base-slot shape). */
export function customFileSlot(field: CustomFormField, index: number): DocumentSlot {
  return {
    name: customFieldName(index),
    icon: 'lucide:file-up',
    title: field.label,
    desc: 'PDF, JPG, PNG up to 5MB',
    accept: '.pdf,.jpg,.jpeg,.png',
    maxMB: 5,
  }
}

/** Build the application payload from the form's FormData. */
export function buildApplicationPayload(fd: FormData, customFields: CustomFormField[] = []) {
  const custom = customFields
    .map((field, index) => {
      // File answers travel as multipart parts; record the chosen file's NAME
      // here so the answer list still shows what was submitted.
      const raw = fd.get(customFieldName(index))
      const value = isFileField(field) ? (raw instanceof File && raw.size > 0 ? raw.name : '') : text(fd, customFieldName(index))
      return {
        // Original index — the backend uses it to pair `custom_file_<i>` parts
        // back to this answer's label.
        index,
        section: field.section ?? '',
        label: (field.label ?? '').trim(),
        value,
      }
    })
    .filter((entry) => entry.label)

  return {
    ...(custom.length ? { custom } : {}),
    student: {
      firstName: text(fd, 'first_name'),
      lastName: text(fd, 'last_name'),
      dateOfBirth: text(fd, 'date_of_birth'),
      grade: text(fd, 'grade'),
    },
    previousAcademics: {
      schoolName: text(fd, 'previous_school'),
      board: text(fd, 'board'),
      gradeAttended: text(fd, 'grade_attended'),
      gpa: text(fd, 'gpa'),
      yearOfPassing: text(fd, 'year_of_passing'),
      reasonForLeaving: text(fd, 'reason_for_leaving'),
      tcAvailable: text(fd, 'tc_availability'),
    },
    parents: {
      father: parent(fd, 'father'),
      mother: parent(fd, 'mother'),
      hasLocalGuardian: checked(fd, 'has_guardian'),
    },
    address: {
      current: text(fd, 'current_address'),
      permanentSameAsCurrent: checked(fd, 'permanent_same'),
    },
    health: {
      medicalConditions: text(fd, 'health_medical'),
      allergies: text(fd, 'health_allergies'),
      specialSupport: text(fd, 'health_support'),
    },
    additional: {
      howHeard: text(fd, 'how_heard'),
      siblingInfo: text(fd, 'sibling_info'),
    },
    declaration: {
      agreeRules: checked(fd, 'agree_rules'),
      consentMedia: checked(fd, 'consent_media'),
    },
  }
}

/** One upload box: the fixed base documents use these, and a school's custom
 * "File upload" fields are materialised into the same shape. */
export interface DocumentSlot {
  name: string
  icon: string
  title: string
  desc: string
  accept: string
  maxMB: number
}

/**
 * The BASE document-upload slots, shared by both templates so the file-part
 * names always match what the backend expects (`_DOCUMENT_SLOTS` in
 * website_builder.py). `accept`/`maxMB` are enforced client-side per slot;
 * the server re-validates (pdf/jpg/png, 5MB hard cap) regardless.
 */
export const DOCUMENT_SLOTS: DocumentSlot[] = [
  { name: 'file_birth_certificate', icon: 'lucide:file-up', title: 'Birth Certificate', desc: 'PDF, JPG, PNG up to 5MB', accept: '.pdf,.jpg,.jpeg,.png', maxMB: 5 },
  { name: 'file_photo', icon: 'lucide:camera', title: 'Passport Size Photo', desc: 'JPG, PNG up to 2MB', accept: '.jpg,.jpeg,.png', maxMB: 2 },
  { name: 'file_report_card', icon: 'lucide:file-text', title: 'Previous Year Report Card', desc: 'PDF up to 5MB', accept: '.pdf', maxMB: 5 },
  { name: 'file_aadhar', icon: 'lucide:id-card', title: 'Aadhar Card', desc: 'PDF up to 5MB', accept: '.pdf', maxMB: 5 },
]

export type SubmitResult = { ok: true } | { ok: false; error: string }

/**
 * Build the payload from the form and POST it (multipart: payload JSON +
 * any chosen document files) to the renderer's proxy route. Never throws.
 */
export async function submitAdmissionApplication(
  formData: FormData,
  customFields: CustomFormField[] = [],
): Promise<SubmitResult> {
  // Inside the builder's editor preview the canvas shows DEMO content — a
  // submit from there would file a junk application against the real school.
  const search = typeof window === 'undefined' ? '' : window.location.search
  if (new URLSearchParams(search).get('preview') === '1') {
    return { ok: false, error: 'Submissions are disabled inside the editor preview.' }
  }

  const body = new FormData()
  body.set('application', JSON.stringify(buildApplicationPayload(formData, customFields)))
  for (const slot of DOCUMENT_SLOTS) {
    const file = formData.get(slot.name)
    if (file instanceof File && file.size > 0) {
      if (file.size > slot.maxMB * 1024 * 1024) {
        return { ok: false, error: `${slot.title}: file is larger than ${slot.maxMB}MB.` }
      }
      body.append(slot.name, file, file.name)
    }
  }
  // School-defined file fields → `custom_file_<i>` parts.
  customFields.forEach((field, index) => {
    if (!isFileField(field)) return
    const file = formData.get(customFieldName(index))
    if (file instanceof File && file.size > 0) body.append(customFileName(index), file, file.name)
  })

  try {
    // Forward the current query string so the API route resolves the school the
    // same way this page did (?school= on dev; subdomain header on real hosts).
    // No Content-Type header: the browser sets the multipart boundary itself.
    const res = await fetch(`/api/admissions/apply${search}`, { method: 'POST', body })
    const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (!res.ok || !json?.ok) {
      return { ok: false, error: json?.error ?? 'Something went wrong — please try again.' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Could not reach the server — please check your connection and try again.' }
  }
}
