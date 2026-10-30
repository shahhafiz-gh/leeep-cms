'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

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

export default function EventsSection({ data }: { data: SchoolData }) {
  const events = data.updates.events

  if (!events || events.length === 0) {
    return (
      <section className="py-12 bg-ta-surface relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center py-16 bg-ta-surface-container-lowest rounded-[32px] border border-ta-outline-variant/30 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
            <div className="w-16 h-16 bg-ta-primary/10 rounded-full flex items-center justify-center mb-4">
              <Icon icon="lucide:calendar-x" className="text-3xl text-ta-primary" />
            </div>
            <h3 className="font-(family-name:--font-ta-h3) text-xl text-ta-on-surface mb-2">No Upcoming Events</h3>
            <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant mx-auto">
              Check back later for exciting new events and activities.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-20 bg-ta-surface relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-baseline justify-between mb-10 md:mb-14 border-b border-ta-outline-variant/30 pb-4">
          <h2 className="font-(family-name:--font-ta-h2) text-4xl md:text-[42px] text-ta-on-surface leading-tight tracking-tight">
            Events
          </h2>
          <Link
            href="/updates"
            className="text-sm font-bold text-ta-primary hover:text-ta-primary/80 uppercase tracking-wide transition-colors hidden sm:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.slice(0, 3).map((event) => {
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
                    <span className="text-xs font-bold text-ta-primary group-hover:text-ta-on-primary uppercase tracking-wider transition-colors duration-300">
                      {month}
                    </span>
                    <span className="text-2xl font-bold text-ta-on-surface group-hover:text-ta-on-primary leading-none transition-colors duration-300">
                      {day}
                    </span>
                  </div>
                  <h4 className="font-(family-name:--font-ta-h3) text-lg sm:text-xl text-ta-on-surface leading-snug mt-1 group-hover:text-ta-primary transition-colors duration-300">
                    {event.title}
                  </h4>
                </div>

                <div className="space-y-3 mb-6">
                  {event.location && (
                    <div className="flex items-center gap-3 text-ta-on-surface-variant text-sm font-(family-name:--font-ta-body-md)">
                      <Icon icon="lucide:map-pin" className="w-4 h-4 text-ta-primary shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.category && (
                    <div className="flex items-center gap-3 text-ta-on-surface-variant text-sm font-(family-name:--font-ta-body-md)">
                      <Icon icon="lucide:tag" className="w-4 h-4 text-ta-primary shrink-0" />
                      <span>{event.category}</span>
                    </div>
                  )}
                  {event.description && (
                    <p className="text-ta-on-surface-variant text-sm line-clamp-2 mt-2 font-(family-name:--font-ta-body-md)">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-ta-on-surface group-hover:text-ta-primary transition-colors uppercase tracking-wider">
                  Learn More
                  <Icon icon="lucide:arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
