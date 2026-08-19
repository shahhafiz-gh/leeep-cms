'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionInfoBody from '@/shared/AdmissionInfoBody'
import { chrome } from './chrome'

/**
 * Template A — the admission details a family reads before applying: the open
 * window, its dates, and what each class asks for.
 *
 * Everything comes from the school's `Student Admission` records, so the age
 * windows and fees on the website are the same ones the application is validated
 * against and cannot drift out of date. When nothing is open it says so and
 * offers no route to the form.
 */
export default function AdmissionDetailsSection({ data }: { data: SchoolData }) {
  return (
    <section id="admission-details" className="bg-ta-background py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-background mb-2 tracking-tight">
            Admissions
          </h2>
          <p className="font-(family-name:--font-ta-body-lg) text-lg text-ta-on-surface-variant max-w-2xl mx-auto">
            What we are admitting into this session, and what each class asks for.
          </p>
        </div>
        <div className="bg-ta-surface-container-lowest border border-ta-outline-variant rounded-xl p-6 md:p-10 shadow-sm">
          <AdmissionInfoBody chrome={chrome} schoolName={data.name} />
        </div>
      </div>
    </section>
  )
}
