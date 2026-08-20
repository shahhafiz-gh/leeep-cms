'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { ActionLink, Eyebrow } from '../common/Bits'

/**
 * Closing ink panel — the admissions pitch on the left, and on the right an
 * inset card listing what the school offers (its admissions `highlights`).
 *
 * The source design put a fundraising progress bar here; a CMS school has no
 * such figure, so the slot carries the highlights the admin already maintains
 * rather than inventing a number the school would have to fake.
 */
export default function AdmissionsCta({ data }: { data: SchoolData }) {
  const highlights = useLiveList('admissions.highlights', data.admissions?.highlights ?? [])
  const admissions = data.admissions
  if (!admissions) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 items-center gap-10 rounded-[28px] bg-tf-ink px-7 py-12 md:px-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-16 lg:py-17">
        <div className="flex flex-col gap-5">
          <Eyebrow onInk data-edit="admissions.subtitle">
            {admissions.subtitle || 'Admissions'}
          </Eyebrow>
          <h2
            data-edit="admissions.title"
            className="m-0 text-[32px] leading-[1.08] text-tf-on-ink sm:text-[40px] lg:text-[46px]"
          >
            {admissions.title}
          </h2>
          <p
            data-edit="admissions.description"
            className="m-0 max-w-[50ch] text-[16px] leading-[1.6] text-tf-on-ink-muted lg:text-[17.5px]"
          >
            {admissions.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ActionLink href="/admissions" variant="accent">Start an application</ActionLink>
            <ActionLink href="/contact" variant="outline-on-ink">Visit us</ActionLink>
          </div>
        </div>

        {highlights.length > 0 && (
          <div className="flex flex-col gap-4 rounded-[20px] bg-tf-ink-soft p-8">
            <div className="text-[11.5px] uppercase tracking-[0.16em] text-tf-on-ink-faint">
              What families get
            </div>
            <ul className="flex flex-col gap-3.5">
              {highlights.map((badge, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon
                    icon={badge.icon || 'lucide:check'}
                    data-edit-icon={`admissions.highlights.${i}.icon`}
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 text-tf-accent-soft"
                  />
                  <div className="flex flex-col">
                    <span data-edit={`admissions.highlights.${i}.label`} className="text-[15.5px] text-tf-on-ink">
                      {badge.label}
                    </span>
                    {badge.sublabel && (
                      <span data-edit={`admissions.highlights.${i}.sublabel`} className="text-[14px] text-tf-on-ink-faint">
                        {badge.sublabel}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
