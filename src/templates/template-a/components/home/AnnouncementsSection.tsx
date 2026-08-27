'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

function formatDate(dateString?: string) {
  if (!dateString) return 'Today'
  try {
    const d = new Date(dateString)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  } catch { }
  return 'Today'
}

export default function AnnouncementsSection({ data }: { data: SchoolData }) {
  const announcements = data.updates.announcements

  if (announcements.length === 0) {
    return (
      <section className="py-12 bg-ta-surface relative overflow-hidden">
        <div className="container my-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center py-16 bg-ta-surface-container-lowest rounded-[32px] border border-ta-outline-variant/30 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
            <div className="w-16 h-16 bg-ta-primary/10 rounded-full flex items-center justify-center mb-4">
              <Icon icon="lucide:inbox" className="text-3xl text-ta-primary" />
            </div>
            <h3 className="font-(family-name:--font-ta-h3) text-xl text-ta-on-surface mb-2">No Announcements</h3>
            <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant mx-auto">
              We&apos;ll post new announcements and updates here soon.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const featured = announcements[0]
  const listItems = announcements.slice(1, 5)

  return (
    <section className="py-1 bg-ta-surface relative overflow-hidden">
      <div className="container my-10 mx-auto px-4 md:px-6">
        <h2 className="font-(family-name:--font-ta-h2) text-4xl md:text-[42px] text-ta-on-surface mb-10 md:mb-14 leading-tight tracking-tight">
          Announcements
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Featured */}
          <Link href={`/updates/${featured.id}`} className="group flex-col block">
            {featured.thumbnail ? (
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden mb-6 bg-ta-surface-container">
                <img loading="lazy" decoding="async"
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden mb-6 bg-ta-primary/5 flex items-center justify-center border border-ta-primary/10 group-hover:bg-ta-primary/10 transition-colors duration-500">
                <Icon icon="lucide:megaphone" className="text-6xl text-ta-primary/30 group-hover:scale-110 group-hover:text-ta-primary/60 transition-all duration-500" />
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <span className="bg-ta-surface-container-high/60 text-ta-on-surface-variant text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {featured.category || 'Announcement'}
              </span>
              <span className="text-xs text-ta-outline flex items-center gap-1.5 font-medium">
                <Icon icon="lucide:calendar" className="text-[10px]" />
                {formatDate(featured.published_date)}
              </span>
            </div>

            <h3 className="font-(family-name:--font-ta-h3) text-2xl md:text-ta-h3 text-ta-on-surface mb-3 leading-snug group-hover:text-ta-primary transition-colors">
              {featured.title}
            </h3>

            <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant leading-relaxed line-clamp-2 md:line-clamp-3 mb-6">
              {featured.short_description || featured.content?.replace(/<[^>]+>/g, '') || ''}
            </p>

            <div className="text-ta-label-md font-bold text-ta-on-surface text-xs uppercase tracking-wider flex items-center gap-2 group-hover:text-ta-primary transition-colors mt-auto">
              Read More
              <Icon icon="lucide:arrow-right" className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* List */}
          {listItems.length > 0 && (
            <div className="flex flex-col">
              {listItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/updates/${item.id}`}
                  className="group flex gap-5 py-5 border-b border-ta-outline-variant/30 first:pt-0 last:border-0 last:pb-0"
                >
                  {item.thumbnail ? (
                    <div className="w-28 sm:w-36 h-20 sm:h-24 shrink-0 rounded-xl overflow-hidden relative bg-ta-surface-container">
                      <img loading="lazy" decoding="async"
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    </div>
                  ) : (
                    <div className="w-28 sm:w-36 h-20 sm:h-24 shrink-0 rounded-xl overflow-hidden relative bg-ta-primary/5 flex items-center justify-center border border-ta-primary/10 group-hover:bg-ta-primary/10 transition-colors duration-500">
                      <Icon icon="lucide:megaphone" className="text-3xl text-ta-primary/40 group-hover:scale-110 group-hover:text-ta-primary transition-all duration-500" />
                    </div>
                  )}

                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                      <span className="text-[10px] sm:text-xs text-ta-outline font-medium">
                        {formatDate(item.published_date)}
                      </span>
                    </div>
                    <h4 className="font-(family-name:--font-ta-h3) text-base sm:text-lg text-ta-on-surface leading-snug group-hover:text-ta-primary transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant leading-relaxed line-clamp-2 text-sm mt-1">
                      {item.short_description || ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
