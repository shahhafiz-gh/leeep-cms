'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'
import { useLiveList } from '@/shared/hooks/useLiveList'

interface ProgramCardProps {
  title: string
  description: string
  icon: string
  subjects: string[]
  bgColor: string
  iconColor: string
  tagColor: string
  /** Contract path prefix for inline editing, e.g. "programs.0". */
  path?: string
}

export function ProgramCard({ title, description, icon, subjects, bgColor, iconColor, tagColor, path }: ProgramCardProps) {
  return (
    <div className={`${bgColor} rounded-[24px] p-9 hover:scale-[1.03] transition-transform duration-300 flex flex-col h-full border border-ta-outline-variant/30`}>
      <div className="w-12 h-12 bg-ta-surface rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Icon icon={icon} className={`text-2xl ${iconColor}`} />
      </div>
      <h3 data-edit={path ? `${path}.name` : undefined} className="font-(family-name:--font-ta-h3) text-ta-h4 text-ta-on-surface mb-4 leading-tight">{title}</h3>
      <p data-edit={path ? `${path}.description` : undefined} className="font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant mb-6 grow">{description}</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {subjects.map((subject, i) => (
          <span
            key={i}
            data-edit={path ? `${path}.features.${i}` : undefined}
            className={`${tagColor} font-(family-name:--font-ta-label-md) text-[12px] px-3 py-1 rounded-full`}
          >
            {subject}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ProgramHeader() {
  return (
    <div className="text-center mb-16 flex flex-col items-center">
      <ScrollReveal>
        <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-body-md mb-4 inline-block font-medium">
          Our Programs
        </div>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <h2 className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-surface mb-4 leading-tight tracking-tight">
          A Program For Every Stage Of Learning
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <p className="font-(family-name:--font-ta-body-md) text-lg text-ta-on-surface-variant max-w-[500px]">
          Fostering growth, curiosity, and academic excellence from the foundational years to college readiness.
        </p>
      </ScrollReveal>
    </div>
  )
}

const programStyles = [
  { icon: 'lucide:baby', bgColor: 'bg-ta-primary-container/20', iconColor: 'text-ta-primary', tagColor: 'bg-ta-primary-container/40 text-ta-on-primary-container' },
  { icon: 'lucide:book-open', bgColor: 'bg-[#FFF3CD]/50', iconColor: 'text-[#FFD43B]', tagColor: 'bg-[#FFF3CD] text-[#856404]' },
  { icon: 'lucide:graduation-cap', bgColor: 'bg-ta-error-container/20', iconColor: 'text-ta-error', tagColor: 'bg-ta-error-container/40 text-ta-on-error-container' },
]

export default function ProgramsSection({ data }: { data: SchoolData }) {
  // Own the array so a reorder actually re-renders the cards. The per-card style
  // is keyed by the program's rank among sorted ids — invariant under reorder —
  // so each program KEEPS its icon/colour when moved (a plain index would pin
  // the icon to the slot and only the text would appear to move).
  const programs = useLiveList('programs', data.programs ?? [])
  if (programs.length === 0) return null

  const orderedIds = [...programs].map((p, i) => p.id ?? String(i)).sort()
  const styleFor = (id: string) => programStyles[Math.max(0, orderedIds.indexOf(id)) % programStyles.length]

  return (
    <section className="py-20 md:py-24 bg-ta-surface relative">
      <div className="container mx-auto px-4 md:px-6">
        <ProgramHeader />
        <StaggerChildren stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {programs.map((program, index) => {
            const style = styleFor(program.id ?? String(index))
            return (
              <ProgramCard
                key={program.id ?? index}
                path={`programs.${index}`}
                title={program.name}
                description={program.description}
                icon={style.icon}
                subjects={program.features || []}
                bgColor={style.bgColor}
                iconColor={style.iconColor}
                tagColor={style.tagColor}
              />
            )
          })}
        </StaggerChildren>
      </div>
    </section>
  )
}
