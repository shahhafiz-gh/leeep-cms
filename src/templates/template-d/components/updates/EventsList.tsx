import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { dateParts, longDate } from '../../lib/format'

/**
 * Upcoming events as ruled rows with a date rail — the calendar page of the
 * source design reduced to the shape the CMS actually holds (a flat event list,
 * not a month grid), so nothing here has to be faked.
 */
export default function EventsList({ data }: { data: SchoolData }) {
  const events = data.updates?.events ?? []
  if (events.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-8 lg:px-12 lg:pb-22">
      <div className="rounded-[28px] bg-td-panel px-7 py-12 md:px-12 lg:px-16 lg:py-15">
        <h2 className="m-0 mb-8 text-[30px] text-td-ink sm:text-[36px] lg:text-[40px]">On the calendar</h2>

        <div className="flex flex-col border-t border-td-border-strong">
          {events.map((event) => {
            const parts = dateParts(event.date)
            return (
              <Link
                key={event.id}
                href={`/updates/${event.id}`}
                className="group grid grid-cols-1 gap-3 border-b border-td-border-strong py-6 sm:grid-cols-[92px_1fr] sm:gap-6"
              >
                <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0.5">
                  <span className="text-[26px] leading-none font-medium tracking-[-0.03em] text-td-accent tabular-nums">
                    {parts?.day ?? '—'}
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.14em] text-td-muted">
                    {parts?.month ?? ''}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[19px] font-medium tracking-[-0.02em] text-td-ink transition-colors group-hover:text-td-accent">
                    {event.title}
                  </span>
                  {event.description && (
                    <span className="text-[15px] leading-[1.6] text-td-body">{event.description}</span>
                  )}
                  <span className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13.5px] text-td-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon icon="lucide:calendar-days" className="h-3.5 w-3.5 text-td-accent" />
                      {longDate(event.date)}
                    </span>
                    {event.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon icon="lucide:map-pin" className="h-3.5 w-3.5 text-td-accent" />
                        {event.location}
                      </span>
                    )}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
