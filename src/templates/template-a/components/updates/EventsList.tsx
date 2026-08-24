import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import StaggerChildren from '@/shared/animations/stagger-children'

function formatEventDate(dateString: string) {
  try {
    const d = new Date(dateString)
    if (!isNaN(d.getTime())) {
      return {
        month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        day: d.toLocaleDateString('en-US', { day: '2-digit' }),
      }
    }
  } catch { }
  return { month: 'TBD', day: '--' }
}

export default function EventsList({ data }: { data: SchoolData }) {
  const events = data.updates.events

  if (!events || events.length === 0) {
    return (
      <section id="events" className="bg-ta-surface py-10 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center py-20 bg-ta-surface-container-lowest rounded-[40px] border border-ta-outline-variant/30">
            <div className="w-20 h-20 bg-ta-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon icon="lucide:calendar-x" className="text-4xl text-ta-primary" />
            </div>
            <h3 className="font-(family-name:--font-ta-h3) text-2xl text-ta-on-surface mb-2">No Events</h3>
            <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant mx-auto">
              There are currently no events. Please check back later for updates.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="bg-ta-surface py-12 md:py-20 mb-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-10 border-b border-ta-outline-variant/30 pb-4">
          <h2 className="font-(family-name:--font-ta-h2) text-3xl md:text-[42px] text-ta-on-surface leading-tight tracking-tight">
            Events
          </h2>
        </div>

        {/* Events Grid */}
        <StaggerChildren stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event) => {
            const { month, day } = formatEventDate(event.date)
            return (
              <Link
                key={event.id}
                href={`/updates/${event.id}`}
                className="bg-ta-surface-container-lowest rounded-2xl p-6 border border-ta-outline-variant/30 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group"
              >
                <div className="flex gap-5 mb-6">
                  {/* Date box */}
                  <div className="bg-ta-primary/10 rounded-xl p-3 flex flex-col items-center justify-center min-w-[72px] h-[72px] shrink-0 border border-ta-primary/20 group-hover:bg-ta-primary group-hover:border-ta-primary transition-colors duration-300">
                    <span className="text-[10px] font-bold text-ta-primary group-hover:text-ta-on-primary uppercase tracking-wider transition-colors duration-300">
                      {month}
                    </span>
                    <span className="text-2xl font-bold text-ta-on-surface group-hover:text-ta-on-primary leading-none transition-colors duration-300">
                      {day}
                    </span>
                  </div>
                  <h3 className="font-(family-name:--font-ta-h3) text-lg sm:text-xl text-ta-on-surface leading-snug mt-1 group-hover:text-ta-primary transition-colors duration-300">
                    {event.title}
                  </h3>
                </div>

                <div className="space-y-3 mb-6">
                  {event.category && (
                    <div className="flex items-center gap-3 text-ta-on-surface-variant text-sm font-(family-name:--font-ta-body-md)">
                      <Icon icon="lucide:tag" className="w-4 h-4 text-ta-primary shrink-0" />
                      <span>{event.category}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-3 text-ta-on-surface-variant text-sm font-(family-name:--font-ta-body-md)">
                      <Icon icon="lucide:map-pin" className="w-4 h-4 text-ta-primary shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-ta-on-surface group-hover:text-ta-primary transition-colors uppercase tracking-wider">
                  Click here to read more
                  <Icon icon="lucide:arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </StaggerChildren>
      </div>
    </section>
  )
}
