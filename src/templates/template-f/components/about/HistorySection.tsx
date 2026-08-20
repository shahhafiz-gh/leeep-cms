'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'
import { gridCols } from '@/shared/utils/grid'

/**
 * Ink panel of dated milestones — a school's history in four beats. Built from
 * `about.achievements`, whose `year` is the rail and whose title/description
 * carry the entry.
 */
export default function HistorySection({ data }: { data: SchoolData }) {
  const milestones = useLiveList('about.achievements', data.about?.achievements ?? [])
  if (milestones.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-18">
      <div className="rounded-[28px] bg-tf-ink px-7 py-12 md:px-12 lg:p-16">
        <h2
          data-edit="about.achievementsTitle"
          className="m-0 mb-10 text-[32px] text-tf-on-ink sm:text-[38px] lg:text-[42px]"
        >
          {data.about?.achievementsTitle || 'A short history'}
        </h2>

        <div className={`grid gap-8 ${gridCols(milestones.length, 4)}`}>
          {milestones.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 border-t border-tf-ink-border pt-5">
              {item.year && (
                <div
                  data-edit={`about.achievements.${i}.year`}
                  className="text-[26px] font-medium tracking-[-0.03em] text-tf-accent-soft lg:text-[30px]"
                >
                  {item.year}
                </div>
              )}
              <div data-edit={`about.achievements.${i}.title`} className="text-[16px] font-medium text-tf-on-ink">
                {item.title}
              </div>
              <div
                data-edit={`about.achievements.${i}.description`}
                className="text-[15px] leading-[1.6] text-tf-on-ink-muted"
              >
                {item.description}
              </div>
            </div>
          ))}
        </div>

        <AddItemButton path="about.achievements" label="Add milestone" />
      </div>
    </section>
  )
}
