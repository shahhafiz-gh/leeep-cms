import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import { Container, MoreLink } from '../common/Bits'
import { longDate, shortDate } from '@/shared/utils/format'

/**
 * Two ruled columns closing the home page: what is coming up, and what just
 * happened. Both are backend-owned records (Events / Announcements), so nothing
 * here is inline editable — the admin maintains them where they live.
 */
export default function DispatchSection({ data }: { data: SchoolData }) {
  const events = (data.updates?.events ?? []).slice(0, 3)
  const news = (data.updates?.announcements ?? []).slice(0, 2)
  if (events.length === 0 && news.length === 0) return null

  return (
    <Container className="pb-14 lg:pb-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        {events.length > 0 && (
          <div className="flex flex-col gap-4 border-t-2 border-te-ink pt-5">
            <h2 className="m-0 font-(family-name:--font-te-serif) text-[15px] font-semibold uppercase tracking-[0.16em] text-te-ink">
              Coming up
            </h2>
            {events.map((event) => (
              <Link key={event.id} href={`/updates/${event.id}`} className="flex items-baseline gap-4 group">
                <span className="min-w-[64px] shrink-0 font-(family-name:--font-te-serif) text-[15px] text-te-accent">
                  {shortDate(event.date)}
                </span>
                <span className="text-[14.5px] text-te-ink group-hover:underline">{event.title}</span>
              </Link>
            ))}
            <MoreLink href="/updates">Full calendar</MoreLink>
          </div>
        )}

        {news.length > 0 && (
          <div className="flex flex-col gap-4 border-t-2 border-te-ink pt-5">
            <h2 className="m-0 font-(family-name:--font-te-serif) text-[15px] font-semibold uppercase tracking-[0.16em] text-te-ink">
              From the news
            </h2>
            {news.map((item) => (
              <Link key={item.id} href={`/updates/${item.id}`} className="group block">
                <div className="font-(family-name:--font-te-serif) text-[17px] leading-[1.4] text-te-ink group-hover:underline">
                  {item.title}
                </div>
                <div className="mt-1 text-[13px] text-te-muted">{longDate(item.published_date)}</div>
              </Link>
            ))}
            <MoreLink href="/updates">All news</MoreLink>
          </div>
        )}
      </div>
    </Container>
  )
}
