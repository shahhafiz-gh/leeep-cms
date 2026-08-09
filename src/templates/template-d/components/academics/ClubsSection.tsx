'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import Photo from '../common/Photo'
import { SectionHead } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'
import { gridCols } from '@/shared/utils/grid'

/**
 * Clubs and activities — the part of school that happens after the bell. Sand
 * cards with a photo band, so the section sits between the outlined stats above
 * and the footer without competing with either.
 */
export default function ClubsSection({ data }: { data: SchoolData }) {
  const clubs = useLiveList('academics.clubs', data.academics?.clubs ?? [])
  if (clubs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-8 lg:px-12 lg:pb-22">
      <SectionHead
        title={data.academics?.clubsTitle || 'Beyond the timetable'}
        editPath="academics.clubsTitle"
      />

      <div className={`grid gap-5 ${gridCols(clubs.length, 4)}`}>
        {clubs.map((club, i) => (
          <article key={i} className="flex flex-col overflow-hidden rounded-[20px] bg-td-panel">
            <Photo
              src={club.image}
              alt={club.name}
              caption={`photo — ${club.name || 'club'}`}
              rounded="rounded-none"
              editPath={`academics.clubs.${i}.image`}
              className="h-[170px] w-full"
            />
            <div className="flex flex-col gap-2.5 p-6">
              <h3
                data-edit={`academics.clubs.${i}.name`}
                className="m-0 text-[20px] tracking-[-0.025em] text-td-ink"
              >
                {club.name}
              </h3>
              <p
                data-edit={`academics.clubs.${i}.description`}
                className="m-0 text-[15px] leading-[1.6] text-td-body"
              >
                {club.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <AddItemButton path="academics.clubs" label="Add club" />
    </section>
  )
}
