import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

function formatEventDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.toLocaleDateString('en-US', { day: '2-digit' }),
    }
  } catch {
    return { month: 'TBD', day: '--' }
  }
}

/** Template B — Events grid for the Updates page (KCS style) */
export default function EventsList({ data }: { data: SchoolData }) {
  const events = data.updates.events
  if (!events || events.length === 0) return null

  return (
    <section id="events" className="py-16 md:py-24 bg-slate-50/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-10 border-b border-slate-200 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-tb-secondary">Events</h2>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const { month, day } = formatEventDate(event.date)
            return (
              <Link
                key={event.id}
                href={`/updates/${event.id}`}
                className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <div className="flex gap-4 mb-6">
                  {/* Date box */}
                  <div className="bg-slate-100 rounded-lg p-3 flex flex-col items-center justify-center min-w-[70px] h-[70px] shrink-0">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{month}</span>
                    <span className="text-2xl font-bold text-tb-secondary leading-none">{day}</span>
                  </div>
                  {/* Title */}
                  <h4 className="text-xl font-bold text-tb-secondary leading-tight mt-1 m-0">{event.title}</h4>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  {event.category && (
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <Icon icon="lucide:tag" className="w-4 h-4 text-tb-primary-400" />
                      <span>{event.category}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <Icon icon="lucide:map-pin" className="w-4 h-4 text-tb-primary-400" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Footer link */}
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-tb-secondary hover:text-tb-primary-400 transition-colors uppercase tracking-wide">
                  Click here to read more
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
