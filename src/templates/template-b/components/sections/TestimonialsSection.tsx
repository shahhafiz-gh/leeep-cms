'use client'

import type { SchoolData } from '@/types/school.types'
import { Icon } from '@iconify/react'
import { useRef, useState, useCallback, useEffect } from 'react'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'

/** Template B — Testimonials Section with scroll-snap carousel (KCS style) */
export default function TestimonialsSection({ data }: { data: SchoolData }) {
  // Own the array so an added testimonial (a new index the demo scaffold lacks)
  // appears live — index-based DOM overlays can only patch existing cards.
  const testimonials = useLiveList('testimonials', data.testimonials ?? [])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIdx, setCurrentIdx] = useState(0)

  const scrollTo = useCallback((idx: number) => {
    const container = scrollRef.current
    if (!container) return
    const slides = container.querySelectorAll('[data-slide]')
    if (!slides[idx]) return
    slides[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    setCurrentIdx(idx)
  }, [])

  const prev = () => scrollTo(Math.max(0, currentIdx - 1))
  const next = () => scrollTo(Math.min(testimonials.length - 1, currentIdx + 1))

  // Track which slide is in view
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.slideIdx)
            if (!isNaN(idx)) setCurrentIdx(idx)
          }
        })
      },
      { root: container, threshold: 0.6 }
    )
    container.querySelectorAll('[data-slide]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [testimonials])

  if (testimonials.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-tb-primary-500">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left column */}
          <ScrollReveal direction="left" className="lg:col-span-5">
            <div className="max-w-md">
              <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-3">
                Testimonials
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Parents Feedback
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-10">
                Your opinion matters. By providing feedback, you contribute to the continuous enhancement of our academic programs, support services, and campus life.
              </p>

              {/* Navigation arrows */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={prev}
                  disabled={currentIdx === 0}
                  aria-label="Previous testimonial"
                  className="w-12 h-12 rounded-full border border-white/30 bg-white flex items-center justify-center text-tb-secondary hover:bg-tb-background/80 hover:text-tb-secondary hover:border-tb-primary-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon icon="lucide:arrow-left" className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  disabled={currentIdx >= testimonials.length - 1}
                  aria-label="Next testimonial"
                  className="w-12 h-12 rounded-full border border-white/30 bg-white flex items-center justify-center text-tb-secondary hover:bg-tb-background/80 hover:text-tb-secondary hover:border-tb-primary-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon icon="lucide:arrow-right" className="w-5 h-5" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIdx ? 'bg-white w-6' : 'bg-white/40 w-2'
                      }`}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: scroll-snap carousel */}
          <ScrollReveal direction="right" className="lg:col-span-7">
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-1 px-1"
              style={{ scrollbarWidth: 'none' }}
            >
              {testimonials.map((item, idx) => (
                <div
                  key={item.id ?? idx}
                  data-slide
                  data-slide-idx={idx}
                  className="snap-start shrink-0 w-[min(340px,85vw)]"
                >
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          icon={i < Number(item.rating ?? 5) ? 'lucide:star' : 'lucide:star'}
                          className={`w-4 h-4 ${i < Number(item.rating ?? 5) ? 'text-tb-primary-400 fill-tb-primary-400' : 'text-slate-200'}`}
                          style={i < Number(item.rating ?? 5) ? { fill: '#cba73d' } : {}}
                        />
                      ))}
                    </div>

                    <p className="text-slate-600 text-[15px] leading-relaxed italic mb-7 grow">
                      &ldquo;<span data-edit={`testimonials.${idx}.content`}>{item.content}</span>&rdquo;
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-tb-primary-50 flex items-center justify-center shrink-0">
                          <Icon icon="lucide:user" className="w-5 h-5 text-tb-primary-400" />
                        </div>
                        <div>
                          <h5 data-edit={`testimonials.${idx}.name`} className="font-bold text-tb-secondary text-sm mb-0.5">{item.name}</h5>
                          <span data-edit={`testimonials.${idx}.role`} className="text-xs text-slate-400">{item.role}</span>
                        </div>
                      </div>
                      <Icon icon="ri:double-quotes-r" className="w-8 h-8 text-tb-primary-400/20 shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <AddItemButton path="testimonials" label="Add testimonial" />
      </div>
    </section>
  )
}
