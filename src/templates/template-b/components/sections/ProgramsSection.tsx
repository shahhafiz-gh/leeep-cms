'use client'

import type { SchoolData } from '@/types/school.types'
import { Icon } from '@iconify/react'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'
import { useLiveList } from '@/shared/hooks/useLiveList'

/** Per-card icon + soft cream tones (cycles by index). Stays within Template B's
 *  warm, gold/cream editorial palette — one accent throughout, just gently
 *  varying card tints — rather than Template A's multi-colour story. */
const PROGRAM_STYLES = [
  { icon: 'lucide:smile', bg: '#fbf6ea', accent: '#a3812a', chipBg: '#f1e7cb' },
  { icon: 'lucide:book-open', bg: '#f7f1e3', accent: '#a3812a', chipBg: '#ece1c6' },
  { icon: 'lucide:graduation-cap', bg: '#f3eddf', accent: '#a3812a', chipBg: '#e8ddc1' },
]

/** Template B — "Our Programs" section. Renders data.programs (name, description
 *  and the feature list as chips), matching Template A's content with Template B's
 *  layout. */
export default function ProgramsSection({ data }: { data: SchoolData }) {
  // Own the array so a reorder re-renders the cards, and key each card's style by
  // the program's rank among sorted ids (invariant under reorder) so its icon /
  // tint travels with it instead of staying pinned to the slot.
  const programs = useLiveList('programs', data.programs ?? [])
  if (programs.length === 0) return null

  const orderedIds = [...programs].map((p, i) => p.id ?? String(i)).sort()
  const styleIndexFor = (id: string) => Math.max(0, orderedIds.indexOf(id)) % PROGRAM_STYLES.length

  return (
    <section className="py-16 md:py-24 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">
            Our Programs
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-tb-heading mb-4">A Program For Every Stage Of Learning</h2>
          <p className="text-tb-body text-lg max-w-2xl mx-auto leading-relaxed">
            Fostering growth, curiosity, and academic excellence from the foundational years to college readiness.
          </p>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, idx) => {
            const style = PROGRAM_STYLES[styleIndexFor(program.id ?? String(idx))]
            const features = program.features ?? []

            return (
              <div
                key={program.id ?? idx}
                className="rounded-2xl p-7 h-full border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-[transform,box-shadow] duration-300 transform-gpu backface-hidden flex flex-col"
                style={{ backgroundColor: style.bg }}
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-5 shadow-sm">
                  <Icon icon={style.icon} className="w-6 h-6" style={{ color: style.accent }} />
                </div>
                <h5 data-edit={`programs.${idx}.name`} className="text-lg font-semibold text-tb-heading mb-2">
                  {program.name}
                </h5>
                <p data-edit={`programs.${idx}.description`} className="text-tb-body text-sm leading-relaxed mb-5 grow">
                  {program.description}
                </p>
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-4 w-[150px]">
                    {features.map((feature, i) => (
                      <span
                        key={i}
                        data-edit={`programs.${idx}.features.${i}`}
                        className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{ backgroundColor: style.chipBg, color: style.accent }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </StaggerChildren>
      </div>
    </section>
  )
}
