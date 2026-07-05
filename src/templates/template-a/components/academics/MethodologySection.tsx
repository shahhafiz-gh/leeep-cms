import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

const DEFAULT_ICONS = ['lucide:lightbulb', 'lucide:flask-conical', 'lucide:clipboard-check', 'lucide:heart-handshake']

export default function MethodologySection({ data }: { data: SchoolData }) {
  const methodology = data.academics.methodology
  if (!methodology || methodology.steps.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-ta-surface-container-lowest">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14 flex flex-col items-center">
          <ScrollReveal>
            <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md mb-4 inline-block font-medium">
              Our Approach
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 data-edit="academics.methodology.title" className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-surface mb-4 leading-tight tracking-tight">
              {methodology.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p data-edit="academics.methodology.description" className="font-(family-name:--font-ta-body-md) text-lg text-ta-on-surface-variant max-w-[520px]">
              {methodology.description}
            </p>
          </ScrollReveal>
        </div>

        <StaggerChildren stagger={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {methodology.steps.map((step, index) => (
            <div
              key={step.title}
              className="relative bg-ta-surface rounded-3xl p-8 border border-ta-outline-variant hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <span className="absolute top-6 right-7 font-(family-name:--font-ta-h2) text-5xl font-extrabold text-ta-primary/10 leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="w-14 h-14 rounded-2xl bg-ta-primary/10 flex items-center justify-center mb-6 relative z-10">
                <Icon icon={step.icon ?? DEFAULT_ICONS[index % DEFAULT_ICONS.length]} className="text-2xl text-ta-primary" />
              </div>
              <h3 data-edit={`academics.methodology.steps.${index}.title`} className="font-(family-name:--font-ta-h3) text-ta-h4 text-ta-on-surface mb-3 leading-tight relative z-10">
                {step.title}
              </h3>
              <p data-edit={`academics.methodology.steps.${index}.description`} className="font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant leading-relaxed relative z-10">
                {step.description}
              </p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
