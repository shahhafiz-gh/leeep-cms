/**
 * The schema-driven admission form — shared by every template.
 *
 * The field list is NOT written in this repo. It is derived from the school's
 * `Student Applicant` DocType and folded with its `Admission Form Profile`
 * (which fields to keep, hide, rename, prefill or make mandatory — optionally
 * per class) by `education/education/admission_form.py`, and fetched through the
 * renderer's own `/api/admissions/schema` route.
 *
 * That means: customise the DocType, and the question appears on the website
 * form AND on the school's in-app form, with no template change and no redeploy.
 *
 * Templates supply the LOOK (see `AdmissionFormFields`); this module supplies the
 * data, the grouping, the conditional-visibility rules and the submit pipeline.
 */

export const STRUCTURAL_TYPES = new Set(['Tab Break', 'Section Break', 'Column Break'])

/**
 * Hard per-file upload ceiling for the application form, in MB. Every upload box
 * is capped at this, so no visitor can push an enormous document at the backend.
 * Enforced in three places: the UploadBox on pick, the submit helper before the
 * POST, and — the one that actually protects the backend, since the first two
 * live in the browser — the `/api/admissions/*` proxy routes.
 */
export const MAX_UPLOAD_MB = 5
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024

/**
 * Ceiling for a whole submission (every document part plus the payload). A form
 * carries several base documents plus whatever Attach fields the school added,
 * so this is deliberately roomier than a single file — it exists to stop one
 * request from being unbounded, not to limit legitimate submissions.
 */
export const MAX_TOTAL_UPLOAD_BYTES = 25 * 1024 * 1024

export interface LinkOption {
  value: string
  label: string
  /** Extra scoping key, present on dependent links (see `depends_field`). */
  [key: string]: unknown
}

export interface SchemaField {
  fieldname: string
  fieldtype: string
  label: string
  options?: string
  reqd?: number
  read_only?: number
  hidden?: number
  default?: string
  description?: string
  depends_on?: string
  mandatory_depends_on?: string
  read_only_depends_on?: string
  collapsible?: number
  /** Resolved server-side: a guest cannot search link targets. */
  link_options?: LinkOption[]
  /** This field's choices are narrowed by another answer. */
  depends_field?: { parent_field: string; filter_key: string }
  child_fields?: SchemaField[]
  /** Pinned by the school: shown, pre-filled and not editable. */
  locked?: number
  /** Chosen up front (class / year) rather than answered in the form body. */
  is_scope?: number
  is_custom?: number
}

export interface AdmissionCriteria {
  program: string
  label: string
  student_admission: string
  academic_year: string
  min_age: number | null
  max_age: number | null
  age_as_on: string | null
  application_fee: number
  description: string
  admission_start_date: string | null
  admission_end_date: string | null
}

export interface AdmissionFormSettings {
  profile: string | null
  accepting_applications: boolean
  intro_message: string
  submit_button_label: string
  success_message: string
  require_terms_acceptance: boolean
  terms_and_conditions: string
}

export interface AdmissionSchema {
  doctype: string
  audience: string
  program: string | null
  academic_year: string | null
  fields: SchemaField[]
  criteria: AdmissionCriteria | null
  settings: AdmissionFormSettings
  currency: string
}

export interface AdmissionPrograms {
  programs: AdmissionCriteria[]
  academic_years: string[]
  currency: string
}

/** One open admission window, with the classes it is admitting into. */
export interface AdmissionWindow {
  name: string
  title: string
  academic_year: string
  admission_start_date: string | null
  admission_end_date: string | null
  age_as_on: string | null
  /** School-authored rich text from the Student Admission record. */
  introduction: string
  programs: AdmissionCriteria[]
}

export interface AdmissionOverview {
  /** False when the school is not admitting — the page says so and hides the form. */
  open: boolean
  currency: string
  admissions: AdmissionWindow[]
}

/** A child-table answer: one object of column values per row. */
export type ChildRows = Array<Record<string, string>>
export type FormValue = string | number | ChildRows
/** Values keyed by fieldname. Files live outside this (they are uncontrolled). */
export type FormValues = Record<string, FormValue>

export function isChildTable(field: SchemaField): boolean {
  return field.fieldtype === 'Table' || field.fieldtype === 'Table MultiSelect'
}

export function childRows(values: FormValues, fieldname: string): ChildRows {
  const value = values[fieldname]
  return Array.isArray(value) ? value : []
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

/**
 * Forward the page's own query string so the API route resolves the school the
 * same way the page did (`?school=` on dev, subdomain header on real hosts).
 */
function currentSearch(): string {
  return typeof window === 'undefined' ? '' : window.location.search
}

function withSchoolParams(extra: Record<string, string>): string {
  const params = new URLSearchParams(currentSearch())
  for (const [key, value] of Object.entries(extra)) {
    if (value) params.set(key, value)
    else params.delete(key)
  }
  return params.toString()
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    const json = (await res.json().catch(() => null)) as { ok?: boolean; data?: T } | null
    if (!res.ok || !json?.ok) return null
    return (json.data ?? null) as T | null
  } catch {
    return null
  }
}

/** Classes currently open for application, with their own criteria. */
export function fetchAdmissionPrograms(academicYear?: string, studentAdmission?: string) {
  return getJson<AdmissionPrograms>(
    `/api/admissions/schema?${withSchoolParams({
      programs: '1',
      academic_year: academicYear ?? '',
      student_admission: studentAdmission ?? '',
    })}`,
  )
}

// Several things on an admissions page ask the same question ("are we
// admitting?") — the details block and every "Start application" call to action.
// One in-flight request is shared between them for the life of the page.
const overviewCache = new Map<string, Promise<AdmissionOverview | null>>()

/**
 * Every open admission window with its class-wise criteria — what the public
 * admissions page shows BEFORE the family commits to filling anything in.
 */
export function fetchAdmissionOverview(academicYear?: string): Promise<AdmissionOverview | null> {
  const key = academicYear ?? ''
  const cached = overviewCache.get(key)
  if (cached) return cached

  const request = getJson<AdmissionOverview>(
    `/api/admissions/schema?${withSchoolParams({ overview: '1', academic_year: key })}`,
  ).then((result) => {
    // Don't cache a failure — a transient network blip would otherwise leave the
    // page insisting admissions are closed until a reload.
    if (result === null) overviewCache.delete(key)
    return result
  })
  overviewCache.set(key, request)
  return request
}

/** The field set for one class (or the generic set when no class is chosen). */
export function fetchAdmissionSchema(program?: string, academicYear?: string) {
  return getJson<AdmissionSchema>(
    `/api/admissions/schema?${withSchoolParams({
      program: program ?? '',
      academic_year: academicYear ?? '',
    })}`,
  )
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export interface SchemaSection {
  /** Section heading, or '' for an unnamed group. */
  label: string
  fields: SchemaField[]
}

export interface SchemaStep {
  /** Section heading — one wizard step per section the school configured. */
  label: string
  /**
   * The DocType tab this section lives under ('' for sections before the first
   * Tab Break). Carried so the stepper can group its steps under the tab the
   * school authored them in, instead of showing one long undifferentiated list.
   */
  tab: string
  sections: SchemaSection[]
}

/** One tab's worth of steps, for a stepper that mirrors the tab -> section tree. */
export interface SchemaStepGroup {
  /** Tab heading, or '' for the run of sections that precede the first tab. */
  tab: string
  /** Each step with its index into the flat `SchemaStep[]` the wizard walks. */
  steps: Array<{ step: SchemaStep; index: number }>
}

/**
 * Fold the flat step list back into its tab groups for the stepper.
 *
 * The wizard itself stays flat — one section per step, walked by a single index —
 * but the stepper shows the hierarchy the school actually authored: each tab, then
 * the sections under it. Consecutive steps sharing a `tab` form one group; the
 * step's index into the flat list is kept so a click can jump straight to it.
 */
export function groupStepsByTab(steps: SchemaStep[]): SchemaStepGroup[] {
  const groups: SchemaStepGroup[] = []
  steps.forEach((step, index) => {
    const last = groups[groups.length - 1]
    if (last && last.tab === step.tab) {
      last.steps.push({ step, index })
    } else {
      groups.push({ tab: step.tab, steps: [{ step, index }] })
    }
  })
  return groups
}

/**
 * One wizard step per SECTION of the flat field list.
 *
 * The section is the unit the school actually controls: its Application Form
 * screen groups every question under a section heading, and the profile's
 * per-field "Section Heading" moves a question between them. Tabs are a desk
 * authoring detail the school never sees, so stepping by tab lumped unrelated
 * sections — medical records, previous school — into one long page while the
 * headings the school wrote did nothing.
 *
 * A section that the school hid entirely takes its heading with it, because a
 * step with no visible fields is never emitted. An unlabelled section falls back
 * to its tab's heading so the opening group still has a name.
 *
 * Fields flagged `is_scope` (the class and its academic year) are dropped: the
 * form's class picker already sets them, and it only offers classes that are
 * genuinely open — which a raw Link control listing every Program would not.
 */
export function groupSchemaFields(fields: SchemaField[]): SchemaStep[] {
  const steps: SchemaStep[] = []
  let tabLabel = ''
  let sectionLabel = ''
  let current: SchemaField[] = []

  // The step carries the heading; its single section is left unnamed so the
  // same words are not printed twice, once as the step and once above the grid.
  // `tab` records which Tab Break the section sat under, so the stepper can
  // regroup the flat steps into the hierarchy the school authored.
  const flush = () => {
    if (current.length) {
      steps.push({
        label: sectionLabel || tabLabel,
        tab: tabLabel,
        sections: [{ label: '', fields: current }],
      })
    }
    current = []
  }

  for (const field of fields) {
    if (field.fieldtype === 'Tab Break') {
      flush()
      tabLabel = field.label || ''
      sectionLabel = ''
      continue
    }
    if (field.fieldtype === 'Section Break') {
      flush()
      sectionLabel = field.label || ''
      continue
    }
    // Column breaks are a desk-layout concern; the public form flows in one
    // responsive grid, so they carry no meaning here.
    if (field.fieldtype === 'Column Break') continue
    if (field.is_scope) continue
    current.push(field)
  }
  flush()

  if (!steps.length) return [{ label: 'Application', tab: '', sections: [] }]
  return steps
}

// ---------------------------------------------------------------------------
// Conditional visibility
// ---------------------------------------------------------------------------

/**
 * Evaluate a Frappe `depends_on` expression, which is either `eval:<js>` with
 * `doc` in scope or a bare fieldname (truthy check).
 *
 * The expression comes from the school's own DocType definition — the same
 * trusted source the desk evaluates client-side — and it is sandboxed to a
 * single `doc` argument. It fails OPEN (field stays visible), so a broken
 * expression can never silently drop a question from the form.
 */
export function dependsOnSatisfied(expr: string | undefined, doc: FormValues): boolean {
  if (!expr) return true
  const raw = String(expr).trim()
  if (!raw) return true
  if (raw.startsWith('eval:')) {
    try {
      const fn = new Function('doc', `try { return !!(${raw.slice(5)}); } catch (e) { return true; }`)
      return !!fn(doc)
    } catch {
      return true
    }
  }
  const value = doc[raw]
  return !(value === undefined || value === null || value === '' || value === 0 || value === '0')
}

export function isFieldVisible(field: SchemaField, values: FormValues): boolean {
  return dependsOnSatisfied(field.depends_on, values)
}

export function isFieldRequired(field: SchemaField, values: FormValues): boolean {
  if (field.reqd) return true
  return !!field.mandatory_depends_on && dependsOnSatisfied(field.mandatory_depends_on, values)
}

export function isFileField(field: SchemaField): boolean {
  return field.fieldtype === 'Attach' || field.fieldtype === 'Attach Image'
}

/** The multipart part name carrying this Attach field's file. */
export function filePartName(fieldname: string): string {
  return `file_${fieldname}`
}

/** Split a Select field's newline-separated options into usable choices. */
export function selectChoices(field: SchemaField): string[] {
  return String(field.options ?? '')
    .split(/\r?\n/)
    .map((option) => option.trim())
    .filter(Boolean)
}

/**
 * Narrow a dependent link's choices to the answer it hangs off — an Academic
 * Term to its year, a Route Stop to its route. Falls back to every option while
 * the parent question is unanswered, so the control is never mysteriously empty.
 */
export function linkChoices(field: SchemaField, values: FormValues): LinkOption[] {
  const all = field.link_options ?? []
  const rule = field.depends_field
  if (!rule) return all
  const parentValue = values[rule.parent_field]
  if (!parentValue) return all
  const filtered = all.filter((option) => {
    // The key holds either the single owner or, where one option can belong to
    // several (a stop served by more than one route), the list of them.
    const scope = option[rule.filter_key]
    return Array.isArray(scope) ? scope.includes(parentValue as string) : scope === parentValue
  })
  return filtered.length ? filtered : all
}

/** Starting values: the schema's defaults, with the school's prefills applied. */
export function initialValues(fields: SchemaField[]): FormValues {
  const values: FormValues = {}
  for (const field of fields) {
    if (STRUCTURAL_TYPES.has(field.fieldtype)) continue
    if (field.default === undefined || field.default === '') continue
    // A Check's default arrives as the STRING "0", and `eval:doc.has_previous_school`
    // would read that as truthy — revealing every field that hangs off an
    // unticked box. Checks are numbers here, as they are in the database.
    values[field.fieldname] =
      field.fieldtype === 'Check' ? Number(field.default) || 0 : field.default
  }
  return values
}

// ---------------------------------------------------------------------------
// Eligibility (mirrors the class criteria the backend enforces)
// ---------------------------------------------------------------------------

/**
 * The same age check `Student Applicant` runs on save, applied while the family
 * is still filling the form — so an ineligible date of birth is caught at the
 * question, not after twenty more of them.
 *
 * Returns null when eligible (or when the class sets no age window).
 */
export function ageEligibilityError(
  criteria: AdmissionCriteria | null,
  dateOfBirth: string | undefined,
  contactPhone?: string,
): string | null {
  if (!criteria || !dateOfBirth) return null
  const asLocalDate = (value: string) => {
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    return iso
      ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
      : new Date(value)
  }
  const dob = asLocalDate(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return null

  const asOn = criteria.age_as_on ? asLocalDate(criteria.age_as_on) : new Date()
  if (Number.isNaN(asOn.getTime())) return null

  const onBirthday = (years: number) => {
    const date = new Date(dob)
    date.setFullYear(date.getFullYear() + years)
    return date
  }
  const dobLabel = [dob.getDate(), dob.getMonth() + 1, dob.getFullYear()]
    .map((part, index) => index < 2 ? String(part).padStart(2, '0') : String(part))
    .join('/')
  const day = asOn.getDate()
  const suffix = day % 100 >= 11 && day % 100 <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[day % 10] ?? 'th'
  const asOnLabel = `${day}${suffix} ${asOn.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  })}`
  const contact = contactPhone ? `at ${contactPhone}` : 'through the school office'
  const message = (ageRule: string) =>
    `Not eligible for ${criteria.label}.\n\n` +
    `The Date of Birth entered by you is ${dobLabel}. The applicant must be ${ageRule} as on ${asOnLabel}.\n\n` +
    `Please contact the Admission In-charge ${contact} to complete the offline registration of your ward`

  if (criteria.min_age && asOn < onBirthday(criteria.min_age)) {
    return message(`at least ${criteria.min_age} years old`)
  }
  if (criteria.max_age && asOn >= onBirthday(criteria.max_age)) {
    return message(`under ${criteria.max_age} years old`)
  }
  return null
}

// ---------------------------------------------------------------------------
// Submit
// ---------------------------------------------------------------------------

export type SubmitResult =
  | { ok: true; applicant: string | null; message: string | null }
  | { ok: false; error: string }

export interface SubmitArgs {
  schema: AdmissionSchema
  values: FormValues
  /** The <form> element, read for its uncontrolled file inputs. */
  form: HTMLFormElement
  termsAccepted: boolean
  /** Honeypot input's value — non-empty means a bot filled a hidden field. */
  honeypot?: string
}

/**
 * POST the application. Only fields that are currently VISIBLE are sent: a
 * question hidden by a `depends_on` (previous-school details for a child with no
 * previous school) should not carry a stale answer into the record.
 *
 * The server re-derives the whole schema and ignores anything it did not ask
 * for, so this is a UX concern rather than the security boundary.
 */
export async function submitAdmissionApplication({
  schema,
  values,
  form,
  termsAccepted,
  honeypot,
}: SubmitArgs): Promise<SubmitResult> {
  // Inside the builder's editor preview the canvas shows DEMO content — a
  // submit from there would file a junk application against the real school.
  const search = currentSearch()
  if (new URLSearchParams(search).get('preview') === '1') {
    return { ok: false, error: 'Submissions are disabled inside the editor preview.' }
  }

  const payload: Record<string, unknown> = { terms_accepted: termsAccepted ? 1 : 0 }
  if (honeypot) payload._hp = honeypot

  for (const field of schema.fields) {
    if (STRUCTURAL_TYPES.has(field.fieldtype) || isFileField(field)) continue
    if (!isFieldVisible(field, values)) continue
    const value = values[field.fieldname]
    if (value === undefined || value === '') continue
    if (Array.isArray(value) && !value.length) continue
    payload[field.fieldname] = value
  }

  const body = new FormData()
  body.set('data', JSON.stringify(payload))
  if (schema.program) body.set('program', schema.program)
  if (schema.academic_year) body.set('academic_year', schema.academic_year)

  const formData = new FormData(form)
  let totalBytes = body.get('data')?.toString().length ?? 0
  for (const field of schema.fields) {
    if (!isFileField(field) || !isFieldVisible(field, values)) continue
    const part = filePartName(field.fieldname)
    const file = formData.get(part)
    if (!(file instanceof File) || file.size === 0) continue
    // Caught on pick too, but re-checked here so a file that slipped past the
    // control never starts an upload the proxy will only reject.
    if (file.size > MAX_UPLOAD_BYTES) {
      return { ok: false, error: `${field.label || 'Document'}: file is larger than ${MAX_UPLOAD_MB}MB.` }
    }
    totalBytes += file.size
    if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
      return { ok: false, error: 'Your documents are too large in total. Please upload smaller files.' }
    }
    body.append(part, file, file.name)
  }

  try {
    const res = await fetch(`/api/admissions/submit${search}`, { method: 'POST', body })
    const json = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string; applicant?: string | null; message?: string | null }
      | null
    if (!res.ok || !json?.ok) {
      return { ok: false, error: json?.error ?? 'Something went wrong — please try again.' }
    }
    return { ok: true, applicant: json.applicant ?? null, message: json.message ?? null }
  } catch {
    return { ok: false, error: 'Could not reach the server — please check your connection and try again.' }
  }
}
