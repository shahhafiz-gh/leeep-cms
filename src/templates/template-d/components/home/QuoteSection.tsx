'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
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
      <div className="rounded-[28px] bg-td-panel px-7 py-12 md:px-12 lg:px-16 lg:py-18">
        {/* No portrait: the quote is the whole panel, so cap the measure — the
            display serif is unreadable run out to the full 1400px. */}
        <div className="flex max-w-[62ch] flex-col gap-6">
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
      </div>

      {/* Outside the panel: editor-only, so it must not sit inside the quote
          block and push its padding around on the live site. */}
      <AddItemButton path="testimonials" label="Add testimonial" />
    </section>
  )
}
