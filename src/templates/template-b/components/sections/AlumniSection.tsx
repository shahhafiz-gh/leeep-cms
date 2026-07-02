'use client'

import type { SchoolData } from '@/types/school.types'
import { Icon } from '@iconify/react'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'

/** Template B — Alumni Section (Kashmir-Cambridge style) */
export default function AlumniSection({ data }: { data: SchoolData }) {
  // Own the array so an added alumnus (a new index the demo scaffold lacks)
  // appears live — index-based DOM overlays can only patch existing cards.
  const alumni = useLiveList('alumni', data.alumni ?? [])
  if (alumni.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-tb-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">Our Pride</p>
          <h2 className="text-3xl md:text-4xl font-bold text-tb-heading mb-4">Where Our Alumni Are Today</h2>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((person, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <Icon icon="ri:double-quotes-l" className="w-8 h-8 text-tb-primary-400/30 mb-4" />
              {/* Always render the quote so a freshly added (empty) alumnus still
                  exposes this field for editing — the placeholder shows when blank. */}
              <p className="text-tb-body text-[15px] italic leading-relaxed mb-6 grow">
                &ldquo;<span data-edit={`alumni.${i}.testimonial`}>{person.testimonial}</span>&rdquo;
              </p>
              <div className="flex  items-center gap-4 mt-auto border-t border-gray-100 pt-5">
                <div className="w-12 h-12 rounded-full bg-tb-primary-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {person.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={person.image} alt={person.name} data-edit-img={`alumni.${i}.image`} className="w-full h-full object-cover" />
                  ) : (
                    <Icon icon="lucide:user" className="w-6 h-6 text-tb-primary-400" />
                  )}
                </div>
                <div className="">
                  <h5 data-edit={`alumni.${i}.name`} className="font-bold text-tb-heading text-sm truncate">{person.name}</h5>
                  <p data-edit={`alumni.${i}.achievement`} className="text-tb-primary-400 text-xs font-semibold">{person.achievement}</p>
                  <p className="text-gray-400 text-xs">Batch <span data-edit={`alumni.${i}.batch`}>{person.batch}</span></p>
                </div>
              </div>
            </div>
          ))}
        </StaggerChildren>

        <AddItemButton path="alumni" label="Add alumnus" />
      </div>
    </section>
  )
}
