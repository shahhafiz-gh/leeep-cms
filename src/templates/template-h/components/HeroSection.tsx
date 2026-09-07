'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

/**
 * Full-width rotating hero, matching the reference site's slider.
 *
 * The reference used a jQuery plugin; this is the same behaviour in ~40 lines:
 * a cross-fade between authored slides with dot controls. A single slide is
 * rendered static, with no timer and no dots, so a school that only has one
 * photo does not pay for the carousel.
 */
export default function HeroSection({ data }: { data: SchoolData }) {
  const slides = data.hero?.slides ?? []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!slides.length) return null
  const current = slides[Math.min(index, slides.length - 1)]

  return (
    <section className="relative min-h-[460px] overflow-hidden bg-th-heading md:min-h-[600px]">
      {slides.map((slide, i) => (
        <div
          key={`${slide.image}-${i}`}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.video ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={slide.image}
              data-edit-img={`hero.slides.${i}.image`}
              data-video-target={`hero.slides.${i}.video`}
              className="h-full w-full object-cover"
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.image}
              alt=""
              data-edit-img={`hero.slides.${i}.image`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,20,0.82)_0%,rgba(20,20,20,0.55)_48%,rgba(20,20,20,0.15)_100%)]" />

      <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center px-4 py-16 md:min-h-[600px] lg:px-8">
        <div className="max-w-2xl text-white">
          {current.subtitle && (
            <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
              <span className="h-0.5 w-9 bg-th-primary" />
              <span data-edit={`hero.slides.${index}.subtitle`}>{current.subtitle}</span>
            </div>
          )}
          <h1
            data-edit={`hero.slides.${index}.title`}
            className="text-3xl font-bold leading-[1.12] tracking-[-0.02em] sm:text-4xl lg:text-5xl"
          >
            {current.title}
          </h1>
          {current.description && (
            <p
              data-edit={`hero.slides.${index}.description`}
              className="mt-5 max-w-xl text-sm leading-7 text-white/85 md:text-base"
            >
              {current.description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={current.cta?.href || '/admissions'}
              className="inline-flex items-center gap-2 bg-th-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-th-primary-600"
            >
              <span data-edit={`hero.slides.${index}.cta.label`}>{current.cta?.label || 'Online Admission'}</span>
              <Icon icon="lucide:arrow-right" className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-white/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-th-heading"
            >
              About us
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={`dot-${slide.image}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? 'w-7 bg-th-primary' : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
