import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'

/**
 * Quill hero — an oversized display line whose second clause drops into the
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

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-6 pt-8 md:px-8 md:pt-10 lg:px-12 lg:pb-6 lg:pt-11">
      <h1 className="m-0 mb-8 max-w-[16ch] text-[42px] leading-[1.02] tracking-[-0.04em] text-td-ink sm:text-[58px] lg:mb-9 lg:text-[76px] lg:leading-[0.98] lg:tracking-[-0.045em] xl:text-[94px]">
        <span data-edit="hero.slides.0.title">{slide.title}</span>
        {slide.subtitle && (
          <>
            {' '}
            <span data-edit="hero.slides.0.subtitle" className="td-serif italic text-td-accent">
              {slide.subtitle}
            </span>
          </>
        )}
      </h1>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* `fill` so the photo matches the height of the card stack beside it
            instead of dictating it from its own aspect ratio. */}
        <Photo
          priority
          fill
          src={slide.image}
          alt={slide.title}
          caption="hero photo — campus or students"
          editPath="hero.slides.0.image"
          className="h-[280px] w-full sm:h-[380px] lg:h-auto lg:min-h-[440px]"
        />

        <div className="flex flex-col gap-5">
          {/* Ink card — who the school is, in its own words. */}
          <div className="flex flex-1 flex-col justify-between gap-6 rounded-[20px] bg-td-ink p-8">
            <p
              data-edit="hero.slides.0.description"
              className="m-0 text-[17px] leading-[1.55] text-td-on-ink-body lg:text-[19px]"
            >
              {slide.description || data.tagline}
            </p>
            <Link href="/about" className="text-[15px] font-semibold text-td-on-ink transition-opacity hover:opacity-80">
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
            className="flex flex-col gap-1.5 rounded-[20px] bg-td-accent px-8 py-7 text-white transition-opacity hover:opacity-95"
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
