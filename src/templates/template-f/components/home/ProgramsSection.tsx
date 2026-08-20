'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import Photo from '../common/Photo'
import { Pill, SectionHead } from '../common/Bits'
import { gridCols } from '@/shared/utils/grid'

/**
 * The school's divisions/programmes as tall cards: photo, grade-range pill,
 * name, blurb. Lives on the home page as the bridge into Academics.
 */
export default function ProgramsSection({ data }: { data: SchoolData }) {
  const programs = useLiveList('programs', data.programs ?? [])
  if (programs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 md:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <SectionHead title="One school, every stage" href="/academics" linkLabel="All academics" />

      <div className={`grid gap-5 ${gridCols(programs.length, 3)}`}>
        {programs.map((program, i) => (
          <article
            key={program.id || i}
            className="flex flex-col overflow-hidden rounded-[20px] border border-tf-border bg-tf-card"
          >
            <Photo
              src={program.image}
              alt={program.name}
              caption={`photo — ${program.name || 'programme'}`}
              editPath={`programs.${i}.image`}
              rounded="rounded-none"
              className="h-[210px] w-full"
            />
            <div className="flex flex-col gap-3 px-6 pb-7 pt-6">
              {program.grade_range && (
                <Pill>
                  <span data-edit={`programs.${i}.grade_range`}>{program.grade_range}</span>
                </Pill>
              )}
              <h3 data-edit={`programs.${i}.name`} className="m-0 text-[24px] tracking-[-0.025em] text-tf-ink lg:text-[26px]">
                {program.name}
              </h3>
              <p data-edit={`programs.${i}.description`} className="m-0 text-[15.5px] leading-[1.6] text-tf-body">
                {program.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
