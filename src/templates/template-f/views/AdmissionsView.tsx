import type { SchoolData } from '@/types/school.types'
import AdmissionsHero from '../components/admissions/AdmissionsHero'
import AdmissionDetailsSection from '../components/admissions/AdmissionDetailsSection'
import FaqSection from '../components/admissions/FaqSection'
import { isSectionVisible } from '@/shared/section-visibility'

/**
 * Template D ("Almanac") — Admissions.
 *
 * An INFORMATION page: the process and the live admission details from
 * `Student Admission` (which classes are open, their age windows and fees). The
 * form is a separate page (`/admissions/apply`), so a school can keep this page
 * useful even when it is not admitting.
 */
export default function AdmissionsView({ data }: { data: SchoolData }) {
  return (
    <>
      <AdmissionsHero data={data} />
      {/* A school can switch the online form off and keep this an
          information-only page. */}
      {data.admissions?.formEnabled !== false && <AdmissionDetailsSection data={data} />}
      {/* "Questions families ask" is the block schools most often want gone —
          it is the one whose content dates fastest. Hideable rather than
          deleted, so the answers survive being switched off. */}
      {isSectionVisible(data, 'admissionsFaqs') && <FaqSection data={data} />}
    </>
  )
}
