import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'
import { longDate } from '@/shared/utils/format'
import MarkdownContent from '@/shared/MarkdownContent'

/**
 * A single announcement or event, read as an article: narrow measure, serif
 * standfirst, then the body. One id can name either kind of record, so both are
 * looked up and the found one wins.
 */
export default function UpdateDetail({ data, id }: { data: SchoolData; id: string }) {
  const announcement = data.updates?.announcements?.find((a) => a.id === id)
  const event = data.updates?.events?.find((e) => e.id === id)

  if (!announcement && !event) {
    return (
      <section className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-24 text-center md:px-8 lg:px-12">
        <Icon icon="lucide:file-question" className="mb-5 h-10 w-10 text-td-accent" />
        <h1 className="m-0 mb-3 text-[32px] text-td-ink">We couldn&apos;t find that update.</h1>
        <p className="m-0 mb-8 max-w-[46ch] text-[16px] leading-[1.6] text-td-body">
          It may have been removed, or the link may be out of date.
        </p>
        <Link
          href="/updates"
          className="rounded-full bg-td-ink px-7 py-3.5 text-[15px] font-semibold text-td-on-ink"
        >
          Back to news
        </Link>
      </section>
    )
  }

  const title = announcement?.title ?? event!.title
  const posted = longDate(announcement?.published_date ?? event?.date)
  const summary = announcement?.short_description ?? event?.description ?? ''
  const image = announcement?.thumbnail ?? event?.image
  const body = announcement?.content ?? event?.content

  return (
    <article className="mx-auto max-w-[1400px] px-5 pb-20 pt-12 md:px-8 lg:px-12 lg:pt-16">
      <Link
        href="/updates"
        className="mb-8 inline-flex items-center gap-2 text-[14.5px] font-semibold text-td-accent"
      >
        <Icon icon="lucide:arrow-left" className="h-4 w-4" /> Back to news
      </Link>

      <header className="max-w-[900px] border-b border-td-border pb-8">
        <h1 className="m-0 mb-5 text-[34px] leading-[1.05] tracking-[-0.04em] text-td-ink sm:text-[46px] lg:text-[58px]">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-td-muted">
          {posted && (
            <span className="inline-flex items-center gap-2">
              <Icon icon="lucide:calendar-days" className="h-4 w-4 text-td-accent" />
              {posted}
            </span>
          )}
          {event?.location && (
            <span className="inline-flex items-center gap-2">
              <Icon icon="lucide:map-pin" className="h-4 w-4 text-td-accent" />
              {event.location}
            </span>
          )}
          {announcement?.category && (
            <span className="inline-flex items-center gap-2">
              <Icon icon="lucide:tag" className="h-4 w-4 text-td-accent" />
              {announcement.category}
            </span>
          )}
        </div>
      </header>

      {image && (
        <Photo src={image} alt={title} className="mt-10 h-[280px] w-full lg:h-[440px]" />
      )}

      <div className="mt-10 max-w-[70ch]">
        {summary && (
          <p className="td-serif m-0 mb-8 text-[21px] leading-[1.45] text-td-ink lg:text-[24px]">
            {summary}
          </p>
        )}
        {body ? (
          <MarkdownContent
            source={body}
            className="website-rich-content text-[16.5px] leading-[1.7] text-td-body [&_a]:text-td-accent [&_h2]:text-[26px] [&_h2]:text-td-ink [&_h3]:text-[21px] [&_h3]:text-td-ink"
          />
        ) : (
          !summary && (
            <p className="m-0 text-[16px] leading-[1.6] text-td-muted">
              No further details have been published for this {event ? 'event' : 'announcement'}.
            </p>
          )
        )}
      </div>
    </article>
  )
}
