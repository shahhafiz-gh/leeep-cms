'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { HeroSlide, SchoolData } from '@/types/school.types'

const DEFAULT_SECONDS = 6

/** The builder stores `duration` as text; anything unusable is the default. */
function durationMs(slide: HeroSlide | undefined): number {
  const seconds = Number(slide?.duration)
  return (Number.isFinite(seconds) && seconds >= 2 && seconds <= 60 ? seconds : DEFAULT_SECONDS) * 1000
}

/**
 * Full-width campus photographs that cross-fade, with the copy on a navy wash
 * in the lower left. A slide with no heading is shown as a photograph alone.
 */
export default function HeroSlider({ data }: { data: SchoolData }) {
  const slides = (data.hero?.slides ?? []).filter((slide) => slide.image)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length < 2 || paused) return
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), durationMs(slides[active]))
    return () => window.clearTimeout(timer)
  }, [active, paused, slides])

  if (!slides.length) return null
  const go = (by: number) => setActive((i) => (i + by + slides.length) % slides.length)

  return (
    <section
      className="relative h-[62vh] min-h-[380px] overflow-hidden bg-ts-navy lg:h-[78vh] lg:max-h-[720px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((slide, i) => (
        <div
          key={`${slide.image}-${i}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== active}
        >
          <img
            src={slide.image}
            alt=""
            data-edit-img={`hero.slides.${i}.image`}
            className="h-full w-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
          />
          {(slide.title || slide.subtitle) && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-ts-navy-900/90 via-ts-navy/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0">
                <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8 lg:pb-20">
                  <div className="max-w-2xl border-l-4 border-ts-accent pl-5 text-white">
                    {slide.subtitle && (
                      <p
                        data-edit={`hero.slides.${i}.subtitle`}
                        className="text-xs font-bold uppercase tracking-[0.22em] text-ts-accent sm:text-sm"
                      >
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.title && (
                      <h2
                        data-edit={`hero.slides.${i}.title`}
                        className="mt-2 text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl"
                      >
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p data-edit={`hero.slides.${i}.description`} className="mt-4 text-base leading-7 text-white/85 sm:text-lg">
                        {slide.description}
                      </p>
                    )}
                    {(slide.cta?.label || slide.secondaryCta?.label) && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {slide.cta?.label && slide.cta.href && (
                          <Link
                            href={slide.cta.href}
                            className="rounded-md bg-ts-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-ts-navy hover:bg-ts-accent-600"
                          >
                            {slide.cta.label}
                          </Link>
                        )}
                        {slide.secondaryCta?.label && slide.secondaryCta.href && (
                          <Link
                            href={slide.secondaryCta.href}
                            className="rounded-md border border-white/70 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10"
                          >
                            {slide.secondaryCta.label}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:grid"
          >
            <Icon icon="lucide:chevron-left" className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:grid"
          >
            <Icon icon="lucide:chevron-right" className="h-6 w-6" />
          </button>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all ${i === active ? 'w-8 bg-ts-accent' : 'w-2.5 bg-white/60 hover:bg-white'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
