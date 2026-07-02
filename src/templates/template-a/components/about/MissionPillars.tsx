'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

/** Template A — Mission pillars (data.about.mission). */
export default function MissionPillars({ data }: { data: SchoolData }) {
  const pillars = data.about.mission ?? []
  if (pillars.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-ta-surface-container-low overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center flex flex-col items-center mb-12">
          <ScrollReveal>
            <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-(length:--text-ta-label-md) font-semibold mb-4 inline-block">
              What Drives Us
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-(family-name:--font-ta-h2) text-(length:--text-ta-h2) text-ta-on-surface mb-4 max-w-2xl mx-auto leading-tight">
              Our Mission
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-(family-name:--font-ta-body-md) text-(length:--text-ta-body-md) text-ta-on-surface-variant max-w-[520px] mx-auto">
              The guiding commitments that shape how we teach, support, and grow our {data.name} community.
            </p>
          </ScrollReveal>
        </div>

        {/* Pillars Grid */}
        <StaggerChildren stagger={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-(--spacing-ta-gutter)">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="bg-ta-surface rounded-3xl border border-ta-outline-variant p-8 flex flex-col items-start text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-ta-primary/10 rounded-full flex items-center justify-center mb-6 border border-ta-primary/20 shadow-sm group-hover:bg-ta-primary transition-colors duration-300">
                <Icon
                  icon={pillar.icon ?? 'lucide:check-circle'}
                  className="text-3xl text-ta-primary group-hover:text-ta-on-primary transition-colors duration-300"

                />
              </div>

              <h3
                data-edit={`about.mission.${index}.title`}
                className="font-(family-name:--font-ta-h3) text-(length:--text-ta-h3) text-ta-on-surface mb-2"
              >
                {pillar.title}
              </h3>

              <div className="h-[3px] w-12 my-4 rounded-full bg-ta-primary opacity-80" />

              <p
                data-edit={`about.mission.${index}.description`}
                className="font-(family-name:--font-ta-body-md) text-(length:--text-ta-body-md) text-ta-on-surface-variant leading-relaxed"
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
