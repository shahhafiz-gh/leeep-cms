'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'

export default function StatsSection({ data }: { data: SchoolData }) {
  // Own the array so a reorder re-renders each stat's icon + suffix (per-item
  // data the index-based DOM overlay can't move), not just its value/label.
  const stats = useLiveList('stats', data.stats)
  if (stats.length === 0) return null

  return (
    <section className="bg-ta-primary py-10 md:py-10 overflow-hidden">
      <div className="container my-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 justify-items-center items-center text-center">
          {stats.map((stat, i) => (
            <div key={i} className="w-full">
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full border-2 border-ta-on-primary/50 flex items-center justify-center mb-6 bg-ta-on-primary/10 shadow-[0_4px_24px_rgba(26,26,46,0.08)] group-hover:scale-105 group-hover:border-ta-on-primary transition-all duration-300">
                  <Icon icon={stat.icon || 'lucide:star'} className="w-8 h-8 text-ta-on-primary" />
                </div>
                <div className="font-(family-name:--font-ta-h1) text-4xl md:text-(length:--text-ta-h1) text-ta-on-primary mb-2 tabular-nums">
                  <span data-edit={`stats.${i}.value`}>{stat.value}</span>{stat.suffix || ''}
                </div>
                <div
                  data-edit={`stats.${i}.label`}
                  className="font-(family-name:--font-ta-label-sm) text-(length:--text-ta-label-sm) text-ta-on-primary/85 tracking-wider uppercase"
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
