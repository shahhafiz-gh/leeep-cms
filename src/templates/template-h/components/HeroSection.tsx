'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { HeroSlide, SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'

/** Seconds a slide stays up when the school has not set its own duration. */
const DEFAULT_DURATION_SECONDS = 6

/**
 * How long slide `i` holds, in milliseconds.
 *
 * The builder stores `duration` as a text field, so it arrives as a string —
 * and an empty one for every slide a school has not timed. Anything that is not
 * a sane number of seconds falls back to the default rather than freezing the
 * slider on a `NaN` timeout.
 */
function slideDurationMs(slide: HeroSlide | undefined): number {
  const seconds = Number(slide?.duration)
  if (!Number.isFinite(seconds) || seconds <= 0) return DEFAULT_DURATION_SECONDS * 1000
  // Clamp: a 0.2s slide is a strobe, an hour-long one reads as a broken slider.
  return Math.min(Math.max(seconds, 1), 60) * 1000
}

/** Does this slide have anything to say, or is it a photo on its own? */
function hasCopy(slide: HeroSlide): boolean {
  return Boolean(slide.title || slide.subtitle || slide.description || slide.cta?.label)
}

/**
 * Full-width rotating hero, matching the reference site's slider.
 *
 * The reference used a jQuery plugin; this is the same behaviour without one:
 * a cross-fade between authored slides with dot controls. Every slide carries
 * its OWN copy and its own dwell time — the school authors them as a list in
 * the builder ("Hero slider"), so slide three can hold twice as long as slide
 * one and say something different. A single slide is rendered static, with no
 * timer and no dots, so a school with one photo does not pay for the carousel.
 *
 * Each slide's text is in the DOM whether or not it is the visible one (the
 * inactive ones are hidden), which is what lets the builder's inline editing
 * patch `hero.slides.<i>.title` for the slide being edited rather than only for
 * whichever one happens to be showing.
 */
export default function HeroSection({ data }: { data: SchoolData }) {
  // Owned as a live list so adding, removing or reordering slides in the
  // builder re-renders the whole slider in the preview — `apply-field` patching
  // alone can only rewrite text in slides the demo already drew.
  const slides = useLiveList<HeroSlide>('hero.slides', data.hero?.slides ?? [])
  const [index, setIndex] = useState(0)

  // Re-run per slide, not once for the list: each slide sets the timeout for
  // its own dwell time.
  useEffect(() => {
    if (slides.length < 2) return
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      slideDurationMs(slides[index]),
    )
    return () => clearTimeout(timer)
  }, [index, slides])

  if (!slides.length) return null
  const active = Math.min(index, slides.length - 1)


  return (
    <section className="relative min-h-[460px] overflow-hidden bg-th-heading md:min-h-[600px]">
      {slides.map((slide, i) => (
        <div
          key={`bg-${slide.image}-${i}`}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? 'opacity-100' : 'opacity-0'}`}
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
        <div className="grid w-full max-w-2xl">
          {slides.map((slide, i) => (
            <div
              key={`copy-${i}`}
              aria-hidden={i !== active}
              // Every slide's copy occupies the same grid cell, so the hero does
              // not jump as slides of different lengths cross-fade.
              className={`col-start-1 row-start-1 text-white transition-opacity duration-700 ${
                i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              {slide.subtitle && (
                <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                  <span className="h-0.5 w-9 bg-th-primary" />
                  <span data-edit={`hero.slides.${i}.subtitle`}>{slide.subtitle}</span>
                </div>
              )}
              {slide.title && (
                <h1
                  data-edit={`hero.slides.${i}.title`}
                  className="text-3xl font-bold leading-[1.12] tracking-[-0.02em] sm:text-4xl lg:text-5xl"
                >
                  {slide.title}
                </h1>
              )}
              {slide.description && (
                <p
                  data-edit={`hero.slides.${i}.description`}
                  className="mt-5 max-w-xl text-sm leading-7 text-white/85 md:text-base"
                >
                  {slide.description}
                </p>
              )}
              {/* Buttons belong to a slide that says something. A photo-only
                  slide stays a photo instead of growing a stray call to action. */}
              {hasCopy(slide) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={slide.cta?.href || '/admissions'}
                    className="inline-flex items-center gap-2 bg-th-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-th-primary-600"
                  >
                    <span data-edit={`hero.slides.${i}.cta.label`}>
                      {slide.cta?.label || 'Online Admission'}
                    </span>
                    <Icon icon="lucide:arrow-right" className="h-4 w-4" />
                  </Link>
                  <Link
                    href={slide.secondaryCta?.href || '/about'}
                    className="inline-flex items-center gap-2 border border-white/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-th-heading"
                  >
                    <span data-edit={`hero.slides.${i}.secondaryCta.label`}>
                      {slide.secondaryCta?.label || 'About us'}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        // The dot is 10px to look at; its ::after is the ~26x42px tap target.
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-4">
          {slides.map((slide, i) => (
            <button
              key={`dot-${slide.image}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className={`relative h-2.5 rounded-full transition-all after:absolute after:-inset-x-2 after:-inset-y-4 ${
                i === active ? 'w-7 bg-th-primary' : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
