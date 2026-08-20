'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { Eyebrow } from '../common/Bits'
import StartApplicationLink from '@/shared/StartApplicationLink'
import Link from 'next/link'

/**
 * Admissions opener — the process as a ruled timeline on the left, and a sticky
 * card on the right that stays with the reader all the way down the steps.
 *
 * The card is deliberately NOT a second form: the real application lives further
 * down the page, so this one points to it and offers the phone number for
 * families who would rather talk to someone.
 */
export default function AdmissionsHero({ data }: { data: SchoolData }) {
  const admissions = data.admissions
  const steps = useLiveList('admissions.process.steps', admissions?.process?.steps ?? [])
  const highlights = useLiveList('admissions.highlights', admissions?.highlights ?? [])
  const phone = data.contact?.phone?.[0]
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

        {steps.length > 0 && (
          <div className="flex flex-col border-t border-tf-border">
            {steps.map((step, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-2 border-b border-tf-border py-5 sm:grid-cols-[150px_1fr] sm:gap-6"
              >
                <div className="text-[14px] font-semibold tracking-[0.02em] text-tf-accent">
                  Step {String(step.step ?? i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div
                    data-edit={`admissions.process.steps.${i}.title`}
                    className="mb-1 text-[18px] font-medium tracking-[-0.015em] text-tf-ink"
                  >
                    {step.title}
                  </div>
                  <div
                    data-edit={`admissions.process.steps.${i}.description`}
                    className="text-[15px] leading-[1.6] text-tf-muted"
                  >
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="rounded-[24px] bg-tf-panel p-8 lg:sticky lg:top-[104px] lg:p-9">
        <h2 className="m-0 mb-1.5 text-[24px] tracking-[-0.028em] text-tf-ink lg:text-[27px]">
          Ready when you are
        </h2>
        <p className="m-0 mb-6 text-[14.5px] leading-[1.55] text-tf-muted">
          The application takes about fifteen minutes. You can save nothing halfway, so gather
          documents first.
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
        {phone && (
          <p className="m-0 mt-4 text-[12.5px] leading-[1.5] text-tf-faint">
            Or call admissions on <span data-bind="contact.phone.0">{phone}</span>.
          </p>
        )}
      </aside>
    </section>
  )
}
