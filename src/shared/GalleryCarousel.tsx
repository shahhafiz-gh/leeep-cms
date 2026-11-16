'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '@iconify/react'
import type { GalleryImage } from '@/types/school.types'

const AUTOPLAY_MS = 4500

/**
 * Home-page gallery carousel, shared by every template that has a gallery
 * section. Native horizontal scroll with snap points (so touch swipe and
 * trackpads just work), plus prev/next buttons and gentle autoplay.
 *
 * Autoplay pauses while the pointer or keyboard focus is inside, is off in the
 * editor (a slide sliding away mid-edit would be maddening), and is skipped for
 * reduced-motion users. At the last slide it wraps back to the first.
 *
 * Styling is per template: `renderSlide` draws the photo and `buttonClassName`
 * skins the arrows; this component only owns the scrolling.
 */
export default function GalleryCarousel({
  images,
  renderSlide,
  buttonClassName = '',
  autoplay = true,
  slideClassName = 'aspect-[4/3]',
}: {
  images: GalleryImage[]
  renderSlide: (image: GalleryImage, index: number) => ReactNode
  buttonClassName?: string
  autoplay?: boolean
  slideClassName?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(images.length > 1)
  const [paused, setPaused] = useState(false)

  /** Width of one step: a slide plus the track's gap. */
  const step = useCallback(() => {
    const track = trackRef.current
    const slide = track?.querySelector<HTMLElement>('[data-slide]')
    if (!track || !slide) return 0
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    return slide.offsetWidth + gap
  }, [])

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 4)
  }, [])

  const move = useCallback(
    (dir: 1 | -1, wrap = false) => {
      const track = trackRef.current
      if (!track) return
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4
      if (wrap && dir === 1 && atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }
      track.scrollBy({ left: dir * step(), behavior: 'smooth' })
    },
    [step],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update, images.length])

  useEffect(() => {
    if (!autoplay || paused || images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => move(1, true), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [autoplay, paused, images.length, move])

  const scrollable = canPrev || canNext

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="School gallery"
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 md:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <div
            // Index key: edit paths are index-based, so each slot stays bound to
            // its position after the admin reorders the gallery.
            key={i}
            data-slide
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
            className={`relative w-[85%] shrink-0 snap-start overflow-hidden sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] ${slideClassName}`}
          >
            {renderSlide(image, i)}
          </div>
        ))}
      </div>

      {scrollable && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canPrev}
            aria-label="Previous photo"
            className={`grid h-11 w-11 place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${buttonClassName}`}
          >
            <Icon icon="lucide:arrow-left" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label="Next photo"
            className={`grid h-11 w-11 place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${buttonClassName}`}
          >
            <Icon icon="lucide:arrow-right" className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
