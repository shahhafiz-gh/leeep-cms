'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionInfoBody from '@/shared/AdmissionInfoBody'
import { chrome } from './chrome'

/**
 * Quill — the admission details a family reads before applying, straight from
 * the school's `Student Admission` records (so the age windows and fees shown
 * are the ones the application is actually validated against).
 */
export default function AdmissionDetailsSection({ data }: { data: SchoolData }) {
  return (
    <section
      id="admission-details"
      className="mx-auto max-w-[1400px] px-5 pb-12 md:px-8 lg:px-12"
    >
      <div className="rounded-[28px] border border-td-border bg-td-card px-6 py-10 md:px-10 lg:px-14 lg:py-12">
        <div className="mb-8">
          <h2 className="m-0 mb-2.5 text-[32px] text-td-ink sm:text-[38px]">This session&apos;s admissions</h2>
          <p className="m-0 max-w-[60ch] text-[16px] leading-[1.6] text-td-body">
            What we are admitting into, and what each class asks for.
          </p>
        </div>
        <AdmissionInfoBody chrome={chrome} schoolName={data.name} />
      </div>
    </section>
  )
}
