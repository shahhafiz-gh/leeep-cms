'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { contactEntryLabel, contactEntryValue } from '@/lib/contact-entry'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { Eyebrow } from '../common/Bits'
import StartApplicationLink from '@/shared/StartApplicationLink'
import Link from 'next/link'

/**
 * Admissions opener — the invitation on the left, and a sticky card on the right
 * that stays with the reader.
 *
 * The card is deliberately NOT a second form: the real application lives on its
 * own page, so this one points to it. The admissions phone sits on the LEFT,
 * under the invitation, as an editable field (`data-edit`) rather than a bound
 * mirror — a school changing who answers the admissions line should be able to
 * do it right here, on the page a family reads it from.
 */
export default function AdmissionsHero({
  data,
  editing = false,
}: {
  data: SchoolData
  editing?: boolean
}) {
  const admissions = data.admissions
  const highlights = useLiveList('admissions.highlights', admissions?.highlights ?? [])
  // In the EDITOR an unset number still renders its (blank) row so it can be
  // filled in — the same rule the footer follows. On the live site an empty
  // value simply doesn't render.
  const phoneEntry = data.contact?.phone?.[0]
  const emailEntry = data.contact?.email?.[0]
  const phone = contactEntryValue(phoneEntry) || (editing ? '' : undefined)
  const email = contactEntryValue(emailEntry) || (editing ? '' : undefined)
  const phoneLabel = contactEntryLabel(phoneEntry) || 'Admissions office'
  const emailLabel = contactEntryLabel(emailEntry) || 'Write to us'
  if (!admissions) return null

  return (
    <section className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-10 px-5 pb-12 pt-12 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12 lg:pt-18">
      <div>
        <Eyebrow className="mb-5">{admissions.subtitle || 'Admissions'}</Eyebrow>
        <h1
          data-edit="admissions.title"
          className="m-0 mb-6 text-[38px] leading-[1.02] tracking-[-0.04em] text-tf-ink sm:text-[52px] lg:text-[68px] lg:leading-none"
        >
          {admissions.title}
        </h1>
        <p
          data-edit="admissions.description"
          className="m-0 mb-10 max-w-[56ch] text-[17px] leading-[1.6] text-tf-body lg:text-[19px]"
        >
          {admissions.description}
        </p>

        {(phone !== undefined || email !== undefined) && (
        <div className="flex flex-col gap-5 border-t border-tf-border pt-8 sm:flex-row sm:gap-12">
          {phone !== undefined && (
          <div>
            <div data-edit="contact.phone.0.label" className="mb-1.5 text-[12px] uppercase tracking-[0.16em] text-tf-faint">
              {phoneLabel}
            </div>
            <a
              href={phone ? `tel:${phone.replace(/\s+/g, '')}` : undefined}
              className="flex items-center gap-2.5 text-[19px] tracking-[-0.02em] text-tf-ink transition-colors hover:text-tf-accent"
            >
              <Icon icon="lucide:phone" className="h-[17px] w-[17px] shrink-0 text-tf-accent" />
              {/* Editable in place: the number families call is the one thing on
                  this page a school changes without touching anything else. */}
              <span data-edit="contact.phone.0.value">{phone}</span>
            </a>
          </div>
          )}
          {email !== undefined && (
            <div>
              <div data-edit="contact.email.0.label" className="mb-1.5 text-[12px] uppercase tracking-[0.16em] text-tf-faint">
                {emailLabel}
              </div>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 text-[19px] tracking-[-0.02em] text-tf-ink transition-colors hover:text-tf-accent"
              >
                <Icon icon="lucide:mail" className="h-[17px] w-[17px] shrink-0 text-tf-accent" />
                <span data-edit="contact.email.0.value">{email}</span>
              </a>
            </div>
          )}
        </div>
        )}
      </div>

      <aside className="rounded-[24px] bg-tf-panel p-8 lg:sticky lg:top-[104px] lg:p-9">
        <h2
          data-edit="admissions.applicationCardTitle"
          className="m-0 mb-1.5 text-[24px] tracking-[-0.028em] text-tf-ink lg:text-[27px]"
        >
          {admissions.applicationCardTitle || 'Ready when you are'}
        </h2>
        <p
          data-edit="admissions.applicationCardDescription"
          className="m-0 mb-6 text-[14.5px] leading-[1.55] text-tf-muted"
        >
          {admissions.applicationCardDescription ||
            'The application takes about ten minutes. You can save nothing halfway, so gather documents first.'}
        </p>

        {highlights.length > 0 && (
          <ul className="mb-7 flex flex-col gap-3 border-t border-tf-border-strong pt-6">
            {highlights.map((badge, i) => (
              <li key={i} className="flex items-start gap-3">
                <Icon
                  icon={badge.icon || 'lucide:check'}
                  data-edit-icon={`admissions.highlights.${i}.icon`}
                  className="mt-0.5 h-[17px] w-[17px] shrink-0 text-tf-accent"
                />
                <span data-edit={`admissions.highlights.${i}.label`} className="text-[15px] text-tf-body">
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        <StartApplicationLink
          label="Start the application"
          className="block rounded-full bg-tf-accent py-[15px] text-center text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          closedClassName="m-0 rounded-full border border-tf-border bg-tf-paper py-[15px] text-center text-[14px] text-tf-body"
        />

        {/* Outside StartApplicationLink on purpose: that component hides itself
            when no admission window is open, and checking a status is exactly
            what a family does AFTER applications have closed. */}
        <Link
          href="/admissions/status"
          className="mt-3 block rounded-full border border-tf-border-strong py-[14px] text-center text-[14.5px] font-medium text-tf-ink transition-colors hover:border-tf-accent hover:text-tf-accent"
        >
          Check application status
        </Link>
      </aside>
    </section>
  )
}
