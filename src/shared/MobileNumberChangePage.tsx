'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SchoolData } from '@/types/school.types'
import { chrome as willow } from '@/templates/template-a/components/admissions/chrome'
import { chrome as heritage } from '@/templates/template-b/components/admissions/chrome'
import { chrome as quill } from '@/templates/template-d/components/admissions/chrome'
import { chrome as ledger } from '@/templates/template-e/components/admissions/chrome'
import { chrome as almanac } from '@/templates/template-f/components/admissions/chrome'

export default function MobileNumberChangePage({ data }: { data: SchoolData }) {
  const template = data.config?.template_id
  const chrome = template === 'template-d' ? quill : template === 'template-e' ? ledger
    : template === 'template-f' || template === 'template-i' ? almanac
    : ['template-b', 'template-g', 'template-h'].includes(template) ? heritage : willow
  const pathname = usePathname() ?? ''
  const inDemo = pathname.startsWith('/demo')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ request_id: string; message: string } | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setError('')
    // Template demos must never send student identity details to a backend.
    if (inDemo) {
      setError('This is a preview. Open your school’s website to submit a request.')
      return
    }
    const form = event.currentTarget
    const fields = new FormData(form)
    const payload = Object.fromEntries(['student_id', 'date_of_birth', 'current_mobile', 'new_mobile', 'reason']
      .map((key) => [key, String(fields.get(key) ?? '').trim()]))
    setBusy(true)
    try {
      const response = await fetch('/api/mobile-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      })
      const json = await response.json()
      if (response.ok && json.ok) {
        setResult(json)
        form.reset()
      } else {
        setError(json.error || 'Could not submit your request. Please try again later.')
      }
    } catch {
      setError('Could not reach the school. Please check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={`mx-auto max-w-[900px] px-5 pt-36 md:px-8 md:pt-44 lg:px-12 ${chrome === willow ? 'pb-60' : 'pb-16'}`}>
      <h1 className={`${chrome.stateTitle} mb-4`}>Request mobile number change</h1>
      <p className={`${chrome.bodyText} mb-8 max-w-[65ch]`}>
        Submit a request to {data.name} to change the mobile number used for your app login.
        The school office will verify your identity before approving the change.
      </p>
      {result ? (
        <div className={chrome.panel} role="status" tabIndex={-1} ref={(node) => node?.focus()}>
          <h2 className={`${chrome.sectionTitle} mb-3`}>Request received</h2>
          <p className={chrome.bodyText}>Reference: <strong>{result.request_id}</strong></p>
          <p className={`${chrome.bodyText} mt-3`}>{result.message}</p>
          <Link href="/contact" className={`${chrome.subtleButton} mt-6 inline-block`}>Contact the school office</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-6" aria-busy={busy}>
          <fieldset disabled={busy} className="grid min-w-0 grid-cols-1 gap-5 border-0 p-0 md:grid-cols-2">
            <legend className="sr-only">Student and mobile number details</legend>
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile-change-student" className={chrome.label}>Student ID *</label>
              <input id="mobile-change-student" name="student_id" className={chrome.input} required maxLength={140} autoComplete="off" />
              <p className={chrome.help}>Use the Student ID shown on the student’s school records.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile-change-dob" className={chrome.label}>Student’s date of birth *</label>
              <input id="mobile-change-dob" name="date_of_birth" type="date" className={chrome.input} required autoComplete="off" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile-change-current" className={chrome.label}>Currently registered mobile number *</label>
              <input id="mobile-change-current" name="current_mobile" type="tel" inputMode="tel" className={chrome.input} required maxLength={24} autoComplete="off" />
              <p className={chrome.help}>You can request a change even if you no longer have access to this number.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile-change-new" className={chrome.label}>New mobile number *</label>
              <input id="mobile-change-new" name="new_mobile" type="tel" inputMode="tel" className={chrome.input} required maxLength={24} autoComplete="off" />
              <p className={chrome.help}>Enter a 10-digit Indian mobile number. The school may call this number for verification.</p>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="mobile-change-reason" className={chrome.label}>Reason for change *</label>
              <textarea id="mobile-change-reason" name="reason" className={chrome.input} required rows={3} maxLength={1000} />
              <p className={chrome.help}>For example, a lost SIM or a discontinued number. Do not include passwords, OTPs or identity document numbers.</p>
            </div>
          </fieldset>
          <label className={`flex items-start gap-3 ${chrome.bodyText}`}>
            <input type="checkbox" required disabled={busy} className={`mt-1 ${chrome.tick}`} />
            <span>I am the student’s parent, guardian or the student, and I am authorised to request this change. I understand that school approval is required.</span>
          </label>
          {error && <p className={chrome.errorText} role="alert">{error}</p>}
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className={chrome.primaryButton} disabled={busy}>{busy ? 'Submitting…' : 'Request change'}</button>
            <Link href="/contact" className={chrome.subtleButton}>Need help? Contact the school</Link>
          </div>
          <p className={chrome.help}>Your details are used to verify and review this request. <Link href="/privacy" className="underline">Privacy Policy</Link></p>
        </form>
      )}
    </section>
  )
}
