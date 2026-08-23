'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { Container } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'
import StartApplicationLink from '@/shared/StartApplicationLink'

function contactValue(entry: string | { value?: string } | undefined) {
  return typeof entry === 'string' ? entry : entry?.value || ''
}

/**
 * Tuition as a ruled price list, beside a tinted panel of what the school wants
 * a family to know before applying.
 *
 * The design put an inquiry form in that panel; the real application form lives
 * further down this page, so the panel carries the admissions highlights and
 * points at it rather than offering a second, competing form.
 */
export default function TuitionSection({ data }: { data: SchoolData }) {
  const fees = useLiveList('admissions.feeStructure', data.admissions?.feeStructure ?? [])
  const highlights = useLiveList('admissions.highlights', data.admissions?.highlights ?? [])
  const phone = contactValue(data.contact?.phone?.[0])
  if (fees.length === 0 && highlights.length === 0) return null

  return (
    <Container className="pt-11 lg:pt-12">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        {fees.length > 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="m-0 text-[22px] text-te-ink sm:text-[26px]">Tuition</h2>
            <div>
              {fees.map((fee, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-4 border-b border-te-rule py-3 text-[15px]"
                >
                  <span data-edit={`admissions.feeStructure.${i}.grade`} className="text-te-ink">
                    {fee.grade}
                  </span>
                  <span
                    data-edit={`admissions.feeStructure.${i}.tuition`}
                    className="shrink-0 font-(family-name:--font-te-serif) text-te-ink tabular-nums"
                  >
                    {fee.tuition}
                  </span>
                </div>
              ))}
            </div>
            {fees.some((f) => f.details) && (
              <p className="m-0 text-[14.5px] leading-[1.65] text-te-body">
                {fees.map((fee, i) =>
                  fee.details ? (
                    <span key={i} data-edit={`admissions.feeStructure.${i}.details`} className="block">
                      {fee.details}
                    </span>
                  ) : null,
                )}
              </p>
            )}
            <AddItemButton path="admissions.feeStructure" label="Add fee row" />
          </div>
        )}

        {highlights.length > 0 && (
          <div className="flex flex-col gap-4 border border-te-rule bg-te-panel p-7 lg:p-8">
            <h2 className="m-0 text-[20px] text-te-ink sm:text-[24px]">Before you apply</h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {highlights.map((badge, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon
                    icon={badge.icon || 'lucide:check'}
                    data-edit-icon={`admissions.highlights.${i}.icon`}
                    className="mt-0.5 h-4 w-4 shrink-0 text-te-accent"
                  />
                  <div className="flex flex-col">
                    <span data-edit={`admissions.highlights.${i}.label`} className="text-[15px] text-te-ink">
                      {badge.label}
                    </span>
                    {badge.sublabel && (
                      <span
                        data-edit={`admissions.highlights.${i}.sublabel`}
                        className="text-[13.5px] text-te-muted"
                      >
                        {badge.sublabel}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <StartApplicationLink
              label="Start an application"
              className="mt-1 self-start bg-te-accent px-6 py-3 text-[14px] font-semibold tracking-[0.04em] text-te-paper transition-colors hover:bg-te-accent-ink"
              closedClassName="m-0 mt-1 self-start border border-te-rule px-6 py-3 text-[13px] text-te-muted"
            />
            {phone && (
              <p className="m-0 text-[13px] text-te-muted">
                Or call admissions on <span data-bind="contact.phone.0.value">{phone}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}
