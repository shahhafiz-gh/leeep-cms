import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'
import { Action, Container } from '../common/Bits'
import { longDate } from '@/shared/utils/format'

/**
 * A single announcement or event, set as an article on a narrow measure. One id
 * can name either kind of record, so both are looked up and the found one wins.
 */
export default function UpdateDetail({ data, id }: { data: SchoolData; id: string }) {
  const announcement = data.updates?.announcements?.find((a) => a.id === id)
  const event = data.updates?.events?.find((e) => e.id === id)

  if (!announcement && !event) {
    return (
      <Container className="flex flex-col items-start gap-5 py-20">
        <h1 className="m-0 text-[28px] text-te-ink sm:text-[34px]">We couldn&apos;t find that item.</h1>
        <p className="m-0 max-w-[46ch] text-[16px] leading-[1.7] text-te-body">
          It may have been removed, or the link may be out of date.
        </p>
        <Action href="/updates" variant="ghost">Back to news</Action>
      </Container>
    )
  }

  const title = announcement?.title ?? event!.title
  const posted = longDate(announcement?.published_date ?? event?.date)
  const summary = announcement?.short_description ?? event?.description ?? ''
  const image = announcement?.thumbnail ?? event?.image
  const body = announcement?.content ?? event?.content

  return (
    <Container className="py-10 lg:py-14">
      <Link href="/updates" className="text-[13.5px] font-semibold text-te-accent hover:underline">
        ← Back to news
      </Link>

      <article className="mt-7 max-w-[760px]">
        <header className="border-b border-te-rule pb-6">
          <h1 className="m-0 text-[30px] leading-[1.25] text-te-ink sm:text-[36px] lg:text-[40px]">{title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-te-muted">
            {posted && <span>{posted}</span>}
            {announcement?.category && <span>· {announcement.category}</span>}
            {event?.location && <span>· {event.location}</span>}
          </div>
        </header>

        {image && (
          <Photo src={image} alt={title} className="mt-8 h-[240px] w-full sm:h-[340px] lg:h-[420px]" />
        )}

        {summary && (
          <p className="m-0 mt-8 font-(family-name:--font-te-serif) text-[19px] leading-[1.55] text-te-ink sm:text-[21px]">
            {summary}
          </p>
        )}

        {body ? (
          <div
            className="website-rich-content mt-6 text-[16px] leading-[1.75] text-te-body [&_a]:text-te-accent [&_h2]:font-(family-name:--font-te-serif) [&_h2]:text-[24px] [&_h2]:text-te-ink [&_h3]:font-(family-name:--font-te-serif) [&_h3]:text-[20px] [&_h3]:text-te-ink"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          !summary && (
            <p className="m-0 mt-6 text-[15px] leading-[1.7] text-te-muted">
              No further details have been published for this {event ? 'event' : 'announcement'}.
            </p>
          )
        )}
      </article>
    </Container>
  )
}
