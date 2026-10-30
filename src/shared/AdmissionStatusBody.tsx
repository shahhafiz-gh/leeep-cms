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
  /** Present only when the school lets families download their own form. */
  download_token?: string | null
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
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  /**
   * Fetched rather than linked so a failure (expired token, school switched
   * downloads off) lands as a message here instead of a raw JSON page.
   */
  async function onDownload() {
    if (!result?.download_token || downloading) return
    setDownloading(true)
    setDownloadError(null)
    try {
      const res = await fetch(
        `/api/admissions/download?token=${encodeURIComponent(result.download_token)}`,
        { cache: 'no-store' },
      )
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setDownloadError(json?.error || 'Could not download the application form. Please try again later.')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Application ${result.application}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      // Give the browser a moment to start the save before the URL goes away.
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch {
      setDownloadError('Could not reach the school right now. Please check your connection and try again.')
    } finally {
      setDownloading(false)
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (checking) return

    setChecking(true)
    setError(null)
    setResult(null)
    setDownloadError(null)

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

        {downloadError && (
          <p className={chrome.errorText} role="alert">
            {downloadError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {result.download_token && (
            <button
              type="button"
              onClick={onDownload}
              disabled={downloading}
              className={`${chrome.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Icon
                icon={downloading ? 'lucide:loader-2' : 'lucide:download'}
                className={`text-lg ${downloading ? 'animate-spin' : ''}`}
              />
              {downloading ? 'Preparing…' : 'Download application form'}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setDownloadError(null)
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
            placeholder="e.g. 2026-101"
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
