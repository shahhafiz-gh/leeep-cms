'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useScrollCarousel } from '@/hooks/useScrollCarousel'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'

const alumniIcons = [
  'lucide:stethoscope',
  'lucide:cpu',
  'lucide:scale',
  'lucide:calculator',
]

export default function AlumniSection({ data }: { data: SchoolData }) {
  // Own the array so a newly added alumnus (an index the demo scaffold doesn't
  // have) actually appears — the index-based DOM overlay can only patch existing
  // cards, so adds/removes never showed before.
  const alumni = useLiveList('alumni', data.alumni ?? [])
  // Single-column carousel: one full-width card per view, sliding horizontally
  // (mirrors the Testimonials carousel rather than the old 2-col grid).
  const { scrollRef, prev, next, canScrollPrev, canScrollNext } = useScrollCarousel<HTMLDivElement>(alumni.length)

  if (alumni.length === 0) return null

  return (
    <section className="py-(--spacing-ta-xxl)] bg-ta-surface-container-lowest overflow-hidden">
      <div className="container my-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-(length:--text-ta-label-md) mb-4 inline-block">
              Our Pride
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-(family-name:--font-ta-h2) text-(length:--text-ta-h2) text-ta-on-surface mb-4">
              Where Our Alumni Are Today
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-(family-name:--font-ta-body-lg) text-ta-on-surface-variant max-w-2xl mx-auto">
              From medical colleges to engineering institutions, our graduates continue to make us proud across diverse fields.
            </p>
          </ScrollReveal>
        </div>

        {/* Alumni carousel (single column) */}
        <div className="relative w-full mx-auto">
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-16 z-10">
            <button
              onClick={prev}
              disabled={!canScrollPrev}
              aria-label="Previous alumnus"
              className="w-12 h-12 rounded-full border border-ta-outline-variant/50 bg-ta-surface flex items-center justify-center text-ta-on-surface hover:bg-ta-surface-container hover:text-ta-primary hover:border-ta-primary transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-16 z-10">
            <button
              onClick={next}
              disabled={!canScrollNext}
              aria-label="Next alumnus"
              className="w-12 h-12 rounded-full border border-ta-outline-variant/50 bg-ta-surface flex items-center justify-center text-ta-on-surface hover:bg-ta-surface-container hover:text-ta-primary hover:border-ta-primary transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Icon icon="lucide:arrow-right" className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {alumni.map((person, i) => (
              <div key={i} data-slide data-slide-idx={i} className="snap-start max-w-[500px] shrink-0 w-full">
                <div className="group max-w-[500px] relative bg-ta-surface-container-low rounded-3xl p-8 border border-ta-outline-variant/50 hover:border-ta-primary/30 hover:shadow-xl transition-all duration-500 h-full">
                  <Icon
                    icon="lucide:quote"
                    className="absolute top-6 right-6 text-4xl text-ta-primary/10 group-hover:text-ta-primary/20 transition-colors"
                  />
                  <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant leading-relaxed mb-8 italic">
                    &ldquo;<span data-edit={`alumni.${i}.testimonial`}>{person.testimonial}</span>&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-ta-primary-container flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon icon={alumniIcons[i % alumniIcons.length]} className="text-2xl text-ta-on-primary-container" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 data-edit={`alumni.${i}.name`} className="font-(family-name:--font-ta-label-md) text-ta-on-surface font-bold truncate">{person.name}</h3>
                      <p data-edit={`alumni.${i}.achievement`} className="text-ta-primary font-(family-name:--font-ta-label-md) text-sm font-semibold">{person.achievement}</p>
                      <p className="text-ta-on-surface-variant text-xs mt-0.5">Batch <span data-edit={`alumni.${i}.batch`}>{person.batch}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddItemButton path="alumni" label="Add alumnus" />
      </div>
    </section>
  )
}
