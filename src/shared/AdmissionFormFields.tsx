'use client'

import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from './utils/cn'
import {
  childRows,
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
import { isEmailField } from './admission-validation'

/**
 * Renders the school's derived admission fields — shared by every template.
 *
 * The templates own the LOOK and pass it in as `styles`; this component owns the
 * behaviour, so a fieldtype only has to be handled once and every template picks
 * it up. Nothing here knows what "Aadhaar Number" or "Father's Name" is: it just
 * renders whatever `Student Applicant` currently defines (see
 * `admission-schema.ts`).
 *
 * Every field is wrapped in `data-field="<fieldname>"` so a failed check can
 * scroll the family to the question it is about, and renders its own error
 * underneath — the form no longer saves problems up for one line at the end.
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
  /** Files kept in form state — an input unmounts with its step, a File must not. */
  files: Record<string, File | undefined>
  onFile: (fieldname: string, file: File | null) => void
  /** Re-check one field when the family leaves it. */
  onBlurField: (fieldname: string) => void
  /** fieldname -> the problem with its current answer. */
  errors: Record<string, string>
  styles: AdmissionFormStyles
}

/** Red asterisk marking a required field. */
function Req() {
  return <span className="text-red-500"> *</span>
}

/**
 * The look of a control holding a rejected answer.
 *
 * A template may override it with `styles.inputInvalid`, but it does not have
 * to: red-500 is how every template already spells "wrong" (the required
 * asterisk), and `cn` (tailwind-merge) resolves the clash so this border
 * REPLACES the template's own rather than fighting it for precedence.
 */
const INVALID_CONTROL =
  'border-red-500 ring-1 ring-red-500/30 focus:border-red-500 focus:ring-red-500'
const FIELD_ERROR_TEXT = 'text-xs font-medium text-red-600'

/** The message under a control, when its answer was rejected. */
function FieldError({
  id,
  message,
  styles,
}: {
  id: string
  message?: string
  styles: AdmissionFormStyles
}) {
  if (!message) return null
  return (
    <p
      id={id}
      role="alert"
      className={cn('mt-1 flex items-start gap-1', styles.fieldError ?? FIELD_ERROR_TEXT)}
    >
      <Icon icon="lucide:alert-circle" className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  )
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

/**
 * One upload card. The whole card opens the picker.
 *
 * The chosen File lives in the form's state, NOT in this input: only the current
 * step is mounted, so the input is destroyed the moment the family clicks
 * Continue. Holding the file here is what used to make every attachment have to
 * be picked again after a step change — and made the final check report files
 * that had been chosen as missing.
 */
function UploadBox({
  field,
  required,
  file,
  onFile,
  error,
  styles,
}: {
  field: SchemaField
  required: boolean
  file?: File
  onFile: (fieldname: string, file: File | null) => void
  error?: string
  styles: AdmissionFormStyles
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const maxMB = MAX_UPLOAD_MB
  const accept = field.fieldtype === 'Attach Image' ? '.jpg,.jpeg,.png' : '.pdf,.jpg,.jpeg,.png'

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0]
    if (!picked) return
    if (picked.size > maxMB * 1024 * 1024) {
      event.target.value = ''
      setSizeError(`File is larger than ${maxMB}MB`)
      onFile(field.fieldname, null)
      return
    }
    setSizeError(null)
    onFile(field.fieldname, picked)
  }

  const clear = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (inputRef.current) inputRef.current.value = ''
    setSizeError(null)
    onFile(field.fieldname, null)
  }

  const message = sizeError ?? error

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          file ? styles.uploadCardFilled : styles.uploadCard,
          message && (styles.inputInvalid ?? INVALID_CONTROL),
        )}
      >
        <input
          ref={inputRef}
          type="file"
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
      </div>
      <FieldError id={`${field.fieldname}-error`} message={message} styles={styles} />
    </div>
  )
}

/** A repeatable set of rows for a child table (siblings, and any the school adds). */
function ChildTable({
  field,
  rows,
  required,
  onChange,
  error,
  styles,
}: {
  field: SchemaField
  rows: ChildRows
  required: boolean
  onChange: (rows: ChildRows) => void
  error?: string
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
      <FieldError id={`${field.fieldname}-error`} message={error} styles={styles} />
    </div>
  )
}

/** One derived field, rendered by its fieldtype. */
export function AdmissionField({
  field,
  values,
  onChange,
  files,
  onFile,
  onBlurField,
  error,
  styles,
}: {
  field: SchemaField
  values: FormValues
  onChange: (fieldname: string, value: FormValue) => void
  files: Record<string, File | undefined>
  onFile: (fieldname: string, file: File | null) => void
  onBlurField: (fieldname: string) => void
  error?: string
  styles: AdmissionFormStyles
}) {
  const required = isFieldRequired(field, values)
  const locked = !!field.locked || !!field.read_only
  const raw = values[field.fieldname]
  const value = Array.isArray(raw) ? '' : (raw ?? '')
  const errorId = `${field.fieldname}-error`
  // Shared by every control: the red outline, and the pointer an assistive
  // reader follows from the control to the reason it was rejected.
  const invalid = {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  } as const
  // `cn` (tailwind-merge) resolves the clash: the red border replaces the
  // template's own rather than fighting it for CSS precedence.
  const controlClass = cn(styles.input, error && (styles.inputInvalid ?? INVALID_CONTROL))

  if (isFileField(field)) {
    return (
      <UploadBox
        field={field}
        required={required}
        file={files[field.fieldname]}
        onFile={onFile}
        error={error}
        styles={styles}
      />
    )
  }

  if (isChildTable(field)) {
    return (
      <ChildTable
        field={field}
        rows={childRows(values, field.fieldname)}
        required={required}
        onChange={(rows) => onChange(field.fieldname, rows)}
        error={error}
        styles={styles}
      />
    )
  }

  if (field.fieldtype === 'Check') {
    return (
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className={styles.tick}
            checked={value === 1 || value === '1'}
            disabled={locked}
            onChange={(event) => onChange(field.fieldname, event.target.checked ? 1 : 0)}
            onBlur={() => onBlurField(field.fieldname)}
            {...invalid}
          />
          <span className={styles.label}>
            {field.label}
            {required && <Req />}
          </span>
        </label>
        <FieldError id={errorId} message={error} styles={styles} />
      </div>
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
          onChange={(event) => onChange(field.fieldname, event.target.value)}
          onBlur={() => onBlurField(field.fieldname)}
          {...invalid}
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
          onChange={(event) => onChange(field.fieldname, event.target.value)}
          onBlur={() => onBlurField(field.fieldname)}
          {...invalid}
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
          onChange={(event) => onChange(field.fieldname, event.target.value)}
          onBlur={() => onBlurField(field.fieldname)}
          {...invalid}
        />
      )
    }

    return (
      <input
        className={controlClass}
        name={field.fieldname}
        type={isEmailField(field) ? 'email' : inputType(field.fieldtype)}
        inputMode={field.fieldtype === 'Phone' ? 'numeric' : undefined}
        required={required}
        disabled={locked}
        value={String(value)}
        onChange={(event) => onChange(field.fieldname, event.target.value)}
        onBlur={() => onBlurField(field.fieldname)}
        {...invalid}
      />
    )
  })()

  return (
    <div className={styles.field ?? 'flex flex-col gap-1.5'}>
      <label className={styles.label}>
        {field.label}
        {required && <Req />}
      </label>
      {control}
      <FieldError id={errorId} message={error} styles={styles} />
      {field.description && <p className={styles.help}>{field.description}</p>}
    </div>
  )
}

/** Every visible field of one wizard step, grouped by the DocType's sections. */
export default function AdmissionFormFields({
  step,
  values,
  onChange,
  files,
  onFile,
  onBlurField,
  errors,
  styles,
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
                  // The anchor a failed check scrolls to.
                  data-field={field.fieldname}
                  className={`scroll-mt-28 ${
                    WIDE_TYPES.has(field.fieldtype) || isFileField(field) ? 'md:col-span-2' : ''
                  }`}
                >
                  <AdmissionField
                    field={field}
                    values={values}
                    onChange={onChange}
                    files={files}
                    onFile={onFile}
                    onBlurField={onBlurField}
                    error={errors[field.fieldname]}
                    styles={styles}
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
