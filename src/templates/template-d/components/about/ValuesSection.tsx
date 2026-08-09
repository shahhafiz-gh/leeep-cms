'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { gridCols } from '@/shared/utils/grid'

/** Lowercase roman numerals — the design's quiet way of numbering principles. */
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']

/**
 * The school's principles as sand cards, each numbered in serif italic. Fed by
 * `about.whyChooseUs`, which is the list a school already fills in for "why
 * choose us" — presented here as a statement of values rather than a sales list.
 */
export default function ValuesSection({ data }: { data: SchoolData }) {
  const values = useLiveList('about.whyChooseUs', data.about?.whyChooseUs ?? [])
  if (values.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 md:px-8 lg:px-12 lg:pb-18">
      <div className={`grid gap-5 ${gridCols(values.length, 3)}`}>
        {values.map((value, i) => (
          <div key={i} className="flex flex-col gap-3.5 rounded-[20px] bg-td-panel p-8 lg:p-[34px]">
            <span className="td-serif text-[15px] italic text-td-accent">{ROMAN[i] ?? i + 1}</span>
            <h3
              data-edit={`about.whyChooseUs.${i}.title`}
              className="m-0 text-[24px] leading-[1.15] tracking-[-0.025em] text-td-ink lg:text-[27px]"
            >
              {value.title}
            </h3>
            <p
              data-edit={`about.whyChooseUs.${i}.description`}
              className="m-0 text-[15.5px] leading-[1.62] text-td-body"
            >
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
