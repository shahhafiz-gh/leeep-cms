import type { SchoolData } from '@/types/school.types'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

/** Template B — Events Section (KCS style) */
export default function EventsSection({ data }: { data: SchoolData }) {
  const { events } = data.updates

  const formatDate = (dateStr: string) => {
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

  if (events.length === 0) {
    return (
      <section id="events" className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-baseline justify-between mb-10 border-b border-slate-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-tb-secondary">Events</h2>
          </div>
          <p className="text-tb-body">No upcoming events at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="py-16 md:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <ScrollReveal className="flex items-baseline justify-between mb-10 border-b border-slate-200 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-tb-secondary">Events</h2>
          <Link
            href="/updates"
            className="text-sm font-bold text-tb-primary-400 hover:text-tb-primary-500 uppercase tracking-wide transition-colors hidden sm:block"
          >
            View All →
          </Link>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const { month, day } = formatDate(event.date)
            return (
              <Link
                key={event.id}
                href={`/updates/${event.id}`}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                <div className="flex gap-4 mb-5">
                  {/* Date box */}
                  <div className="bg-tb-primary-50 rounded-xl p-3 flex flex-col items-center justify-center min-w-[68px] h-[68px] shrink-0 border border-tb-primary-100">
                    <span className="text-xs font-bold text-tb-primary-500 uppercase tracking-wider">
                      {month}
                    </span>
                    <span className="text-2xl font-bold text-tb-secondary leading-none">{day}</span>
                  </div>
                  <h4 className="text-lg font-bold text-tb-secondary leading-tight mt-1 group-hover:text-tb-primary-400 transition-colors duration-300">
                    {event.title}
                  </h4>
                </div>

                <div className="space-y-2.5 mb-5">
                  {event.location && (
                    <div className="flex items-center gap-2.5 text-slate-500 text-sm">
                      <Icon icon="lucide:map-pin" className="w-4 h-4 text-tb-primary-400 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.category && (
                    <div className="flex items-center gap-2.5 text-slate-500 text-sm">
                      <Icon icon="lucide:tag" className="w-4 h-4 text-tb-primary-400 shrink-0" />
                      <span>{event.category}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-tb-secondary group-hover:text-tb-primary-400 transition-colors uppercase tracking-wide">
                  Learn More
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </div>
              </Link>
            )
          })}
        </StaggerChildren>
      </div>
    </section>
  )
}
