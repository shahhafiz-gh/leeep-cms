'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import Photo from '../common/Photo'
import AddItemButton from '@/shared/AddItemButton'

/**
 * The single large pull-quote — the one place Quill lets the serif carry a whole
 * block. Uses the FIRST testimonial, so the school's strongest voice sets the
 * tone of the home page; the rest of the list stays editable behind the
 * editor-only "add" affordance.
 */
export default function QuoteSection({ data }: { data: SchoolData }) {
  const testimonials = useLiveList('testimonials', data.testimonials ?? [])
  const quote = testimonials[0]
  if (!quote) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-20">
      <div className="grid grid-cols-1 items-center gap-10 rounded-[28px] bg-td-panel px-7 py-12 md:px-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14 lg:px-16 lg:py-18">
        <div className="flex flex-col gap-6">
          <blockquote
            data-edit="testimonials.0.content"
            className="td-serif m-0 text-[26px] leading-[1.28] text-td-ink sm:text-[32px] lg:text-[40px]"
          >
            &ldquo;{quote.content}&rdquo;
          </blockquote>
          <div className="text-[15px] text-td-muted">
            <span data-edit="testimonials.0.name">{quote.name}</span>
            {quote.role && (
              <>
                {' · '}
                <span data-edit="testimonials.0.role">{quote.role}</span>
              </>
            )}
          </div>
        </div>

        <Photo
          src={quote.avatar}
          alt={quote.name}
          caption="portrait"
          editPath="testimonials.0.avatar"
          className="h-[260px] w-full lg:h-[340px]"
        />
      </div>

      {/* Outside the panel grid: a hidden grid ITEM would still open an empty
          row (and its gap) on the live site. */}
      <AddItemButton path="testimonials" label="Add testimonial" />
    </section>
  )
}
