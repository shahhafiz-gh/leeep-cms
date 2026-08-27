import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import MarkdownContent from '@/shared/MarkdownContent'

function formatDate(dateString?: string) {
  if (!dateString) return ''
  try {
    const d = new Date(dateString)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  } catch { }
  return dateString
}

export default function UpdateDetail({ data, id }: { data: SchoolData; id: string }) {
  const announcement = data.updates.announcements.find((a) => a.id === id)
  const event = data.updates.events.find((e) => e.id === id)

  if (!announcement && !event) {
    return (
      <main className="bg-ta-surface min-h-screen pt-32 md:pt-40 flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 text-center py-20">
          <div className="flex flex-col items-center max-w-md mx-auto bg-ta-surface-container-lowest p-10 rounded-[40px] border border-ta-outline-variant/30 shadow-sm">
            <div className="w-20 h-20 bg-ta-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon icon="lucide:file-question" className="text-4xl text-ta-primary" />
            </div>
            <h2 className="font-(family-name:--font-ta-h2) text-2xl font-bold text-ta-on-surface mb-4">Announcement Not Found</h2>
            <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant mb-8">
              The announcement you are looking for might have been removed, or the link is temporarily unavailable.
            </p>
            <Link href="/updates" className="inline-flex items-center gap-2 bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full px-6 py-3 hover:scale-105 transition-transform">
              <Icon icon="lucide:arrow-left" /> Go Back
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const title = announcement?.title ?? event!.title
  const author = announcement?.author ?? 'School Administration'
  const postedDate = formatDate(announcement?.published_date ?? event?.date)
  const summary = announcement?.short_description ?? event?.description ?? ''
  const image = announcement?.thumbnail ?? event?.image
  const content = announcement?.content ?? event?.content

  return (
    <main className="bg-ta-surface min-h-screen pt-32 md:pt-40">
      {/* Header */}
      <section className="pb-3 px-2 md:px-6">
        <div className="container mx-auto">
          <Link
            href="/updates"
            className="flex w-fit items-center gap-2 text-ta-primary font-bold hover:gap-3 transition-all mb-8 group"
          >
            <Icon icon="lucide:arrow-left" className="group-hover:-translate-x-1 transition-transform" />
            Back to Announcements
          </Link>

          <h1 className="font-(family-name:--font-ta-h1) text-3xl md:text-5xl text-ta-on-surface mb-8 max-w-4xl leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-ta-label-md font-bold text-ta-on-surface-variant pb-8 border-b border-ta-outline-variant/30">
            {postedDate && (
              <div className="flex items-center gap-2">
                <Icon icon="lucide:calendar-days" className="text-ta-primary text-lg" />
                <span>Posted {postedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Icon icon="lucide:user" className="text-ta-primary text-lg" />
              <span>{author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-16 px-2 md:px-3 mx-auto">
        <div className="container mx-auto">
          <article className="bg-ta-surface-container-lowest rounded-[40px] p-6 md:p-12 border border-ta-outline-variant/30 shadow-sm">
            {summary && (
              <div className="mb-10 text-xl font-medium text-ta-on-surface-variant leading-relaxed">
                {summary}
              </div>
            )}

            {image && (
              <div className="mb-10 rounded-3xl overflow-hidden">
                <img loading="lazy" decoding="async" src={image} alt={title} className="w-full max-h-[480px] object-cover" />
              </div>
            )}

            <div className="text-ta-on-surface-variant font-(family-name:--font-ta-body-lg) leading-relaxed">
              {content ? (
                <MarkdownContent source={content} className="website-rich-content" />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-ta-surface-container-low/50 rounded-2xl border-2 border-ta-outline-variant/30 border-dashed">
                  <Icon icon="lucide:file-text" className="text-4xl text-ta-on-surface-variant/40 mb-3" />
                  <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant text-center">
                    No further details available for this {event ? 'event' : 'announcement'}.
                  </p>
                </div>
              )}
            </div>

            {event && (event.location || event.date) && (
              <div className="mt-10 flex flex-wrap gap-6 p-5 bg-ta-surface-container-low rounded-2xl border border-ta-outline-variant/30">
                {event.location && (
                  <div className="flex items-center gap-2 text-ta-on-surface-variant text-sm">
                    <Icon icon="lucide:map-pin" className="text-ta-primary" /> {event.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-ta-on-surface-variant text-sm">
                  <Icon icon="lucide:calendar-days" className="text-ta-primary" /> {formatDate(event.date)}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  )
}
