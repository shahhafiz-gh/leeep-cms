import type { SchoolData } from '@/types/school.types'
import AdmissionsHero from '../components/admissions/AdmissionsHero'
import FaqSection from '../components/admissions/FaqSection'
import { isSectionVisible } from '@/shared/section-visibility'

/**
 * Template F ("Almanac") — Admissions.
 *
 * An INVITATION page: who to talk to, and a way in. The session's live
 * admission details (which classes are open, their age windows, the rules) are
 * NOT repeated here — they are the first step of the application itself
 * (`/admissions/apply`), where a family reads them and accepts them in one
 * move instead of scrolling past them twice.
 */
export default function AdmissionsView({
  data,
  editing = false,
}: {
  data: SchoolData
  editing?: boolean
}) {
  return (
    <>
      <AdmissionsHero data={data} editing={editing} />
      {/* "Questions families ask" is the block schools most often want gone —
          it is the one whose content dates fastest. Hideable rather than
          deleted, so the answers survive being switched off. */}
      {isSectionVisible(data, 'admissionsFaqs') && <FaqSection data={data} />}
    </>
  )
}
