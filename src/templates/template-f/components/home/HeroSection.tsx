import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'

/**
 * Almanac hero — an oversized display line whose second clause drops into the
 * serif italic, over a three-panel grid: the photograph, an ink card carrying
 * the school's own description, and an accent card for the live admissions call.
 *
 * The italic clause is the school's `hero.slides.0.subtitle`, so the design's
 * signature two-voice headline stays intact whatever a school writes — no
 * splitting of a sentence the CMS can't reliably split.
 */
export default function HeroSection({ data }: { data: SchoolData }) {
  const slide = data.hero?.slides?.[0]
  if (!slide) return null

  // Where the clip plays. 'background' is the default because it is the more
  // dramatic of the two and the one a school picking "add a video" expects;
  // 'lead image' keeps the composition's framed photo and plays inside it.
  // Compared against the builder's own select values, spaces included.
  const hasVideo = Boolean(slide.video)
  const placement = slide.videoPlacement || 'background'
  const showVideoHere = hasVideo && placement === 'lead image'
  const showVideoBehind = hasVideo && placement === 'background'

  return (
    <section className="relative mx-auto max-w-[1400px] px-5 pt-8 pb-6 md:px-8 md:pt-10 lg:px-12 lg:pt-11 lg:pb-6">
      {showVideoBehind && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[24px]">
          <video
            src={slide.video}
            poster={slide.image || undefined}
            autoPlay
            muted
            loop
            playsInline
            tabIndex={-1}
            className="h-full w-full object-cover"
          />
          {/* The headline sits ON this. Without a scrim the display type fails
              contrast the moment a bright frame comes round. */}
          <div className="absolute inset-0 bg-tf-paper/82" />
        </div>
      )}

      <h1 className="m-0 mb-8 max-w-[16ch] text-[42px] leading-[1.02] tracking-[-0.04em] text-tf-ink sm:text-[58px] lg:mb-9 lg:text-[76px] lg:leading-[0.98] lg:tracking-[-0.045em] xl:text-[94px]">
        <span data-edit="hero.slides.0.title">{slide.title}</span>
        {slide.subtitle && (
          <>
            {' '}
            <span data-edit="hero.slides.0.subtitle" className="tf-serif italic text-tf-accent">
              {slide.subtitle}
            </span>
          </>
        )}
      </h1>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* The lead slot. `fill` so it matches the height of the card stack
            beside it instead of dictating it from its own aspect ratio. */}
        <div className="relative h-[280px] w-full overflow-hidden rounded-[20px] sm:h-[380px] lg:h-auto lg:min-h-[440px]">
          {/* The still is ALWAYS rendered: it is the video's poster and its
              fallback, so a slow connection, a codec the browser won't play, or
              a school that never uploaded a clip all land on the photograph
              rather than on a black rectangle. */}
          <Photo
            fill
            src={slide.image}
            alt={slide.title}
            caption="hero photo — campus or students"
            editPath="hero.slides.0.image"
            rounded=""
            className="absolute inset-0 h-full w-full"
          />
          {showVideoHere && (
            <video
              src={slide.video}
              poster={slide.image || undefined}
              autoPlay
              muted
              loop
              playsInline
              // Decorative: the headline beside it carries the meaning, and an
              // unlabelled autoplaying clip is noise to a screen reader.
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-5">
          {/* Ink card — who the school is, in its own words. */}
          <div className="flex flex-1 flex-col justify-between gap-6 rounded-[20px] bg-tf-ink p-8">
            <p
              data-edit="hero.slides.0.description"
              className="m-0 text-[17px] leading-[1.55] text-tf-on-ink-body lg:text-[19px]"
            >
              {slide.description || data.tagline}
            </p>
            <Link href="/about" className="text-[15px] font-semibold text-tf-on-ink transition-opacity hover:opacity-80">
              Our story →
            </Link>
          </div>

          {/* Accent card — the current admissions call. It MIRRORS the admissions
              copy (data-bind) rather than editing it: the same two fields are
              edited in the Admissions section further down this page, and two
              editable elements for one path would fight each other. */}
          <Link
            href={slide.cta?.href || '/admissions'}
            data-note="This banner shows your Admissions heading. Edit it in the Admissions section and it changes here too."
            data-note-action="Edit in Admissions →"
            data-note-target="admissions.title"
            className="flex flex-col gap-1.5 rounded-[20px] bg-tf-accent px-8 py-7 text-white transition-opacity hover:opacity-95"
          >
            <span
              data-bind="admissions.title"
              className="text-[12px] uppercase tracking-[0.16em] opacity-85"
            >
              {data.admissions?.title || 'Admissions open'}
            </span>
            <span
              data-bind="admissions.subtitle"
              className="text-[24px] font-semibold tracking-[-0.025em] lg:text-[29px]"
            >
              {data.admissions?.subtitle || slide.cta?.label || 'Apply now'}
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
