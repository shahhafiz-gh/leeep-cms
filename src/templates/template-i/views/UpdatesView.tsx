'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import MarkdownContent from '@/shared/MarkdownContent'
import { dateParts, longDate } from '@/shared/utils/format'
import PageShell from '../components/PageShell'
import { PROSE } from '../components/blocks/PageBlocks'

/**
 * Notifications & events — the old site's notice board. The list and each
 * notice sit in the same banner-and-sidebar shell as every other inner page.
 */
export default function UpdatesView({ data }: { data: SchoolData; editing?: boolean }) {
  const id = useParams<{ id?: string }>()?.id
  return id ? <UpdateDetail data={data} id={decodeURIComponent(id)} /> : <UpdatesList data={data} />
}

function UpdatesList({ data }: { data: SchoolData }) {
  const announcements = data.updates?.announcements ?? []
  const events = data.updates?.events ?? []
  const hero = data.updatesHero

  return (
    <PageShell
      data={data}
      title={hero?.title || 'Notifications & Events'}
      summary={hero?.description}
      titlePath="updatesHero.title"
      summaryPath="updatesHero.description"
    >
      <div className="space-y-12">
        <section>
          <h2 className="border-l-4 border-ts-accent pl-3 text-2xl font-bold text-ts-heading">Notifications</h2>
          {announcements.length ? (
            <ul className="mt-6 space-y-4">
              {announcements.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/updates/${item.id}`}
                    className="group flex gap-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-ts-line transition hover:ring-ts-primary"
                  >
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt=""
                        loading="lazy"
                        className="hidden h-24 w-32 shrink-0 rounded-lg object-cover sm:block"
                      />
                    )}
                    <div className="min-w-0">
                      {item.published_date && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-ts-muted">
                          {longDate(item.published_date)}
                        </span>
                      )}
                      <h3 className="mt-1 text-lg font-bold leading-snug text-ts-primary-700 group-hover:underline">
                        {item.title}
                      </h3>
                      {item.short_description && item.short_description !== item.title && (
                        <p className="mt-1.5 line-clamp-2 text-[15px] text-ts-body">{item.short_description}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-ts-muted">No notifications right now.</p>
          )}
        </section>

        {events.length > 0 && (
          <section>
            <h2 className="border-l-4 border-ts-accent pl-3 text-2xl font-bold text-ts-heading">Events</h2>
            <ul className="mt-6 space-y-4">
              {events.map((event) => {
                const parts = dateParts(event.date)
                return (
                  <li key={event.id}>
                    <Link
                      href={`/updates/${event.id}`}
                      className="group flex gap-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-ts-line transition hover:ring-ts-primary"
                    >
                      {parts && (
                        <span className="grid h-16 w-16 shrink-0 place-content-center rounded-lg bg-ts-primary text-center text-white">
                          <span className="text-2xl font-bold leading-none">{parts.day}</span>
                          <span className="mt-1 text-xs font-semibold uppercase">{parts.month}</span>
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-snug text-ts-primary-700 group-hover:underline">
                          {event.title}
                        </h3>
                        {event.location && (
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-ts-muted">
                            <Icon icon="lucide:map-pin" className="h-3.5 w-3.5" />
                            {event.location}
                          </p>
                        )}
                        {event.description && event.description !== event.title && (
                          <p className="mt-1.5 line-clamp-2 text-[15px] text-ts-body">{event.description}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>
    </PageShell>
  )
}

function UpdateDetail({ data, id }: { data: SchoolData; id: string }) {
  const announcement = data.updates?.announcements?.find((a) => a.id === id)
  const event = announcement ? undefined : data.updates?.events?.find((e) => e.id === id)
  const item = announcement ?? event

  if (!item) {
    return (
      <PageShell data={data} title="Notice not found" wide>
        <Link href="/updates" className="font-bold text-ts-primary hover:underline">
          ← All notifications
        </Link>
      </PageShell>
    )
  }

  const date = announcement ? announcement.published_date : event!.date
  const image = announcement ? announcement.thumbnail : event!.image
  const body = item.content || (announcement ? announcement.short_description : event!.description) || ''
  // An event's body already carries its photo (the seed appends it); don't show it twice.
  const showImage = image && !body.includes(image)

  return (
    <PageShell data={data} title={item.title}>
      <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ts-line sm:p-8">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ts-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ts-primary-50 px-3 py-1 font-semibold text-ts-primary-700">
            <Icon icon={event ? 'lucide:calendar' : 'lucide:bell-ring'} className="h-3.5 w-3.5" />
            {event ? 'Event' : 'Notification'}
          </span>
          {date && <span>{longDate(date)}</span>}
          {event?.location && <span>{event.location}</span>}
        </p>
        {showImage && <img src={image} alt="" className="mt-6 w-full rounded-lg" />}
        {body && <MarkdownContent source={body} className={`${PROSE} mt-6`} />}
      </article>
      <Link href="/updates" className="mt-6 inline-flex items-center gap-1 font-bold text-ts-primary hover:underline">
        <Icon icon="lucide:arrow-left" className="h-4 w-4" /> All notifications
      </Link>
    </PageShell>
  )
}
