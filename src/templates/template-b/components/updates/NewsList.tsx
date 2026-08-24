import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}

/** Template B — News & Announcements (featured + compact list, KCS style) */
export default function NewsList({ data }: { data: SchoolData }) {
  const announcements = data.updates.announcements
  if (announcements.length === 0) return null

  const featured = announcements[0]
  const rest = announcements.slice(1)

  return (
    <section id="news" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-black">News &amp; Announcements</h2>
        </div>

        {/* Featured + list layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Featured — large card */}
          <div className="lg:col-span-5">
            <div className="group h-full flex flex-col">
              <div className="relative overflow-hidden rounded-xl shrink-0 mb-5">
                <Link href={`/updates/${featured.id}`}>
                  {featured.thumbnail ? (
                    <img
                      src={featured.thumbnail}
                      alt={featured.title}
                      className="w-full h-[280px] object-cover block transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-[280px] bg-slate-100 flex flex-col items-center justify-center">
                      <Icon icon="lucide:newspaper" className="w-16 h-16 text-slate-300 mb-2" />
                      <span className="text-slate-400 font-medium text-sm">No Image</span>
                    </div>
                  )}
                </Link>
              </div>

              <div className="flex items-center gap-3 mb-3">
                {featured.category && (
                  <span className="bg-tb-secondary text-white px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                    {featured.category}
                  </span>
                )}
                {featured.published_date && (
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-400">
                    <Icon icon="lucide:calendar" className="w-3 h-3" />
                    {formatDate(featured.published_date)}
                  </span>
                )}
              </div>

              <h4 className="text-xl md:text-2xl font-bold leading-snug mb-3">
                <Link
                  href={`/updates/${featured.id}`}
                  className="text-tb-secondary hover:text-tb-primary-400 transition-colors duration-300"
                >
                  {featured.title}
                </Link>
              </h4>

              {featured.short_description && (
                <p className="text-slate-500 text-[15px] leading-relaxed mb-5 line-clamp-3">
                  {featured.short_description}
                </p>
              )}

              <div className="mt-auto">
                <Link
                  href={`/updates/${featured.id}`}
                  className="inline-flex items-center gap-2 text-tb-primary-400 font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all duration-300"
                >
                  Click here to read more <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Compact list */}
          <div className="lg:col-span-7">
            <div className="max-h-[680px] overflow-y-auto pr-4 space-y-0">
              {rest.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/updates/${item.id}`}
                  className={`group flex gap-5 items-center py-5 ${idx < rest.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="shrink-0 w-[120px] h-[90px] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Icon icon="lucide:newspaper" className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      {item.category && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-tb-primary-600">
                          {item.category}
                        </span>
                      )}
                      {item.published_date && (
                        <span className="text-[12px] text-slate-400">{formatDate(item.published_date)}</span>
                      )}
                    </div>
                    <h5 className="font-bold text-[15px] leading-snug text-tb-secondary group-hover:text-tb-primary-400 transition-colors duration-300 line-clamp-2 m-0">
                      {item.title}
                    </h5>
                    <span className="mt-1 block text-xs font-bold text-tb-primary-400">Click here to read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
