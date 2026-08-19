'use client'

import type { SchoolData } from '@/types/school.types'
import AdmissionInfoBody from '@/shared/AdmissionInfoBody'
import { Container } from '../common/Bits'
import { chrome } from './chrome'

/**
 * Ledger — the admission details a family reads before applying, straight from
 * the school's `Student Admission` records (so the age windows and fees shown
 * are the ones the application is actually validated against).
 */
export default function AdmissionDetailsSection({ data }: { data: SchoolData }) {
  return (
    <div id="admission-details" className="mt-12 border-t border-te-rule py-12 lg:mt-14 lg:py-14">
      <Container>
        <div className="mb-9 max-w-[720px]">
          <h2 className="m-0 mb-3 text-[26px] text-te-ink sm:text-[32px]">This session&apos;s admissions</h2>
          <p className="m-0 text-[16px] leading-[1.7] text-te-body">
            What we are admitting into, and what each class asks for.
          </p>
        </div>
        <AdmissionInfoBody chrome={chrome} schoolName={data.name} />
      </Container>
    </div>
  )
}
