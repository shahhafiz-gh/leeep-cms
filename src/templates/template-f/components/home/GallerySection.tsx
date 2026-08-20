'use client'

import Link from 'next/link'
import type { SchoolData, GalleryImage } from '@/types/school.types'
import { useGalleryImages } from '@/shared/hooks/useGalleryImages'
import Photo from '../common/Photo'
import { SectionHead } from '../common/Bits'
import { gridCols } from '@/shared/utils/grid'

const SPEEDS: Record<string, string> = { slow: '90s', medium: '60s', fast: '38s' }

/**
 * Almanac's gallery — two bands of photographs drifting in opposite directions,
 * captions surfacing on hover.
 *
 * Where Quill arranges the same photos into a static mosaic, Almanac keeps them
 * moving: a school's photo set grows all year, and a drifting band shows far
 * more of it in the same vertical space than a grid does. The two rows travel
 * opposite ways so the block reads as one composition rather than as a strip
 * that happens to repeat.
 *
 * The whole marquee pauses on hover — hovering is how a caption is read, so it
 * must also be how the motion stops. A photo carrying an `eventId` becomes a
 * link to that event on /updates, which is what ties an album to the thing it
 * documents.
 *
 * `motion: 'static grid'` falls back to a plain grid, and reduced-motion users
 * get the animation disabled in CSS regardless.
 */
export default function GallerySection({ data }: { data: SchoolData }) {
  const images = useGalleryImages(data.gallery?.images ?? [])
  if (images.length === 0) return null

  const speed = SPEEDS[data.gallery?.speed ?? ''] ?? SPEEDS.medium
  // A marquee needs enough tiles to fill a row twice over; below six the seam
  // becomes visible and a grid simply reads better.
  const marquee = (data.gallery?.motion ?? 'marquee') === 'marquee' && images.length >= 6

  /** One tile. `i` is the index in the ORIGINAL array, so `data-edit` keeps
   *  pointing at the right photo even inside the duplicated marquee track. */
  const tile = (
    image: GalleryImage,
    i: number,
    clone = false,
    fixedWidth = false,
  ) => {
    const frame = (
      <div
        className={`relative h-full overflow-hidden rounded-[20px] ${
          fixedWidth ? 'w-[clamp(200px,26vw,320px)] shrink-0' : 'w-full'
        }`}
      >
        <Photo
          fill
          src={image.src}
          alt={image.alt || `Campus photo ${i + 1}`}
          caption={image.alt || 'campus photo'}
          // Only the ORIGINAL track is an edit target: two elements bound to one
          // path fight each other in the inline editor.
          editPath={clone ? undefined : `gallery.images.${i}.src`}
          className="h-full w-full"
        />
        {image.alt && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pt-10 pb-4 text-[14px] leading-[1.35] font-medium text-white opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100">
            {image.alt}
            {image.eventId && (
              <span className="text-[11.5px] font-semibold tracking-[0.1em] text-tf-accent-soft uppercase">
                View event →
              </span>
            )}
          </span>
        )}
      </div>
    )

    // A tile with an event opens it; one without is not a link, so it never
    // offers a click that goes nowhere.
    return image.eventId ? (
      <Link
        href={`/updates#${image.eventId}`}
        tabIndex={clone ? -1 : undefined}
        aria-hidden={clone || undefined}
        className="group/tile block h-full rounded-[20px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tf-accent"
      >
        {frame}
      </Link>
    ) : (
      <div className="group/tile h-full" aria-hidden={clone || undefined}>
        {frame}
      </div>
    )
  }

  const head = (
    <SectionHead
      title={data.gallery?.title || 'Life on campus'}
      editPath="gallery.title"
      href="/updates"
      linkLabel="See what's on"
    />
  )

  /* ── Static grid ───────────────────────────────────────────────────────── */
  if (!marquee) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-20">
        {head}
        <div
          className={`grid auto-rows-[180px] gap-5 lg:auto-rows-[260px] ${gridCols(images.length, 3)}`}
        >
          {images.map((image, i) => (
            <div key={`${image.src}-${i}`}>{tile(image, i)}</div>
          ))}
        </div>
      </section>
    )
  }

  /* ── Marquee ───────────────────────────────────────────────────────────────
     Split into two bands. Each track holds its images twice so the -50% loop is
     seamless; the second copy is inert (aria-hidden + untabbable). */
  const half = Math.ceil(images.length / 2)
  const bands = [
    { items: images.slice(0, half), offset: 0, cls: 'tf-marquee-l' },
    { items: images.slice(half), offset: half, cls: 'tf-marquee-r' },
  ]

  return (
    <section className="pb-16 lg:pb-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        {head}
        {data.gallery?.subtitle && (
          <p
            data-edit="gallery.subtitle"
            className="m-0 -mt-4 mb-9 max-w-[62ch] text-[16px] leading-[1.6] text-tf-muted"
          >
            {data.gallery.subtitle}
          </p>
        )}
      </div>

      {/* Full-bleed, and pausing as one unit so hovering either band holds both
          still rather than half-freezing the composition. */}
      <div
        className="group/marquee tf-marquee-mask flex flex-col gap-4"
        style={{ '--tf-speed': speed } as React.CSSProperties}
      >
        {bands.map((band) => (
          <div key={band.cls} className="overflow-hidden">
            <div
              className={`${band.cls} flex w-max gap-4 group-hover/marquee:[animation-play-state:paused]`}
            >
              {[false, true].map((clone) =>
                band.items.map((image, k) => (
                  <div
                    key={`${clone ? 'c' : 'o'}-${image.src}-${k}`}
                    className="h-[190px] lg:h-[250px]"
                  >
                    {tile(image, band.offset + k, clone, true)}
                  </div>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
