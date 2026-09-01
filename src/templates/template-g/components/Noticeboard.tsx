import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

function displayDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Noticeboard({ data }: { data: SchoolData }) {
  const announcements = data.updates.announcements.slice(0, 4)
  const events = data.updates.events.slice(0, 3)

  return (
    <section className="bg-[#f6f7fb] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-tb-primary-400">{data.name}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-tb-secondary md:text-4xl">Notifications &amp; Events</h2>
          <span className="mx-auto mt-4 block h-1 w-16 bg-tb-primary-400" />
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="border-t-4 border-tb-secondary bg-white p-6 shadow-[0_12px_35px_rgba(30,48,107,0.08)] md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-3 text-xl font-extrabold text-tb-secondary">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-tb-primary-50 text-tb-primary-400"><Icon icon="lucide:bell-ring" className="h-5 w-5" /></span>
                Latest notices
              </h3>
              <Link href="/updates" className="text-xs font-extrabold uppercase tracking-wider text-tb-primary-400">View all</Link>
            </div>
            <div className="divide-y divide-tb-line">
              {announcements.length ? announcements.map((item) => (
                <Link key={item.id} href={`/updates/${item.id}`} className="group flex gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rotate-45 bg-tb-primary-400" />
                  <span className="min-w-0">
                    <span className="block font-bold leading-snug text-tb-secondary transition-colors group-hover:text-tb-primary-400">{item.title}</span>
                    {item.published_date && <span className="mt-1 block text-xs text-tb-body">{displayDate(item.published_date)}</span>}
                  </span>
                </Link>
              )) : <p className="py-8 text-sm text-tb-body">No notices at the moment. Check back soon.</p>}
            </div>
          </div>

          <div className="bg-[linear-gradient(145deg,#21347a,#6b31a1)] p-6 text-white shadow-[0_12px_35px_rgba(30,48,107,0.18)] md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-xl font-extrabold text-white">Upcoming events</h3>
              <Icon icon="lucide:calendar-days" className="h-6 w-6 text-white/70" />
            </div>
            <div className="space-y-5">
              {events.length ? events.map((event) => {
                const date = new Date(event.date)
                const valid = !Number.isNaN(date.getTime())
                return (
                  <Link key={event.id} href={`/updates/${event.id}`} className="group flex items-start gap-4 border-b border-white/20 pb-5 last:border-0 last:pb-0">
                    <span className="grid h-14 w-14 shrink-0 place-items-center bg-white text-center text-tb-secondary">
                      <span><b className="block text-xl leading-5">{valid ? date.getDate() : '--'}</b><small className="text-[10px] font-bold uppercase">{valid ? date.toLocaleDateString('en-IN', { month: 'short' }) : 'TBD'}</small></span>
                    </span>
                    <span>
                      <span className="block font-bold leading-snug text-white group-hover:text-white/75">{event.title}</span>
                      {event.location && <span className="mt-1 flex items-center gap-1 text-xs text-white/65"><Icon icon="lucide:map-pin" className="h-3 w-3" />{event.location}</span>}
                    </span>
                  </Link>
                )
              }) : <p className="py-8 text-sm text-white/70">No upcoming events at the moment.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
