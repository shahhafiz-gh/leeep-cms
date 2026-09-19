'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { CustomPageBlock } from '@/types/school.types'

interface FormBlockProps {
  block: CustomPageBlock
  /** The page's slug and this form's id — what the server looks the form up by. */
  page: string
  formId: string
}

const INPUT =
  'w-full rounded-md border border-ts-line bg-white px-3.5 py-2.5 text-[15px] text-ts-heading shadow-sm outline-none transition focus:border-ts-primary focus:ring-2 focus:ring-ts-primary-100'

/**
 * A school-written form. Answers are keyed by the question as worded, which is
 * also how the server checks them against the published form and how staff
 * read them in `Website Form Submission`.
 */
export default function FormBlock({ block, page, formId }: FormBlockProps) {
  const fields = (block.fields ?? []).filter((field) => field.label?.trim())
  const [values, setValues] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  if (!fields.length) return null

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, form: formId, values }),
      })
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok || !json?.ok) {
        setError(json?.error || 'Could not send the form. Please try again.')
        setState('idle')
        return
      }
      setState('sent')
    } catch {
      setError('Could not send the form. Please check your connection and try again.')
      setState('idle')
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-ts-line">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ts-primary-50 text-ts-primary">
          <Icon icon="lucide:check" className="h-7 w-7" />
        </span>
        <p className="mt-4 text-lg font-bold text-ts-heading">
          {block.successMessage || 'Thank you — your response has been received.'}
        </p>
      </div>
    )
  }

  const set = (label: string, value: string) => setValues((current) => ({ ...current, [label]: value }))

  return (
    <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ts-line sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field, i) => {
          const id = `f-${formId}-${i}`
          const required = (field.required ?? '').toLowerCase() === 'yes'
          const type = field.type || 'text'
          const options = (field.options ?? '')
            .split(',')
            .map((option) => option.trim())
            .filter(Boolean)
          return (
            <div key={id} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ts-heading">
                {field.label}
                {required && <span className="ml-0.5 text-red-600">*</span>}
              </label>
              {type === 'textarea' ? (
                <textarea
                  id={id}
                  rows={4}
                  required={required}
                  maxLength={4000}
                  value={values[field.label] ?? ''}
                  onChange={(e) => set(field.label, e.target.value)}
                  className={INPUT}
                />
              ) : type === 'select' ? (
                <select
                  id={id}
                  required={required}
                  value={values[field.label] ?? ''}
                  onChange={(e) => set(field.label, e.target.value)}
                  className={INPUT}
                >
                  <option value="">Select…</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type={type}
                  required={required}
                  maxLength={type === 'text' ? 300 : undefined}
                  value={values[field.label] ?? ''}
                  onChange={(e) => set(field.label, e.target.value)}
                  className={INPUT}
                />
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-ts-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-ts-primary-700 disabled:opacity-60"
      >
        {state === 'sending' && <Icon icon="lucide:loader-circle" className="h-4 w-4 animate-spin" />}
        {block.submitLabel || 'Submit'}
      </button>
    </form>
  )
}
