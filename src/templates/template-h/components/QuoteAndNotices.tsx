import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { isSectionVisible } from '@/shared/section-visibility'

function displayDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * The band directly under the hero on the reference site: a "Quote of the Day"
 * panel beside a scrolling list of the latest notices.
 *
 * The notices are the school's published Website Announcements — the same
 * records the Updates page renders, folded onto `updates.announcements` by the
 * server — so a notice is written once and appears in both places.
 *
 * The quote panel is skipped entirely when no quote is authored, which leaves
 * the notices full-width rather than a hole in the layout.
 */
export default function QuoteAndNotices({ data }: { data: SchoolData }) {
  const quote = data.quote
  const hasQuote = Boolean(quote?.text || quote?.scriptText)
  const limit = Number(data.notifications?.limit) || 5
  const announcements = (data.updates?.announcements ?? []).slice(0, limit)

  if (!hasQuote && !announcements.length && !data.notifications?.emptyText) return null

  return (
    <section className="bg-th-paper py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className={`grid gap-7 ${hasQuote ? 'lg:grid-cols-2' : ''}`}>
          {hasQuote && isSectionVisible(data, 'quote') && (
            <article className="border-t-[3px] border-th-primary bg-white p-6 shadow-[0_10px_30px_rgba(34,34,34,0.06)] md:p-8">
              <h2 className="flex items-center gap-3 text-lg font-semibold uppercase tracking-wide text-th-heading">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-th-primary-50 text-th-primary">
                  <Icon icon="lucide:quote" className="h-4.5 w-4.5" />
                </span>
                <span data-edit="quote.title">{quote?.title || 'Quote of the Day'}</span>
              </h2>

              {/* dir="auto" lets the browser resolve direction from the text
                  itself, so Arabic and Urdu render right-to-left without the
                  school having to declare a script per line. */}
              {quote?.scriptText && (
                <p
                  dir="auto"
                  data-edit="quote.scriptText"
                  className="mt-6 text-xl leading-[2.1] text-th-heading"
                >
                  {quote.scriptText}
                </p>
              )}
              {quote?.text && (
                <p
                  dir="auto"
                  data-edit="quote.text"
                  className="mt-5 border-l-2 border-th-primary/40 pl-4 text-[15px] italic leading-8 text-th-body"
                >
                  {quote.text}
                </p>
              )}
              {quote?.translationText && (
                <p
                  dir="auto"
                  data-edit="quote.translationText"
                  className="mt-4 text-[15px] leading-[2.1] text-th-body"
                >
                  {quote.translationText}
                </p>
              )}
              {quote?.attribution && (
                <p
                  data-edit="quote.attribution"
                  className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-th-primary"
                >
                  {quote.attribution}
                </p>
              )}
            </article>
          )}

          <article className="border-t-[3px] border-th-heading bg-white p-6 shadow-[0_10px_30px_rgba(34,34,34,0.06)] md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 text-lg font-semibold uppercase tracking-wide text-th-heading">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-th-primary-50 text-th-primary">
                  <Icon icon="lucide:bell-ring" className="h-4.5 w-4.5" />
                </span>
                <span data-edit="notifications.title">{data.notifications?.title || 'Latest Notifications'}</span>
              </h2>
              <Link
                href="/updates"
                className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-th-primary hover:underline"
              >
                {data.notifications?.cta?.label || 'View all'}
              </Link>
            </div>

            <div className="mt-5 max-h-[340px] divide-y divide-th-line overflow-y-auto pr-1">
              {announcements.length ? (
                announcements.map((item) => (
                  <Link
                    key={item.id}
                    href={`/updates/${item.id}`}
                    className="group flex gap-3.5 py-4 first:pt-0"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-th-primary" />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold leading-snug text-th-heading transition-colors group-hover:text-th-primary">
                        {item.title}
                      </span>
                      {item.published_date && (
                        <span className="mt-1 block text-xs text-th-muted">
                          {displayDate(item.published_date)}
                        </span>
                      )}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="py-10 text-sm text-th-body">
                  {data.notifications?.emptyText || 'No notices at the moment. Please check back soon.'}
                </p>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
