import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

const STYLES = [
  { icon: 'lucide:baby', bg: 'bg-ta-primary-container/20', iconColor: 'text-ta-primary', tag: 'bg-ta-primary-container/40 text-ta-on-primary-container' },
  { icon: 'lucide:book-open', bg: 'bg-[#FFF3CD]/50', iconColor: 'text-[#D9A406]', tag: 'bg-[#FFF3CD] text-[#856404]' },
  { icon: 'lucide:graduation-cap', bg: 'bg-ta-error-container/20', iconColor: 'text-ta-error', tag: 'bg-ta-error-container/40 text-ta-on-error-container' },
]

export default function StreamsSection({ data }: { data: SchoolData }) {
  const streams = data.academics.streams ?? []
  if (streams.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-ta-surface">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14 flex flex-col items-center">
          <ScrollReveal>
            <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md mb-4 inline-block font-medium">
              Academic Streams
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 data-edit="academics.streamsTitle" className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-surface mb-4 leading-tight tracking-tight">
              {data.academics.streamsTitle ?? 'A Program for Every Stage'}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p data-edit="academics.streamsDescription" className="font-(family-name:--font-ta-body-md) text-lg text-ta-on-surface-variant max-w-[520px]">
              {data.academics.streamsDescription ?? 'Carefully structured wings that grow with your child — from the foundational years to board examinations.'}
            </p>
          </ScrollReveal>
        </div>

        <StaggerChildren stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {streams.map((stream, index) => {
            const style = STYLES[index % STYLES.length]
            return (
              <div
                key={stream.name}
                className={`${style.bg} rounded-[24px] p-9 hover:scale-[1.03] transition-transform duration-300 flex flex-col h-full border border-ta-outline-variant/30`}
              >
                <div className="w-12 h-12 bg-ta-surface rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Icon icon={style.icon} className={`text-2xl ${style.iconColor}`} />
                </div>
                <h3 data-edit={`academics.streams.${index}.name`} className="font-(family-name:--font-ta-h3) text-ta-h4 text-ta-on-surface mb-3 leading-tight">
                  {stream.name}
                </h3>
                <p data-edit={`academics.streams.${index}.description`} className="font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant mb-6 grow">
                  {stream.description}
                </p>
                {stream.subjects && stream.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {stream.subjects.map((subject, si) => (
                      <span key={subject} data-edit={`academics.streams.${index}.subjects.${si}`} className={`${style.tag} font-(family-name:--font-ta-label-md) text-[12px] px-3 py-1 rounded-full`}>
                        {subject}
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
