'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { gridCols } from '@/shared/utils/grid'

/**
 * "Getting here" — landmarks as a chip row above transport options as ruled
 * columns. Both lists are optional; the section disappears entirely when a
 * school has filled in neither.
 */
export default function GettingHereSection({ data }: { data: SchoolData }) {
  const landmarks = useLiveList('contact.landmarks', data.contact?.landmarks ?? [])
  const transport = useLiveList('contact.transport', data.contact?.transport ?? [])
  if (landmarks.length === 0 && transport.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-8 lg:px-12">
      <div className="rounded-[28px] bg-tf-panel px-7 py-12 md:px-12 lg:px-16 lg:py-15">
        <h2 className="m-0 mb-8 text-[30px] text-tf-ink sm:text-[36px] lg:text-[40px]">Getting here</h2>

        {landmarks.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2.5">
            {landmarks.map((landmark, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full bg-tf-paper px-4 py-2.5 text-[14px] text-tf-body"
              >
                <Icon
                  icon={landmark.icon || 'lucide:map-pin'}
                  data-edit-icon={`contact.landmarks.${i}.icon`}
                  className="h-4 w-4 text-tf-accent"
                />
                <span data-edit={`contact.landmarks.${i}.label`}>{landmark.label}</span>
              </span>
            ))}
          </div>
        )}

        {transport.length > 0 && (
          <div className={`grid gap-8 ${gridCols(transport.length, 3)}`}>
            {transport.map((option, i) => (
              <div key={i} className="flex flex-col gap-2.5 border-t border-tf-border-strong pt-5">
                <div
                  data-edit={`contact.transport.${i}.type`}
                  className="text-[18px] font-medium tracking-[-0.02em] text-tf-ink"
                >
                  {option.type}
                </div>
                <div
                  data-edit={`contact.transport.${i}.detail`}
                  className="text-[15px] leading-[1.6] text-tf-body"
                >
                  {option.detail}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
