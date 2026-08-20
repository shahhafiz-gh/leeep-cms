'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { AdmissionChrome } from './AdmissionFormBody'

interface StatusResult {
  application: string
  status: string
  message: string
  program?: string
  academic_year?: string
  applied_on?: string
}

/**
 * The public "check my application status" lookup, minus the template's shell.
 *
 * Two fields, because the backend requires two: an application number alone
 * would let anyone walk a sequential range and read other families' outcomes.
 * The date of birth is the second factor.
 *
 * Deliberately thin: it renders exactly what the backend returns and never
 * interprets it. In particular it does NOT try to distinguish "no such
 * application" from "wrong date of birth" — the server returns one identical
 * message for both, and inferring more here would give back the enumeration the
 * server is refusing.
 */
export default function AdmissionStatusBody({
  chrome,
  schoolName,
}: {
  chrome: AdmissionChrome
  schoolName: string
}): ReactNode {
  const [application, setApplication] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [result, setResult] = useState<StatusResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (checking) return

    setChecking(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/admissions/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application: application.trim(),
          date_of_birth: dateOfBirth,
        }),
      })
      const json = await res.json()
      if (json?.ok) setResult(json as StatusResult)
      else setError(json?.error || 'Could not check the status right now. Please try again later.')
    } catch {
      setError('Could not reach the school right now. Please check your connection and try again.')
    } finally {
      setChecking(false)
    }
  }

  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <div className={chrome.panel}>
          <p className={`m-0 mb-1 text-[12px] tracking-[0.14em] uppercase ${chrome.bodyText}`}>
            Application {result.application}
          </p>
          <h3 className={`${chrome.stateTitle} m-0 mb-2`}>{result.status}</h3>
          <p className={`m-0 ${chrome.bodyText}`}>{result.message}</p>

          {(result.program || result.applied_on) && (
            <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
              {result.program && (
                <div>
                  <dt className={`text-[12px] tracking-[0.12em] uppercase ${chrome.bodyText}`}>
                    Class
                  </dt>
                  <dd className={`m-0 ${chrome.bodyText}`}>
                    {result.program}
                    {result.academic_year ? ` · ${result.academic_year}` : ''}
                  </dd>
                </div>
              )}
              {result.applied_on && (
                <div>
                  <dt className={`text-[12px] tracking-[0.12em] uppercase ${chrome.bodyText}`}>
                    Applied on
                  </dt>
                  <dd className={`m-0 tabular-nums ${chrome.bodyText}`}>{result.applied_on}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setResult(null)
              setApplication('')
              setDateOfBirth('')
            }}
            className={chrome.secondaryButton}
          >
            Check another application
          </button>
          <Link href="/contact" className={chrome.subtleButton}>
            Contact {schoolName}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={onSubmit}>
      <div className={chrome.grid}>
        <div className="flex flex-col gap-1.5">
          <label className={chrome.label} htmlFor="application-number">
            Application number<span className="text-red-500"> *</span>
          </label>
          <input
            id="application-number"
            className={chrome.input}
            value={application}
            onChange={(event) => setApplication(event.target.value)}
            placeholder="e.g. EDU-APP-0001"
            autoComplete="off"
            // Application numbers are printed on the confirmation screen; a
            // pasted value often arrives with stray spacing, so it is trimmed
            // on submit rather than rejected here.
            required
          />
          <p className={chrome.help}>The number shown when you submitted the application.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={chrome.label} htmlFor="application-dob">
            Student&rsquo;s date of birth<span className="text-red-500"> *</span>
          </label>
          <input
            id="application-dob"
            type="date"
            className={chrome.input}
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            required
          />
          <p className={chrome.help}>As entered on the application.</p>
        </div>
      </div>

      {error && (
        <p className={chrome.errorText} role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={checking || !application.trim() || !dateOfBirth}
          className={`${chrome.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {checking && <Icon icon="lucide:loader-2" className="animate-spin text-lg" />}
          {checking ? 'Checking…' : 'Check status'}
        </button>
        <Link href="/admissions" className={chrome.subtleButton}>
          Back to admissions
        </Link>
      </div>
    </form>
  )
}
