import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { isSectionVisible } from '@/shared/section-visibility'

/**
 * Parent and alumni quotes, in the reference site's card grid.
 *
 * Written for this template for the same reason as ProgramsSection: Heritage's
 * equivalent hardcodes its gold accent rather than reading a token, so the
 * `.template-h` remap cannot re-theme it.
 */
export default function TestimonialsSection({ data }: { data: SchoolData }) {
  const testimonials = data.testimonials ?? []
  if (!testimonials.length || !isSectionVisible(data, 'testimonials')) return null

  const intro = data.testimonialsIntro

  return (
    <section className="bg-th-paper py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-th-primary">
            {intro?.title || 'Testimonials'}
          </p>
          <h2 className="mt-3 text-2xl font-bold text-th-heading md:text-3xl">
            {intro?.subtitle || 'What families say about us'}
          </h2>
          <span className="mx-auto mt-4 block h-[3px] w-14 bg-th-primary" />
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => {
            const rating = Number(item.rating)
            const portrait = item.image || item.avatar
            return (
              <figure
                key={item.id || `${item.name}-${i}`}
                className="relative flex flex-col bg-white p-7 shadow-[0_10px_30px_rgba(34,34,34,0.06)]"
              >
                <Icon
                  icon="lucide:quote"
                  className="absolute right-6 top-6 h-8 w-8 text-th-primary-100"
                  aria-hidden
                />
                {Number.isFinite(rating) && rating > 0 && (
                  <div className="mb-4 flex gap-0.5" aria-label={`${rating} out of 5`}>
                    {Array.from({ length: 5 }, (_, star) => (
                      <Icon
                        key={star}
                        icon="lucide:star"
                        className={`h-4 w-4 ${star < rating ? 'text-th-primary' : 'text-th-border'}`}
                      />
                    ))}
                  </div>
                )}
                <blockquote
                  data-edit={`testimonials.${i}.content`}
                  className="flex-1 text-[15px] leading-8 text-th-body"
                >
                  {item.content}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-th-line pt-5">
                  {portrait ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={portrait}
                      alt={item.name}
                      data-edit-img={`testimonials.${i}.image`}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-th-primary-50 text-sm font-semibold text-th-primary">
                      {item.name?.charAt(0) || '?'}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span
                      data-edit={`testimonials.${i}.name`}
                      className="block text-sm font-semibold text-th-heading"
                    >
                      {item.name}
                    </span>
                    {item.role && (
                      <span
                        data-edit={`testimonials.${i}.role`}
                        className="mt-0.5 block text-xs text-th-muted"
                      >
                        {item.role}
                      </span>
                    )}
                  </span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
