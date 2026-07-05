import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

/** Template B — Academic Results (gold band) */
export default function ResultsSection({ data }: { data: SchoolData }) {
  const results = data.academics.results
  if (!results || results.stats.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-tb-primary">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="left" className="relative">
            {results.image ? (
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-t-8 border-l-8 border-white">
                <Image src={results.image} alt={`${data.name} results`} fill className="object-cover" data-edit-img="academics.results.image" />
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center" data-edit-img="academics.results.image">
                <Icon icon="lucide:trophy" className="text-6xl text-white" />
              </div>
            )}
          </ScrollReveal>

          {/* Content */}
          <div>
            <ScrollReveal direction="right">
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-3">
                Our Results
              </p>
              <h2 data-edit="academics.results.title" className="text-3xl md:text-4xl font-bold text-white mb-4">{results.title}</h2>
              <p data-edit="academics.results.description" className="text-white/85 text-lg leading-relaxed mb-10 max-w-xl">{results.description}</p>
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-2 gap-6">
              {results.stats.map((stat, si) => (
                <div key={stat.label} className="border-l-2 border-white/40 pl-5">
                  <div data-edit={`academics.results.stats.${si}.value`} className="text-4xl md:text-5xl font-bold text-white mb-1 leading-none">
                    {stat.value}
                  </div>
                  <div data-edit={`academics.results.stats.${si}.label`} className="text-white/75 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </div>
    </section>
  )
}
