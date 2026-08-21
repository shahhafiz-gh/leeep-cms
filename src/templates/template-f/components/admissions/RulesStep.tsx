'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { fetchAdmissionSchema, type AdmissionCriteria } from '@/shared/admission-schema'
import { useAdmissionOverview } from '@/shared/useAdmissionOverview'
import type { AdmissionChrome } from '@/shared/AdmissionFormBody'
import type { SchoolData } from '@/types/school.types'

/**
 * Step one of Almanac's application: what the school is admitting into this
 * session, and the rules the family accepts before answering anything.
 *
 * This is the block that used to sit on the admissions page as "This session's
 * admissions". It reads better here: a family met it there, scrolled past it,
 * and then agreed to a separate declaration on the form. Now the rules they
 * read are the rules they tick — one screen, one decision.
 *
 * Everything shown comes from the school's own `Student Admission` record (the
 * window, the age windows and fees, the introduction it publishes), so the
 * rules on screen are the ones the submission is validated against. Only the
 * HEADING is website copy (`admissions.rulesTitle`), so a school can rename it
 * inline like any other title on the site.
 */
export default function RulesStep({
  data,
  chrome,
  schoolName,
  /** The chosen class's terms, when a class is already known from the URL. */
  terms,
  accepted,
  onAcceptedChange,
  onContinue,
}: {
  data: SchoolData
  chrome: AdmissionChrome
  schoolName: string
  terms?: string
  accepted: boolean
  onAcceptedChange: (value: boolean) => void
  onContinue: () => void
}) {
  const { loading, active, currency } = useAdmissionOverview()
  const genericTerms = useGenericTerms(terms === undefined)
  const rules = terms || genericTerms
  const title = data.admissions?.rulesTitle || 'Admission rules'

  if (loading) {
    return (
      <div className={`flex items-center justify-center gap-3 py-12 ${chrome.bodyText}`}>
        <Icon icon="lucide:loader-2" className="animate-spin text-2xl" />
        <span>Loading the admission rules…</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 data-edit="admissions.rulesTitle" className={chrome.heading}>
          {title}
        </h3>
        {active && (
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
        )}

        {active?.introduction && (
          <div
            className={`${chrome.bodyText} mt-5 [&_*]:my-1`}
            dangerouslySetInnerHTML={{ __html: active.introduction }}
          />
        )}
      </div>

      {/* Class-wise criteria, straight from Student Admission Program. No
          "Apply" column: choosing the class is the next step, not this one. */}
      {active && active.programs.length > 0 && (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`${chrome.help} mt-3`}>
            Age is checked against the date shown above, so an applicant just outside a class&apos;s
            range cannot be submitted into it.
          </p>
        </div>
      )}

      <div>
        <h4 className={chrome.sectionTitle}>Terms and conditions</h4>
        {rules ? (
          <div
            className={`${chrome.bodyText} mt-3 [&_*]:my-1`}
            dangerouslySetInnerHTML={{ __html: rules }}
          />
        ) : (
          <p className={`${chrome.bodyText} mt-3`}>
            Please read these before you begin. By continuing you confirm that the information you
            provide will be true and correct to the best of your knowledge, and you understand that
            incorrect information may lead to the cancellation of admission.
          </p>
        )}
      </div>

      <div className={chrome.panel}>
        <label className={`flex cursor-pointer items-start gap-2.5 ${chrome.label}`}>
          <input
            className={`mt-0.5 ${chrome.tick ?? ''}`}
            type="checkbox"
            checked={accepted}
            onChange={(event) => onAcceptedChange(event.target.checked)}
          />
          <span>
            I have read and agree to the terms and conditions, and to abide by the rules and
            regulations of {schoolName}.
            <span className="text-red-500"> *</span>
          </span>
        </label>

        <div className="mt-6 flex justify-end">
          {/* Disabled rather than hidden: the applicant can see what unlocks the
              form, instead of a button appearing out of nowhere. */}
          <button
            type="button"
            disabled={!accepted}
            onClick={onContinue}
            className={`${chrome.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Continue to the application
            <Icon icon="lucide:arrow-right" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * The school's declaration text when no class has been chosen yet.
 *
 * `Admission Form Profile` settings normally arrive with the class's field set,
 * which the form only fetches once a class is picked — and here the rules come
 * FIRST. Asking the schema route with no class returns the school's default
 * profile, which is what a family reading the rules up front should see.
 */
function useGenericTerms(enabled: boolean): string {
  const [terms, setTerms] = useState('')

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    ;(async () => {
      const schema = await fetchAdmissionSchema()
      if (cancelled) return
      setTerms(schema?.settings?.terms_and_conditions ?? '')
    })()
    return () => {
      cancelled = true
    }
  }, [enabled])

  return terms
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
