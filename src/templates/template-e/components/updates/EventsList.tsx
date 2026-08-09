import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import { Container } from '../common/Bits'
import { dateParts, longDate } from '@/shared/utils/format'

/**
 * The calendar register — the design's month grid reduced to the shape the CMS
 * actually holds (a flat event list), so nothing has to be invented to fill it.
 */
export default function EventsList({ data }: { data: SchoolData }) {
  const events = data.updates?.events ?? []
  if (events.length === 0) return null

  return (
    <Container className="pt-12 pb-14 lg:pt-14 lg:pb-16">
      <h2 className="m-0 mb-6 text-[22px] text-te-ink sm:text-[26px]">Calendar</h2>
      <div className="flex flex-col border-t-2 border-te-ink">
        {events.map((event) => {
          const parts = dateParts(event.date)
          return (
            <Link
              key={event.id}
              href={`/updates/${event.id}`}
              className="group grid grid-cols-1 items-baseline gap-2 border-b border-te-rule py-5 sm:grid-cols-[110px_1fr] sm:gap-6"
            >
              <div className="flex items-baseline gap-2 font-(family-name:--font-te-serif) text-[15px] text-te-accent">
                <span className="tabular-nums">{parts?.day ?? '—'}</span>
                <span className="text-[12px] uppercase tracking-[0.12em] text-te-muted">
                  {parts?.month ?? ''}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[16px] text-te-ink group-hover:underline">{event.title}</span>
                {event.description && (
                  <span className="text-[14px] leading-[1.6] text-te-body">{event.description}</span>
                )}
                <span className="text-[13px] text-te-muted">
                  {longDate(event.date)}
                  {event.location ? ` · ${event.location}` : ''}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </Container>
  )
}
