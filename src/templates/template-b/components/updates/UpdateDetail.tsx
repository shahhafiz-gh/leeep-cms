import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

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
      <div className="py-20 md:py-28 text-center pt-36 md:pt-44">
        <h1 className="text-2xl font-bold text-tb-heading">Announcement not found</h1>
        <Link href="/updates" className="text-tb-primary-400 mt-4 inline-block font-bold">← Back to updates</Link>
      </div>
    )
  }

  const isEvent = !announcement && !!event
  const title = announcement?.title ?? event!.title
  const author = announcement?.author ?? 'Administration Office'
  const date = formatDate(announcement?.published_date ?? event?.date)
  const category = announcement?.category ?? (isEvent ? 'Event' : 'Announcement')
  const image = announcement?.thumbnail ?? event?.image
  const htmlContent = announcement?.content ?? event?.content
  const summary = announcement?.short_description ?? event?.description ?? ''

  return (
    <>
      {/* Hero banner */}
      <div className="bg-tb-primary-50/50 pt-36 md:pt-44 pb-12 md:pb-16">
        <div className="mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-tb-primary-400 mb-4">
              Events &amp; Announcements
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-tb-secondary mb-2 max-w-3xl">{title}</h1>
          </div>
        </div>
      </div>

      {/* Article content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {image && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img src={image} alt={title} className="w-full max-h-[480px] object-cover" />
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap mb-6">
            <span className="px-3 py-1 bg-tb-secondary text-white text-[11px] font-bold uppercase tracking-wider rounded">
              {category}
            </span>
            {date && (
              <span className="inline-flex items-center gap-2 text-slate-500 text-sm">
                <Icon icon="lucide:calendar" className="w-4 h-4 text-tb-primary-400" />
                {date}
              </span>
            )}
            <span className="inline-flex items-center gap-2 text-slate-500 text-sm">
              <Icon icon="lucide:user" className="w-4 h-4 text-tb-primary-400" />
              {author}
            </span>
          </div>

          {/* Article body */}
          <div className="website-rich-content prose prose-lg max-w-none text-slate-600 leading-relaxed">
            {htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <p className="mb-5">{summary}</p>
            )}
          </div>

          {event && (event.location || event.date) && (
            <div className="mt-8 flex flex-wrap gap-6 p-5 bg-tb-primary-50/50 rounded-2xl border border-tb-border">
              {event.location && (
                <div className="flex items-center gap-2 text-tb-body text-sm">
                  <Icon icon="lucide:map-pin" className="w-4 h-4 text-tb-primary-400" /> {event.location}
                </div>
              )}
              <div className="flex items-center gap-2 text-tb-body text-sm">
                <Icon icon="lucide:calendar-days" className="w-4 h-4 text-tb-primary-400" /> {formatDate(event.date)}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="mt-14 pt-8 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/updates"
              className="inline-flex items-center gap-2 text-sm font-bold text-tb-secondary hover:text-tb-primary-400 transition-colors uppercase tracking-wide"
            >
              <Icon icon="lucide:arrow-left" className="w-4 h-4" />
              Back to All Updates
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Share:</span>
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-tb-primary-50 hover:text-tb-primary-400 transition-colors text-slate-500 cursor-pointer">
                <Icon icon="lucide:share-2" className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
