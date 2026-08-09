'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { Container, RuledRow } from '../common/Bits'

/**
 * "At a glance" — the school's figures as a ruled two-column register, the
 * design's most characteristic block.
 *
 * It reads the same `stats` list the home band uses, so a school maintains one
 * set of numbers and both places stay true. The heading sits in its own narrow
 * column on wide screens and above the list on narrow ones.
 */
export default function GlanceSection({ data }: { data: SchoolData }) {
  const stats = useLiveList('stats', data.stats ?? [])
  if (stats.length === 0) return null

  return (
    <Container className="pt-12 lg:pt-14">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr] lg:gap-14">
        <h2 className="m-0 text-[22px] text-te-ink sm:text-[26px]">The school at a glance</h2>
        <div className="grid grid-cols-1 gap-x-10 border-t border-te-rule sm:grid-cols-2">
          {stats.map((stat, i) => (
            <RuledRow
              key={i}
              label={stat.label}
              labelPath={`stats.${i}.label`}
              value={
                <>
                  <span data-bind={`stats.${i}.value`}>{stat.value}</span>
                  <span data-bind={`stats.${i}.suffix`}>{stat.suffix ?? ''}</span>
                </>
              }
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
