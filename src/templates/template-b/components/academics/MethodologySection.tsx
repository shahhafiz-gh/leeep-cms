import type { SchoolData } from '@/types/school.types'
import { Icon } from '@iconify/react'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

const DEFAULT_ICONS = ['lucide:compass', 'lucide:monitor', 'lucide:users', 'lucide:sparkles']

/** Template B — Teaching Methodology */
export default function MethodologySection({ data }: { data: SchoolData }) {
  const methodology = data.academics.methodology
  if (!methodology || methodology.steps.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-tb-primary-50/40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">
            Our Approach
          </p>
          <h2 data-edit="academics.methodology.title" className="text-3xl md:text-4xl font-bold text-tb-heading mb-4">{methodology.title}</h2>
          <p data-edit="academics.methodology.description" className="text-tb-body text-lg max-w-2xl mx-auto leading-relaxed">{methodology.description}</p>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {methodology.steps.map((step, index) => (
            <div
              key={step.title}
              className="relative bg-white rounded-2xl p-7 border border-tb-border hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
              <span className="absolute top-5 right-6 text-5xl font-bold text-tb-primary-100 leading-none select-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="w-14 h-14 rounded-full bg-tb-primary-400 flex items-center justify-center mb-5 relative z-10 shadow-sm">
                <Icon icon={step.icon ?? DEFAULT_ICONS[index % DEFAULT_ICONS.length]} className="w-7 h-7 text-white" />
              </div>
              <h3 data-edit={`academics.methodology.steps.${index}.title`} className="text-lg font-bold text-tb-heading mb-2 relative z-10">{step.title}</h3>
              <p data-edit={`academics.methodology.steps.${index}.description`} className="text-tb-body text-sm leading-relaxed relative z-10">{step.description}</p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
