'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'
import { gridCols } from '@/shared/utils/grid'

/**
 * Fees on an ink panel — the design's device for the one block on the page that
 * must be read carefully. Each grade is a card: grade label, headline figure,
 * then the total and any note beneath it.
 */
export default function FeesSection({ data }: { data: SchoolData }) {
  const fees = useLiveList('admissions.feeStructure', data.admissions?.feeStructure ?? [])
  if (fees.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-18">
      <div className="rounded-[28px] bg-td-ink px-7 py-12 md:px-12 lg:px-16 lg:py-15">
        <h2 className="m-0 mb-3.5 text-[32px] text-td-on-ink sm:text-[38px] lg:text-[42px]">
          Fees and support
        </h2>
        <p className="m-0 mb-9 max-w-[60ch] text-[16px] leading-[1.6] text-td-on-ink-muted lg:text-[17px]">
          Figures below are per academic year. Applying for financial support has no bearing on an
          admissions decision — ask the office for the current schedule.
        </p>

        <div className={`grid gap-5 ${gridCols(fees.length, 3)}`}>
          {fees.map((fee, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-[18px] bg-td-ink-soft p-7">
              <div
                data-edit={`admissions.feeStructure.${i}.grade`}
                className="text-[13px] uppercase tracking-[0.1em] text-td-on-ink-faint"
              >
                {fee.grade}
              </div>
              <div
                data-edit={`admissions.feeStructure.${i}.tuition`}
                className="text-[30px] font-medium tracking-[-0.035em] text-td-on-ink tabular-nums lg:text-[38px]"
              >
                {fee.tuition}
              </div>
              <div className="text-[14px] leading-[1.5] text-td-on-ink-muted">
                Total <span data-edit={`admissions.feeStructure.${i}.total`}>{fee.total}</span>
              </div>
              {fee.details && (
                <div
                  data-edit={`admissions.feeStructure.${i}.details`}
                  className="text-[14px] leading-[1.5] text-td-on-ink-faint"
                >
                  {fee.details}
                </div>
              )}
            </div>
          ))}
        </div>

        <AddItemButton path="admissions.feeStructure" label="Add fee row" />
      </div>
    </section>
  )
}
