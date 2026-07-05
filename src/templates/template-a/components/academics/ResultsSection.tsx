import Image from 'next/image'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

export default function ResultsSection({ data }: { data: SchoolData }) {
  const results = data.academics.results
  if (!results || results.stats.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-ta-surface">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="left" className="relative">
            <div className="absolute -inset-3 bg-ta-secondary-container rounded-[40px] opacity-40 -z-10" />
            {results.image ? (
              <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden border-8 border-white shadow-lg">
                <Image src={results.image} alt={`${data.name} results`} fill className="object-cover" data-edit-img="academics.results.image" />
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden">
                <ImagePlaceholder label="Add results image" icon="lucide:trophy" editPath="academics.results.image" />
              </div>
            )}
          </ScrollReveal>

          {/* Content */}
          <div>
            <ScrollReveal direction="right">
              <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md mb-4 inline-block font-medium">
                Results
              </div>
              <h2 data-edit="academics.results.title" className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-surface mb-4 leading-tight tracking-tight">
                {results.title}
              </h2>
              <p data-edit="academics.results.description" className="font-(family-name:--font-ta-body-md) text-lg text-ta-on-surface-variant mb-8 max-w-xl">
                {results.description}
              </p>
            </ScrollReveal>

            <StaggerChildren stagger={0.1} className="grid grid-cols-2 gap-5">
              {results.stats.map((stat, si) => (
                <div key={stat.label} className="bg-ta-surface-container-lowest rounded-2xl border border-ta-outline-variant p-6">
                  <div data-edit={`academics.results.stats.${si}.value`} className="font-(family-name:--font-ta-h2) text-4xl font-extrabold text-ta-primary mb-1">
                    {stat.value}
                  </div>
                  <div data-edit={`academics.results.stats.${si}.label`} className="font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface-variant">
                    {stat.label}
                  </div>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </div>
    </section>
  )
}
