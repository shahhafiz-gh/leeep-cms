'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { gridCols } from '@/shared/utils/grid'
import { Container } from '../common/Bits'

/**
 * The rules-and-figures band. Numbers are set in the serif at a size no other
 * element uses, which is what makes this read as a fact strip rather than as
 * four more cards.
 */
export default function StatsBand({ data }: { data: SchoolData }) {
  const stats = useLiveList('stats', data.stats ?? [])
  if (stats.length === 0) return null

  return (
    <div className="border-y border-te-rule bg-te-panel">
      <Container>
        <div className={`grid gap-6 py-7 ${gridCols(stats.length, 4, 2)}`}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="font-(family-name:--font-te-serif) text-[26px] text-te-ink tabular-nums sm:text-[30px]">
                <span data-edit={`stats.${i}.value`}>{stat.value}</span>
                <span data-bind={`stats.${i}.suffix`}>{stat.suffix ?? ''}</span>
              </div>
              <div data-edit={`stats.${i}.label`} className="text-[13px] leading-snug text-te-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
