'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'

/**
 * FAQs as ruled rows that open in place — no cards, no shadows, matching the
 * design's ruled-list treatment for anything list-shaped and text-only.
 *
 * The first row starts open so the section never reads as an inert stack of
 * headings, and so the answer's type size is visible without interaction.
 */
export default function FaqSection({ data }: { data: SchoolData }) {
  const faqs = useLiveList('admissions.faqs', data.admissions?.faqs ?? [])
  const [openIndex, setOpenIndex] = useState(0)
  if (faqs.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-8 lg:px-12 lg:pb-22">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <h2 className="m-0 text-[32px] text-td-ink sm:text-[38px] lg:text-[42px]">
          Questions families ask
        </h2>

        <div className="flex flex-col border-t border-td-border">
          {faqs.map((faq, i) => {
            const open = openIndex === i
            return (
              <div key={i} className="border-b border-td-border">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span
                    data-edit={`admissions.faqs.${i}.question`}
                    className="text-[17px] font-medium tracking-[-0.015em] text-td-ink lg:text-[18px]"
                  >
                    {faq.question}
                  </span>
                  <Icon
                    icon="lucide:plus"
                    className={`mt-1 h-4 w-4 shrink-0 text-td-accent transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
                  />
                </button>
                {/* Kept mounted so the inline editor can always reach the answer
                    text, even for a collapsed row. */}
                <p
                  data-edit={`admissions.faqs.${i}.answer`}
                  className={`m-0 text-[15.5px] leading-[1.62] text-td-body ${open ? 'pb-6 pr-10' : 'hidden'}`}
                >
                  {faq.answer}
                </p>
              </div>
            )
          })}

          <AddItemButton path="admissions.faqs" label="Add question" />
        </div>
      </div>
    </section>
  )
}
