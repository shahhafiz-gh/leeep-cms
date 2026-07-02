import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

/** Template B — Our Mission & Vision */
export default function MissionVision({ data }: { data: SchoolData }) {
  const mission = data.about.missionStatement
  const vision = data.about.vision
  const values = data.about.values ?? []

  if (!mission && !vision) return null

  return (
    <div className="py-16 md:py-24 bg-tb-primary-50/40">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-tb-primary-400 mb-3">
            What Drives Us
          </span>
          <h3 className="text-3xl font-bold text-tb-heading">Our Mission &amp; Vision</h3>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Mission Card — white */}
          {mission && (
            <div className="bg-white rounded-xl border border-tb-border p-8 h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="w-16 h-16 rounded-full bg-tb-primary-400/10 flex items-center justify-center mb-6">
                <Icon icon="lucide:target" className="w-8 h-8 text-tb-primary-500" />
              </div>
              <h4 className="text-2xl font-bold text-tb-heading mb-4">Our Mission</h4>
              <p data-edit="about.missionStatement" className="text-tb-body text-lg leading-relaxed">{mission}</p>
            </div>
          )}

          {/* Vision Card — gold */}
          {vision && (
            <div className="bg-tb-primary-400 rounded-xl p-8 h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-6">
                <Icon icon="lucide:eye" className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Our Vision</h4>
              <p data-edit="about.vision" className="text-white text-lg leading-relaxed">{vision}</p>
            </div>
          )}
        </StaggerChildren>

        {/* Core Values — full-width band below both cards, so neither card is
            left with an empty gap and the two stay balanced. */}
        {values.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-tb-primary-500 font-semibold uppercase tracking-wider text-xs mb-4">
              Our Core Values
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {values.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-white border border-tb-border text-tb-heading text-sm rounded-full px-4 py-2 shadow-sm"
                >
                  <Icon icon="lucide:star" className="w-3.5 h-3.5 text-tb-primary-400" />
                  <span data-edit={`about.values.${i}`}>{v}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
