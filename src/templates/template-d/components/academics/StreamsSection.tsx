'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import Photo from '../common/Photo'
import { Tag } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii']

/**
 * Streams as full-width rows: photo on one side, the stream and its subjects on
 * the other. Rows alternate the photo side so a long list keeps a rhythm instead
 * of reading as a stack of identical bands.
 */
export default function StreamsSection({ data }: { data: SchoolData }) {
  const streams = useLiveList('academics.streams', data.academics?.streams ?? [])
  if (streams.length === 0) return null

  return (
    <section className="mx-auto flex max-w-[1400px] flex-col gap-5 px-5 pb-16 pt-6 md:px-8 lg:px-12 lg:pb-18">
      {streams.map((stream, i) => {
        const photoRight = i % 2 === 1
        return (
          <article
            key={i}
            // `order` alone would move the photo into the WIDE track, inverting
            // the proportions on every other row — so the template alternates too.
            className={`grid grid-cols-1 overflow-hidden rounded-[24px] border border-td-border bg-td-card ${
              photoRight ? 'lg:grid-cols-[1.2fr_0.8fr]' : 'lg:grid-cols-[0.8fr_1.2fr]'
            }`}
          >
            <Photo
              fill
              src={stream.image}
              alt={stream.name}
              caption={`photo — ${stream.name || 'stream'}`}
              rounded="rounded-none"
              editPath={`academics.streams.${i}.image`}
              className={`h-[220px] w-full lg:h-auto lg:min-h-[320px] ${photoRight ? 'lg:order-2' : ''}`}
            />

            <div
              className={`flex flex-col justify-center gap-4 px-7 py-9 lg:px-11 lg:py-10 ${photoRight ? 'lg:order-1' : ''}`}
            >
              <span className="td-serif text-[15px] italic text-td-accent">{ROMAN[i] ?? i + 1}</span>
              <h2
                data-edit={`academics.streams.${i}.name`}
                className="m-0 text-[27px] tracking-[-0.03em] text-td-ink lg:text-[34px]"
              >
                {stream.name}
              </h2>
              <p
                data-edit={`academics.streams.${i}.description`}
                className="m-0 text-[16px] leading-[1.62] text-td-body lg:text-[16.5px]"
              >
                {stream.description}
              </p>
              {(stream.subjects ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {stream.subjects!.map((subject, si) => (
                    <span key={si} data-bind={`academics.streams.${i}.subjects.${si}`}>
                      <Tag>{subject}</Tag>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        )
      })}

      <AddItemButton path="academics.streams" label="Add stream" />
    </section>
  )
}
