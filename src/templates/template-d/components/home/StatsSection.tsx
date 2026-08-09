'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { gridCols } from '@/shared/utils/grid'

/**
 * Sand stat cards — big number, quiet label. Owns the array via `useLiveList`
 * so a reorder in the builder moves each card whole (value AND suffix), rather
 * than shuffling text under fixed slots.
 */
export default function StatsSection({ data }: { data: SchoolData }) {
  const stats = useLiveList('stats', data.stats ?? [])
  if (stats.length === 0) return null

  return (
    <section
      className={`mx-auto grid max-w-[1400px] gap-5 px-5 py-12 md:px-8 lg:px-12 lg:py-14 ${gridCols(stats.length, 4, 2)}`}
    >
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-[18px] bg-td-panel p-7">
          <div className="text-[38px] leading-none font-medium tracking-[-0.04em] text-td-ink tabular-nums lg:text-[46px]">
            <span data-edit={`stats.${i}.value`}>{stat.value}</span>
            <span data-bind={`stats.${i}.suffix`}>{stat.suffix ?? ''}</span>
          </div>
          <div data-edit={`stats.${i}.label`} className="text-[14px] leading-[1.5] text-td-muted">
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  )
}
