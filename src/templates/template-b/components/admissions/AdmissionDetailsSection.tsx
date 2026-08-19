'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionInfoBody from '@/shared/AdmissionInfoBody'
import { chrome } from './chrome'

/**
 * Template B — the admission details a family reads before applying, straight
 * from the school's `Student Admission` records (so the age windows and fees
 * shown are the ones the application is actually validated against).
 */
export default function AdmissionDetailsSection({ data }: { data: SchoolData }) {
  return (
    <section id="admission-details" className="py-16 md:py-20 bg-tb-background">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">This Session</p>
          <h2 className="text-3xl md:text-4xl font-bold text-tb-heading mb-3">Admission Details</h2>
          <p className="text-tb-body text-lg max-w-2xl mx-auto leading-relaxed">
            What we are admitting into, and what each class asks for.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-tb-border p-6 md:p-10">
          <AdmissionInfoBody chrome={chrome} schoolName={data.name} />
        </div>
      </div>
    </section>
  )
}
