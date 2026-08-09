'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { gridCols } from '@/shared/utils/grid'
import { Container } from '../common/Bits'

/**
 * The admissions process as one bordered block divided by internal hairlines —
 * a single table, not four cards.
 *
 * Getting that from CSS means the dividing rule has to change edge with the
 * layout: cells sit in a column on a phone (rule underneath, none on the last)
 * and in a row on wide screens (rule to the right, none on the last). Doing it
 * with a ring on the container instead would double the rule at every seam.
 */
export default function ProcessGrid({ data }: { data: SchoolData }) {
  const steps = useLiveList('admissions.process.steps', data.admissions?.process?.steps ?? [])
  if (steps.length === 0) return null

  return (
    <Container className="pt-11 lg:pt-12">
      <div className={`grid border border-te-rule ${gridCols(steps.length, 4)}`}>
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex flex-col gap-2 p-6 ${
              i < steps.length - 1 ? 'border-b border-te-rule lg:border-b-0 lg:border-r' : ''
            }`}
          >
            <div className="font-(family-name:--font-te-serif) text-[15px] font-semibold text-te-accent">
              {step.step ?? i + 1} ·{' '}
              <span data-edit={`admissions.process.steps.${i}.title`}>{step.title}</span>
            </div>
            <div
              data-edit={`admissions.process.steps.${i}.description`}
              className="text-[14px] leading-[1.55] text-te-body"
            >
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
