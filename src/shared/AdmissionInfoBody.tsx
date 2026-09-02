'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useApplyHref } from './apply-link'
import { useAdmissionOverview } from './useAdmissionOverview'
import type { AdmissionCriteria } from './admission-schema'
import RichText from './RichText'

/**
 * The admission DETAILS block on the public admissions page — the step before
 * the form.
 *
 * It answers "is the school admitting, into which classes, and what does each
 * class ask for?" straight from the school's `Student Admission` records, so
 * nobody has to retype the age windows and fees into website copy where they
 * would drift out of date.
 *
 * When nothing is open it says so plainly and renders NO route to the form —
 * a family should never fill in an application the school cannot accept.
 */

export interface AdmissionInfoChrome {
  sectionTitle: string
  heading: string
  bodyText: string
  help: string
  label: string
  chip: string
  panel: string
  primaryButton: string
  secondaryButton: string
  stepActive: string
  stepIdle: string
  accentIcon: string
  /** The class-wise table. */
  table: string
  tableHead: string
  tableCell: string
  /** Emphasis for a closed / empty state. */
  stateTitle: string
}

export interface AdmissionInfoBodyProps {
  chrome: AdmissionInfoChrome
  schoolName: string
  /** Copy above the class table. */
  title?: string
  /** Shown when the school is not admitting. */
  closedTitle?: string
  closedText?: string
}

function formatDate(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ageLabel(entry: AdmissionCriteria): string {
  if (!entry.min_age && !entry.max_age) return '—'
  if (entry.min_age && entry.max_age) return `${entry.min_age} – ${entry.max_age} yrs`
  return entry.min_age ? `${entry.min_age}+ yrs` : `under ${entry.max_age} yrs`
}

export default function AdmissionInfoBody({
  chrome,
  schoolName,
  title = 'Admission details',
  closedTitle = 'Admissions are closed',
  closedText,
}: AdmissionInfoBodyProps) {
  const { loading, isOpen, admissions, active, selected, setSelected, hasChoice, currency } =
    useAdmissionOverview()
  // The CTA carries the chosen window so the form opens on the right intake.
  const applyHref = useApplyHref({ admission: active?.name })

  if (loading) {
    return (
      <div className={`flex items-center justify-center gap-3 py-12 ${chrome.bodyText}`}>
        <Icon icon="lucide:loader-2" className="animate-spin text-2xl" />
        <span>Loading admission details…</span>
      </div>
    )
  }

  if (!isOpen || !active) {
    return (
      <div className={chrome.panel}>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <Icon icon="lucide:calendar-clock" className={`text-4xl ${chrome.accentIcon}`} />
          <h3 className={chrome.stateTitle}>{closedTitle}</h3>
          <p className={`max-w-[54ch] ${chrome.bodyText}`}>
            {closedText ??
              `${schoolName} is not accepting applications at the moment. Please check back for the next admission window, or contact the school office.`}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Several intakes running at once is rare; when there is only one, it is
          already selected and no chooser appears. */}
      {hasChoice && (
        <div className="flex flex-wrap gap-2">
          {admissions.map((entry) => (
            <button
              key={entry.name}
              type="button"
              onClick={() => setSelected(entry.name)}
              className={entry.name === selected ? chrome.stepActive : chrome.stepIdle}
            >
              {entry.title}
            </button>
          ))}
        </div>
      )}

      <div>
        <h3 className={chrome.heading}>{title}</h3>

        <div className="flex flex-wrap items-center gap-2.5">
          {active.academic_year && (
            <span className={chrome.chip}>
              <Icon icon="lucide:calendar" />
              Academic year {active.academic_year}
            </span>
          )}
          {(active.admission_start_date || active.admission_end_date) && (
            <span className={chrome.chip}>
              <Icon icon="lucide:calendar-days" />
              {active.admission_start_date && active.admission_end_date
                ? `${formatDate(active.admission_start_date)} – ${formatDate(active.admission_end_date)}`
                : active.admission_end_date
                  ? `Closes ${formatDate(active.admission_end_date)}`
                  : `Opens ${formatDate(active.admission_start_date)}`}
            </span>
          )}
          {active.age_as_on && (
            <span className={chrome.chip}>
              <Icon icon="lucide:cake" />
              Age calculated as on {formatDate(active.age_as_on)}
            </span>
          )}
        </div>

        {active.introduction && (
          <RichText html={active.introduction} className={`${chrome.bodyText} mt-4`} />
        )}
      </div>

      {/* Class-wise criteria, straight from Student Admission Program. */}
      <div>
        <h4 className={chrome.sectionTitle}>Classes open for admission</h4>
        <div className="mt-3 overflow-x-auto">
          <table className={chrome.table}>
            <thead>
              <tr>
                <th className={chrome.tableHead}>Class</th>
                <th className={chrome.tableHead}>Age</th>
                <th className={chrome.tableHead}>Application fee</th>
                <th className={chrome.tableHead}>Notes</th>
                <th className={chrome.tableHead} />
              </tr>
            </thead>
            <tbody>
              {active.programs.map((entry) => (
                <tr key={entry.program}>
                  <td className={`${chrome.tableCell} font-semibold`}>{entry.label}</td>
                  <td className={chrome.tableCell}>{ageLabel(entry)}</td>
                  <td className={chrome.tableCell}>
                    {entry.application_fee > 0 ? `${currency} ${entry.application_fee}` : '—'}
                  </td>
                  <td className={chrome.tableCell}>{entry.description || '—'}</td>
                  <td className={chrome.tableCell}>
                    <ApplyForClass program={entry.program} admission={active.name} chrome={chrome} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`${chrome.help} mt-3`}>
          Age is checked against the date shown above, so an applicant just outside a class&apos;s range
          cannot be submitted into it.
        </p>
      </div>

      {/* The one thing this page exists to do. */}
      <div className={chrome.panel}>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className={chrome.sectionTitle}>Ready to apply?</h4>
            <p className={chrome.bodyText}>
              The application takes a few minutes. You can pick your class on the next page.
            </p>
          </div>
          <Link href={applyHref} className={chrome.primaryButton}>
            Start your application
            <Icon icon="lucide:arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Per-class shortcut: opens the form with that class already chosen. */
function ApplyForClass({
  program,
  admission,
  chrome,
}: {
  program: string
  admission: string
  chrome: AdmissionInfoChrome
}) {
  const href = useApplyHref({ program, admission })
  return (
    <Link href={href} className={chrome.secondaryButton}>
      Apply
    </Link>
  )
}
