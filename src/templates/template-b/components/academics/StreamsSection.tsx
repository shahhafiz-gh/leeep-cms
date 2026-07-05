import type { SchoolData } from '@/types/school.types'
import { Icon } from '@iconify/react'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

/** Template B — Academic Streams */
export default function StreamsSection({ data }: { data: SchoolData }) {
  const streams = data.academics.streams ?? []
  if (streams.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-tb-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">
            Our Programs
          </p>
          <h2 data-edit="academics.streamsTitle" className="text-3xl md:text-4xl font-bold text-tb-heading mb-4">
            {data.academics.streamsTitle ?? 'Academic Streams'}
          </h2>
          <p data-edit="academics.streamsDescription" className="text-tb-body text-lg max-w-2xl mx-auto leading-relaxed">
            {data.academics.streamsDescription ?? 'Carefully designed pathways that prepare students for board excellence and their chosen careers.'}
          </p>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streams.map((stream, index) => (
            <div
              key={stream.name}
              className="bg-white rounded-2xl p-8 h-full border border-tb-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="w-12 h-12 rounded-xl bg-tb-primary-50 flex items-center justify-center mb-5 group-hover:bg-tb-primary-400 transition-colors duration-300">
                <Icon icon="lucide:book-open" className="w-6 h-6 text-tb-primary-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 data-edit={`academics.streams.${index}.name`} className="text-xl font-bold text-tb-heading mb-3">{stream.name}</h3>
              <p data-edit={`academics.streams.${index}.description`} className="text-tb-body leading-relaxed mb-6 grow">{stream.description}</p>
              {stream.subjects && stream.subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-5 border-t border-tb-line">
                  {stream.subjects.map((subject, si) => (
                    <span
                      key={subject}
                      data-edit={`academics.streams.${index}.subjects.${si}`}
                      className="text-xs font-semibold text-tb-primary-600 bg-tb-primary-50 rounded-full px-3 py-1.5"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
