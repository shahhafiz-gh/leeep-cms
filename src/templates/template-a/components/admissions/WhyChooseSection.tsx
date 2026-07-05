'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'
import { useLiveList } from '@/shared/hooks/useLiveList'

const CONTAINER_CLASSES = [
  'bg-ta-primary-container text-ta-on-primary-container',
  'bg-ta-secondary-container text-ta-on-secondary-container',
  'bg-ta-tertiary-container text-ta-on-tertiary-container',
  'bg-ta-surface-variant text-ta-on-surface-variant border border-ta-outline',
]

export default function WhyChooseSection({ data }: { data: SchoolData }) {
  // Live list — items added/removed in the builder re-render here immediately
  // (see AdmissionsFaqSection for why data-edit patching alone can't do this).
  const items = useLiveList('admissions.whyChoose', data.admissions.whyChoose ?? [])
  if (items.length === 0) return null

  return (
    <section className="bg-ta-surface-container-lowest py-16 md:py-24 border-b border-ta-outline-variant print:hidden">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-background mb-2 tracking-tight">
            Why Choose {data.name}
          </h2>
          <p className="font-(family-name:--font-ta-body-lg) text-lg text-ta-on-surface-variant max-w-2xl mx-auto">
            An environment designed to foster intellectual curiosity and personal growth.
          </p>
        </ScrollReveal>

        <StaggerChildren stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${CONTAINER_CLASSES[index % CONTAINER_CLASSES.length]}`}>
                <Icon icon={item.icon || 'lucide:star'} className="text-2xl" />
              </div>
              <h3 data-edit={`admissions.whyChoose.${index}.title`} className="font-(family-name:--font-ta-h3) text-xl text-ta-on-surface mb-2">{item.title}</h3>
              <p data-edit={`admissions.whyChoose.${index}.description`} className="font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant">{item.description}</p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
