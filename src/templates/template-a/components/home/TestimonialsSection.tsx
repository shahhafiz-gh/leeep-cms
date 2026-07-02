'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useScrollCarousel } from '@/hooks/useScrollCarousel'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  avatar?: string
  rating?: number
  /** Contract path prefix for inline editing, e.g. "testimonials.0". */
  path?: string
}

export function TestimonialCard({ name, role, content, rating = 5, path }: TestimonialCardProps) {
  return (
    <div className="bg-ta-surface-container-lowest rounded-[24px] shadow-sm border-l-4 border-ta-primary p-8 flex flex-col h-full hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex text-amber-400 mb-6 space-x-1">
        {[...Array(rating)].map((_, i) => (
          <Icon key={i} icon="solar:star-bold" className="text-[18px] fill-current" />
        ))}
      </div>

      <p className="font-(family-name:--font-ta-body-md) italic text-ta-on-surface mb-8 grow leading-relaxed">
        &ldquo;<span data-edit={path ? `${path}.content` : undefined}>{content}</span>&rdquo;
      </p>

      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-ta-outline-variant/30">
        <div className="w-12 h-12 shrink-0 bg-ta-primary/10 rounded-full flex items-center justify-center text-ta-primary group-hover:bg-ta-primary group-hover:text-ta-on-primary transition-all duration-500">
          <Icon icon="lucide:user" className="text-2xl" />
        </div>
        <div>
          <div data-edit={path ? `${path}.name` : undefined} className="font-(family-name:--font-ta-h3) text-[16px] text-ta-on-surface leading-tight mb-1">{name}</div>
          <div data-edit={path ? `${path}.role` : undefined} className="font-(family-name:--font-ta-label-md) text-[13px] text-ta-on-surface-variant leading-none">{role}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialHeader() {
  return (
    <div className="text-center mb-16 flex flex-col items-center">
      <ScrollReveal>
        <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-[14px] mb-4 inline-block font-medium">
          Testimonials
        </div>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <h2 className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-surface mb-2 leading-tight">
          Hear From Our Families
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <p className="font-(family-name:--font-ta-body-md) text-ta-on-surface-variant max-w-[460px] mx-auto text-lg">
          Discover why families choose us for a balanced, rigorous, and supportive educational environment.
        </p>
      </ScrollReveal>
    </div>
  )
}

export default function TestimonialsSection({ data }: { data: SchoolData }) {
  // Own the array so an added testimonial (a new index the demo scaffold lacks)
  // appears live — index-based DOM overlays can only patch existing cards.
  const testimonials = useLiveList('testimonials', data.testimonials ?? [])
  const { scrollRef, prev, next, canScrollPrev, canScrollNext } = useScrollCarousel<HTMLDivElement>(testimonials.length)

  if (testimonials.length === 0) return null

  return (
    <section className="bg-ta-surface">
      <div className="w-full overflow-hidden leading-none h-(--spacing-ta-xxl)] flex items-end rotate-180 mb-16">
        <svg className="w-full h-[40px] relative z-10" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="var(--color-ta-primary)" opacity=".05" />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="var(--color-ta-primary)" opacity=".1" />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="var(--color-ta-primary-container)" opacity=".2" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 pb-24">
        <TestimonialHeader />

        <div className="relative w-full mx-auto">
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-16 z-10">
            <button
              onClick={prev}
              disabled={!canScrollPrev}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border border-ta-outline-variant/50 bg-ta-surface flex items-center justify-center text-ta-on-surface hover:bg-ta-surface-container hover:text-ta-primary hover:border-ta-primary transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-16 z-10">
            <button
              onClick={next}
              disabled={!canScrollNext}
              aria-label="Next testimonial"
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
            {testimonials.map((t, i) => (
              <div
                key={t.id ?? i}
                data-slide
                data-slide-idx={i}
                className="snap-start shrink-0 w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                <TestimonialCard
                  path={`testimonials.${i}`}
                  name={t.name}
                  role={t.role}
                  content={t.content}
                  rating={t.rating != null ? Number(t.rating) : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        <AddItemButton path="testimonials" label="Add testimonial" />
      </div>
    </section>
  )
}
