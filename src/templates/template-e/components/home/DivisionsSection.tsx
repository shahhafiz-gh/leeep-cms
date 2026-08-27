'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { gridCols } from '@/shared/utils/grid'
import { Container, Eyebrow, MoreLink } from '../common/Bits'

/**
 * Divisions as plain text columns — no cards, no images. The design leans on
 * the eyebrow and the column gap alone here, which keeps the home page from
 * becoming a run of boxes.
 */
export default function DivisionsSection({ data }: { data: SchoolData }) {
  const programs = useLiveList('programs', data.programs ?? [])
  if (programs.length === 0) return null

  return (
    <Container className="py-12 lg:py-14">
      <Eyebrow className="mb-7" data-edit="programsIntro.title">
        {data.programsIntro?.title || 'One school, every stage'}
      </Eyebrow>
      <div className={`grid gap-9 lg:gap-10 ${gridCols(programs.length, 3)}`}>
        {programs.map((program, i) => (
          <div key={program.id || i} className="flex flex-col gap-3">
            <h3 className="m-0 text-[21px] text-te-ink sm:text-[23px]">
              <span data-edit={`programs.${i}.name`}>{program.name}</span>
              {program.grade_range && (
                <>
                  {' '}
                  <span
                    data-edit={`programs.${i}.grade_range`}
                    className="font-(family-name:--font-te-sans) text-[14px] font-normal text-te-muted"
                  >
                    {program.grade_range}
                  </span>
                </>
              )}
            </h3>
            <p
              data-edit={`programs.${i}.description`}
              className="m-0 text-[14.5px] leading-[1.6] text-te-body"
            >
              {program.description}
            </p>
            <MoreLink href="/academics">{program.name} curriculum</MoreLink>
          </div>
        ))}
      </div>
    </Container>
  )
}
