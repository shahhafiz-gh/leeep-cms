'use client'

import { useState } from 'react'
import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { Container } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'

/**
 * FAQs as ruled disclosure rows. The first opens by default so the answer's
 * type size is visible without interaction and the block never reads as an
 * inert stack of headings.
 */
export default function FaqSection({ data }: { data: SchoolData }) {
  const faqs = useLiveList('admissions.faqs', data.admissions?.faqs ?? [])
  const [openIndex, setOpenIndex] = useState(0)
  if (faqs.length === 0) return null

  return (
    <Container className="py-12 lg:py-14">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr] lg:gap-14">
        <h2 className="m-0 text-[22px] text-te-ink sm:text-[26px]">Questions families ask</h2>
        <div className="flex flex-col border-t border-te-rule">
          {faqs.map((faq, i) => {
            const open = openIndex === i
            return (
              <div key={i} className="border-b border-te-rule">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex w-full items-start justify-between gap-5 py-4 text-left"
                >
                  <span
                    data-edit={`admissions.faqs.${i}.question`}
                    className="font-(family-name:--font-te-serif) text-[16px] text-te-ink sm:text-[17px]"
                  >
                    {faq.question}
                  </span>
                  <span className="mt-0.5 shrink-0 text-[18px] leading-none text-te-accent">
                    {open ? '−' : '+'}
                  </span>
                </button>
                {/* Kept mounted so the inline editor can always reach the answer
                    text, even for a collapsed row. */}
                <p
                  data-edit={`admissions.faqs.${i}.answer`}
                  className={`m-0 text-[15px] leading-[1.65] text-te-body ${open ? 'pb-5 sm:pr-10' : 'hidden'}`}
                >
                  {faq.answer}
                </p>
              </div>
            )
          })}
          <AddItemButton path="admissions.faqs" label="Add question" />
        </div>
      </div>
    </Container>
  )
}
