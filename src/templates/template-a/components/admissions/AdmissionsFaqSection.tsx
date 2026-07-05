'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import { useLiveList } from '@/shared/hooks/useLiveList'

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  return (
    <details className="group border border-ta-outline-variant rounded-lg bg-ta-surface-container-lowest [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4 text-ta-on-surface font-(family-name:--font-ta-label-md) text-ta-label-md font-bold">
        <span data-edit={`admissions.faqs.${index}.question`}>{question}</span>
        <span className="shrink-0 transition duration-300 group-open:-rotate-180">
          <Icon icon="lucide:chevron-down" className="text-xl" />
        </span>
      </summary>
      <p data-edit={`admissions.faqs.${index}.answer`} className="mt-2 px-4 pb-4 font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant leading-relaxed">
        {answer}
      </p>
    </details>
  )
}

export default function AdmissionsFaqSection({ data }: { data: SchoolData }) {
  // Live list: a question added/removed in the builder's form arrives as an
  // `apply-list` broadcast — plain data-edit patching can't create new DOM
  // nodes, so without this the preview only shows it after publishing.
  const faqs = useLiveList('admissions.faqs', data.admissions.faqs ?? [])
  if (faqs.length === 0) return null

  const mid = Math.ceil(faqs.length / 2)
  const left = faqs.slice(0, mid)
  const right = faqs.slice(mid)

  return (
    <section className=" mb-24 bg-ta-surface-container-lowest py-16 md:py-24 print:hidden">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-background mb-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-(family-name:--font-ta-body-lg) text-lg text-ta-on-surface-variant max-w-2xl mx-auto">
            Find answers to common questions about our admission process.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {left.map((faq, i) => <FaqItem key={i} index={i} {...faq} />)}
          </div>
          <div className="space-y-3">
            {right.map((faq, i) => <FaqItem key={mid + i} index={mid + i} {...faq} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
