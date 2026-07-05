'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

const blobClasses = [
  'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]',
  'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]',
  'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]',
  'rounded-[50%_50%_30%_70%/50%_60%_40%_60%]',
]

const colorClasses = [
  'bg-ta-secondary-container text-ta-on-secondary-container',
  'bg-ta-primary-container text-ta-on-primary-container',
  'bg-ta-tertiary-container text-ta-on-tertiary-container',
  'bg-ta-secondary-container text-ta-on-secondary-container',
]

export default function WhyChooseUsSection({ data }: { data: SchoolData }) {
  const features = data.about.whyChooseUs
  if (!features || features.length === 0) return null

  return (
    <section
      className="py-10 md:py-0 mb-20"
      data-section-note="“Why choose us” is shared with the About page. Editing these points here updates them on the About page too."
      data-note-action="Open the About page →"
      data-note-target="about.whyChooseUs.0.title"
    >
      <div className="container my-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal>
            <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-(length:--text-ta-label-md) mb-4 inline-block">
              Why Choose Us?
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 data-edit="about.whyChooseTitle" className="font-(family-name:--font-ta-h2) text-(length:--text-ta-h2) text-ta-on-surface mb-4">
              {data.about.whyChooseTitle ?? 'What Sets Us Apart'}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p data-edit="about.whyChooseDescription" className="font-(family-name:--font-ta-body-lg) text-ta-on-surface-variant max-w-2xl mx-auto">
              {data.about.whyChooseDescription ?? 'Discover what makes us the preferred choice for families seeking quality education.'}
            </p>
          </ScrollReveal>
        </div>

        {/* Features Grid */}
        <StaggerChildren stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-(--spacing-ta-gutter)">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="h-full bg-ta-surface rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center border border-ta-outline-variant"
            >
              <div
                className={`w-16 h-16 ${colorClasses[index % colorClasses.length]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${blobClasses[index % blobClasses.length]}`}
              >
                <Icon icon={feature.icon || 'lucide:star'} className="w-8 h-8" />
              </div>
              <h3 data-edit={`about.whyChooseUs.${index}.title`} className="font-(family-name:--font-ta-h3) text-(length:--text-ta-h3) text-ta-on-surface mb-2">
                {feature.title}
              </h3>
              <p data-edit={`about.whyChooseUs.${index}.description`} className="font-(family-name:--font-ta-body-md) text-(length:--text-ta-body-md) text-ta-on-surface-variant">
                {feature.description}
              </p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
