'use client'

import type { SchoolData, TestimonialData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import Photo from '../common/Photo'
import { Eyebrow } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'

/**
 * Almanac's testimonials.
 *
 * Quill spends this block on a single pull-quote. Almanac shows the whole set,
 * because the section's job here is different: one quote is a statement of tone,
 * several are evidence. One quote can be marked `featured` and is pulled to the
 * front at double width in the serif — so the block still opens with a voice
 * rather than with a wall of equal cards.
 *
 * `featured` and `rating` both arrive from builder selects as STRINGS, so both
 * are compared/coerced as such rather than trusted as booleans or numbers.
 */
export default function TestimonialsSection({ data }: { data: SchoolData }) {
  const intro = data.testimonialsIntro
  const all = useLiveList<TestimonialData>('testimonials', data.testimonials ?? [])
  if (all.length === 0) return null

  // Keep each quote's ORIGINAL index: `data-edit` paths must point at the item's
  // real position in the saved array, not at its position after sorting.
  const indexed = all.map((t, i) => ({ t, i }))
  const featured = indexed.filter(({ t }) => t.featured === 'yes')
  const ordered = [...featured, ...indexed.filter(({ t }) => t.featured !== 'yes')]

  const stars = (rating?: number | string) => {
    const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))
    return n === 0 ? null : '★'.repeat(n) + '☆'.repeat(5 - n)
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-20">
      <div className="mb-9 flex flex-col gap-3">
        <Eyebrow data-edit="testimonialsIntro.subtitle">
          {intro?.subtitle || 'Testimonials'}
        </Eyebrow>
        <h2
          data-edit="testimonialsIntro.title"
          className="max-w-[16ch] text-[34px] leading-[1.05] text-tf-ink sm:text-[42px] lg:text-[52px]"
        >
          {intro?.title || 'What families tell us'}
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map(({ t, i }) => {
          const isFeatured = t.featured === 'yes'
          const rated = stars(t.rating)
          return (
            <figure
              key={i}
              className={`m-0 flex flex-col gap-5 rounded-[20px] p-7 lg:p-8 ${
                isFeatured
                  ? 'bg-tf-ink sm:col-span-2 lg:row-span-1'
                  : 'bg-tf-panel'
              }`}
            >
              {rated && (
                <div
                  aria-label={`${Math.round(Number(t.rating) || 0)} out of 5`}
                  className={`text-[14px] tracking-[0.14em] ${isFeatured ? 'text-tf-accent-soft' : 'text-tf-accent'}`}
                >
                  {rated}
                </div>
              )}

              <blockquote
                data-edit={`testimonials.${i}.content`}
                className={`m-0 ${
                  isFeatured
                    ? 'tf-serif text-[24px] leading-[1.3] text-tf-on-ink italic sm:text-[30px] lg:text-[34px]'
                    : 'text-[16px] leading-[1.55] text-tf-body lg:text-[17px]'
                }`}
              >
                {isFeatured ? <>&ldquo;{t.content}&rdquo;</> : t.content}
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3">
                {(t.image || t.avatar) && (
                  <Photo
                    fill
                    src={t.image || t.avatar}
                    alt={t.name}
                    caption="portrait"
                    editPath={`testimonials.${i}.image`}
                    rounded="rounded-full"
                    className="h-11 w-11 shrink-0"
                  />
                )}
                <span className="flex flex-col">
                  <span
                    data-edit={`testimonials.${i}.name`}
                    className={`text-[15px] font-semibold ${isFeatured ? 'text-tf-on-ink' : 'text-tf-ink'}`}
                  >
                    {t.name}
                  </span>
                  {t.role && (
                    <span
                      data-edit={`testimonials.${i}.role`}
                      className={`text-[13.5px] ${isFeatured ? 'text-tf-on-ink-muted' : 'text-tf-muted'}`}
                    >
                      {t.role}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          )
        })}
      </div>

      <AddItemButton path="testimonials" label="Add testimonial" />
    </section>
  )
}
