'use client'

import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from './utils/cn'
import {
  childRows,
  filePartName,
  isChildTable,
  isFieldRequired,
  isFieldVisible,
  isFileField,
  linkChoices,
  MAX_UPLOAD_MB,
  selectChoices,
  type ChildRows,
  type FormValue,
  type FormValues,
  type SchemaField,
  type SchemaStep,
} from './admission-schema'

/**
 * Renders the school's derived admission fields — shared by every template.
 *
 * The templates own the LOOK and pass it in as `styles`; this component owns the
 * behaviour, so a fieldtype only has to be handled once and every template picks
 * it up. Nothing here knows what "Aadhaar Number" or "Father's Name" is: it just
 * renders whatever `Student Applicant` currently defines (see
 * `admission-schema.ts`).
 *
 * A field named in `errors` is drawn red and carries its own message, so the
 * family fixes the answer where they gave it rather than hunting for it from a
 * list at the bottom of the form.
 */

export interface AdmissionFormStyles {
  /** Text/select/textarea control. */
  input: string
  /** Field label. */
  label: string
  /** Section heading inside a step. */
  sectionTitle: string
  /** Help text under a control. */
  help: string
  /** Wrapper around one field (label + control). */
  field?: string
  /** The responsive grid a section's fields flow in. */
  grid?: string
  /** Upload drop card, and its state when a file is chosen. */
  uploadCard: string
  uploadCardFilled: string
  /** Radio / checkbox accent classes. */
  tick?: string
  /** Secondary button (add/remove a child-table row). */
  subtleButton?: string
  /**
   * A control holding an answer the form cannot accept. Optional: the default
   * below is red in every template's palette, and `cn` drops whatever border
   * the template's own `input` had.
   */
  inputInvalid?: string
  /** The message printed under such a control. */
  fieldError?: string
}

export interface AdmissionFieldsProps {
  step: SchemaStep
  values: FormValues
  onChange: (fieldname: string, value: FormValue) => void
  styles: AdmissionFormStyles
  /** What is wrong with each answer, by fieldname — these controls turn red. */
  errors?: Record<string, string>
  /** Attachments already picked, by fieldname (held by the form, not the input). */
  files?: Record<string, File>
  onFileChange?: (fieldname: string, file: File | null) => void
}

/** Red asterisk marking a required field. */
function Req() {
  return <span className="text-red-500"> *</span>
}

const INVALID_CONTROL =
  'border-red-500 ring-1 ring-red-500/30 focus:border-red-500 focus:ring-red-500'
const FIELD_ERROR_TEXT = 'text-xs font-medium text-red-600'

/** The DOM id its control points at with `aria-describedby`. */
function errorId(fieldname: string) {
  return `admission-error-${fieldname}`
}

/** Fieldtypes that want the full row rather than one grid cell. */
const WIDE_TYPES = new Set([
  'Small Text',
  'Text',
  'Long Text',
  'Text Editor',
  'Markdown Editor',
  'Table',
  'Table MultiSelect',
])

/** Which HTML input type a scalar fieldtype maps to. */
function inputType(fieldtype: string): string {
  switch (fieldtype) {
    case 'Date':
      return 'date'
    case 'Datetime':
      return 'datetime-local'
    case 'Time':
      return 'time'
    case 'Int':
    case 'Float':
    case 'Currency':
    case 'Percent':
      return 'number'
    case 'Phone':
      return 'tel'
    default:
      return 'text'
  }
}

/** Email fields are Data with `options: "Email"` in Frappe. */
function isEmailField(field: SchemaField): boolean {
  return field.fieldtype === 'Data' && String(field.options ?? '').trim() === 'Email'
}

/**
 * One upload card. The whole card opens the picker; the chosen file is handed
 * to the form, which keeps it in state — this step is unmounted the moment the
 * family presses Continue, and an uncontrolled input would take the file with
 * it.
 */
function UploadBox({
  field,
  required,
  invalid,
  file,
  onFile,
  styles,
}: {
  field: SchemaField
  required: boolean
  invalid: boolean
  file: File | null
  onFile: (file: File | null) => void
  styles: AdmissionFormStyles
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const maxMB = MAX_UPLOAD_MB
  const accept = field.fieldtype === 'Attach Image' ? '.jpg,.jpeg,.png' : '.pdf,.jpg,.jpeg,.png'

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0]
    if (!picked) {
      onFile(null)
      return
    }
    if (picked.size > maxMB * 1024 * 1024) {
      event.target.value = ''
      onFile(null)
      setSizeError(`File is larger than ${maxMB}MB`)
      return
    }
    setSizeError(null)
    onFile(picked)
  }

  const clear = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (inputRef.current) inputRef.current.value = ''
    setSizeError(null)
    onFile(null)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={cn(
        file ? styles.uploadCardFilled : styles.uploadCard,
        invalid && (styles.inputInvalid ?? INVALID_CONTROL),
      )}
    >
      <input
        ref={inputRef}
        type="file"
        name={filePartName(field.fieldname)}
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
      <Icon
        icon={file ? 'lucide:check-circle-2' : field.fieldtype === 'Attach Image' ? 'lucide:camera' : 'lucide:file-up'}
        className="text-4xl mx-auto mb-2"
      />
      <p className={styles.label}>
        {field.label}
        {required && <Req />}
      </p>
      {file ? (
        <div className="flex items-center justify-center gap-2">
          <p className={`${styles.help} truncate max-w-[220px]`}>{file.name}</p>
          <button type="button" onClick={clear} aria-label={`Remove ${field.label}`} className="opacity-70 hover:opacity-100">
            <Icon icon="lucide:x" className="text-sm" />
          </button>
        </div>
      ) : (
        <p className={styles.help}>{field.description || `PDF, JPG, PNG up to ${maxMB}MB`}</p>
      )}
      {sizeError && <p className="text-xs text-red-600 mt-1">{sizeError}</p>}
    </div>
  )
}

/** A repeatable set of rows for a child table (siblings, and any the school adds). */
function ChildTable({
  field,
  rows,
  required,
  onChange,
  styles,
}: {
  field: SchemaField
  rows: ChildRows
  required: boolean
  onChange: (rows: ChildRows) => void
  styles: AdmissionFormStyles
}) {
  const isSiblingTable = field.fieldname === 'siblings'
  // The enclosing Student Applicant field already establishes that every row
  // represents a sibling studying at this school. Keep the backend field in the
  // payload, but do not make parents answer the same question a second time.
  const columns = (field.child_fields ?? []).filter(
    (column) => !isSiblingTable || column.fieldname !== 'studies_here',
  )
  if (!columns.length) return null

  const update = (index: number, column: string, value: string) => {
    const next = rows.map((row, i) => (i === index ? { ...row, [column]: value } : row))
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <p className={styles.label}>
        {field.label}
        {required && <Req />}
      </p>
      {rows.map((row, index) => (
        <div key={index} className="flex flex-wrap items-end gap-3">
          {columns.map((column) => (
            <div key={column.fieldname} className="flex flex-col gap-1.5 min-w-[160px] flex-1">
              <label className={styles.label}>{column.label}</label>
              {column.fieldtype === 'Select' ? (
                <select
                  className={styles.input}
                  value={row[column.fieldname] ?? ''}
                  onChange={(event) => update(index, column.fieldname, event.target.value)}
                >
                  <option value="">Select</option>
                  {selectChoices(column)
                    .filter(
                      (choice) =>
                        !isSiblingTable ||
                        column.fieldname !== 'relationship' ||
                        choice === 'Brother' ||
                        choice === 'Sister',
                    )
                    .map((choice) => (
                      <option key={choice} value={choice}>
                        {choice}
                      </option>
                    ))}
                </select>
              ) : column.fieldtype === 'Link' ? (
                <select
                  className={styles.input}
                  value={row[column.fieldname] ?? ''}
                  onChange={(event) => update(index, column.fieldname, event.target.value)}
                >
                  <option value="">Select</option>
                  {(column.link_options ?? []).map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              ) : column.fieldtype === 'Check' ? (
                <input
                  type="checkbox"
                  className={styles.tick}
                  checked={row[column.fieldname] === '1'}
                  onChange={(event) => update(index, column.fieldname, event.target.checked ? '1' : '0')}
                />
              ) : (
                <input
                  className={styles.input}
                  type={inputType(column.fieldtype)}
                  value={row[column.fieldname] ?? ''}
                  onChange={(event) => update(index, column.fieldname, event.target.value)}
                />
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.subtleButton}
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.subtleButton}
        onClick={() => onChange([...rows, isSiblingTable ? { studies_here: '1' } : {}])}
      >
        + Add {field.label.replace(/s$/, '')}
      </button>
    </div>
  )
}

/** One derived field, rendered by its fieldtype. */
export function AdmissionField({
  field,
  values,
  onChange,
  styles,
  error,
  file = null,
  onFileChange,
}: {
  field: SchemaField
  values: FormValues
  onChange: (fieldname: string, value: FormValue) => void
  styles: AdmissionFormStyles
  error?: string
  file?: File | null
  onFileChange?: (fieldname: string, file: File | null) => void
}) {
  const required = isFieldRequired(field, values)
  const locked = !!field.locked || !!field.read_only
  const raw = values[field.fieldname]
  const value = Array.isArray(raw) ? '' : (raw ?? '')
  const invalid = !!error
  // `cn` (tailwind-merge) resolves the clash: the red border replaces the
  // template's own rather than fighting it for CSS precedence.
  const controlClass = cn(styles.input, invalid && (styles.inputInvalid ?? INVALID_CONTROL))
  // Every field is wrapped in a marker the form body can scroll to when a step
  // fails, and every bad answer states its own problem underneath.
  const wrap = (content: React.ReactNode, className?: string) => (
    <div data-admission-field={field.fieldname} className={className}>
      {content}
      {error && (
        <p id={errorId(field.fieldname)} role="alert" className={cn('mt-1.5', styles.fieldError ?? FIELD_ERROR_TEXT)}>
          {error}
        </p>
      )}
    </div>
  )
  const flags = {
    'aria-invalid': invalid || undefined,
    'aria-describedby': invalid ? errorId(field.fieldname) : undefined,
  } as const

  if (isFileField(field)) {
    return wrap(
      <UploadBox
        field={field}
        required={required}
        invalid={invalid}
        file={file}
        onFile={(picked) => onFileChange?.(field.fieldname, picked)}
        styles={styles}
      />,
    )
  }

  if (isChildTable(field)) {
    return wrap(
      <ChildTable
        field={field}
        rows={childRows(values, field.fieldname)}
        required={required}
        onChange={(rows) => onChange(field.fieldname, rows)}
        styles={styles}
      />,
    )
  }

  if (field.fieldtype === 'Check') {
    return wrap(
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className={styles.tick}
          checked={value === 1 || value === '1'}
          disabled={locked}
          {...flags}
          onChange={(event) => onChange(field.fieldname, event.target.checked ? 1 : 0)}
        />
        <span className={styles.label}>
          {field.label}
          {required && <Req />}
        </span>
      </label>,
    )
  }

  const control = (() => {
    if (field.fieldtype === 'Select') {
      return (
        <select
          className={controlClass}
          name={field.fieldname}
          required={required}
          disabled={locked}
          value={String(value)}
          {...flags}
          onChange={(event) => onChange(field.fieldname, event.target.value)}
        >
          <option value="">Select {field.label.toLowerCase()}</option>
          {selectChoices(field).map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      )
    }

    if (field.fieldtype === 'Link' || field.fieldtype === 'Dynamic Link') {
      const choices = linkChoices(field, values)
      return (
        <select
          className={controlClass}
          name={field.fieldname}
          required={required}
          disabled={locked}
          value={String(value)}
          {...flags}
          onChange={(event) => onChange(field.fieldname, event.target.value)}
        >
          <option value="">Select {field.label.toLowerCase()}</option>
          {choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      )
    }

    if (WIDE_TYPES.has(field.fieldtype)) {
      return (
        <textarea
          className={controlClass}
          name={field.fieldname}
          rows={3}
          required={required}
          disabled={locked}
          value={String(value)}
          {...flags}
          onChange={(event) => onChange(field.fieldname, event.target.value)}
        />
      )
    }

    return (
      <input
        className={controlClass}
        name={field.fieldname}
        type={isEmailField(field) ? 'email' : inputType(field.fieldtype)}
        required={required}
        disabled={locked}
        value={String(value)}
        {...flags}
        onChange={(event) => onChange(field.fieldname, event.target.value)}
      />
    )
  })()

  return wrap(
    <>
      <label className={styles.label}>
        {field.label}
        {required && <Req />}
      </label>
      {control}
      {field.description && <p className={styles.help}>{field.description}</p>}
    </>,
    styles.field ?? 'flex flex-col gap-1.5',
  )
}

/** Every visible field of one wizard step, grouped by the DocType's sections. */
export default function AdmissionFormFields({
  step,
  values,
  onChange,
  styles,
  errors,
  files,
  onFileChange,
}: AdmissionFieldsProps) {
  return (
    <div className="space-y-6">
      {step.sections.map((section, index) => {
        const visible = section.fields.filter((field) => isFieldVisible(field, values))
        if (!visible.length) return null
        return (
          <div key={section.label || index} className="space-y-4">
            {section.label && <h4 className={styles.sectionTitle}>{section.label}</h4>}
            <div className={styles.grid ?? 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
              {visible.map((field) => (
                <div
                  key={field.fieldname}
                  className={WIDE_TYPES.has(field.fieldtype) || isFileField(field) ? 'md:col-span-2' : ''}
                >
                  <AdmissionField
                    field={field}
                    values={values}
                    onChange={onChange}
                    styles={styles}
                    error={errors?.[field.fieldname]}
                    file={files?.[field.fieldname] ?? null}
                    onFileChange={onFileChange}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
