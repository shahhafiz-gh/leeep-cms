'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import Photo from '../common/Photo'
import { Container } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'

/**
 * The academics register: one ruled row per stream, laid out as
 * [title | prose | photograph] on wide screens.
 *
 * The first row carries the heavy 2px rule and the rest a hairline, which is
 * how the design opens a list without needing a separate heading. On narrow
 * screens the three columns stack in reading order — title, prose, picture.
 */
export default function StreamRows({ data }: { data: SchoolData }) {
  const streams = useLiveList('academics.streams', data.academics?.streams ?? [])
  if (streams.length === 0) return null

  return (
    <Container className="flex flex-col gap-10 pt-12 lg:gap-12 lg:pt-14">
      {streams.map((stream, i) => (
        <div
          key={i}
          className={`grid grid-cols-1 items-start gap-6 pt-8 lg:grid-cols-[220px_1fr_320px] lg:gap-11 ${
            i === 0 ? 'border-t-2 border-te-ink' : 'border-t border-te-rule'
          }`}
        >
          <h2 data-edit={`academics.streams.${i}.name`} className="m-0 text-[21px] text-te-ink sm:text-[24px]">
            {stream.name}
          </h2>

          <div className="flex flex-col gap-3.5">
            <p
              data-edit={`academics.streams.${i}.description`}
              className="m-0 text-[15px] leading-[1.65] text-te-body"
            >
              {stream.description}
            </p>
            {(stream.subjects ?? []).length > 0 && (
              <p className="m-0 text-[14px] leading-[1.65] text-te-muted">
                <span className="text-te-ink">Subjects: </span>
                {stream.subjects!.map((subject, si) => (
                  <span key={si}>
                    <span data-bind={`academics.streams.${i}.subjects.${si}`}>{subject}</span>
                    {si < stream.subjects!.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </p>
            )}
          </div>

          <Photo
            src={stream.image}
            alt={stream.name}
            caption={`photo: ${stream.name || 'a class in session'}`}
            editPath={`academics.streams.${i}.image`}
            className="h-[200px] w-full lg:h-[220px]"
          />
        </div>
      ))}

      <AddItemButton path="academics.streams" label="Add stream" />
    </Container>
  )
}
