import type { SchoolData } from '@/types/school.types'
import { Container } from '../components/common/Bits'
import ApplicationForm from '../components/admissions/ApplicationForm'
import BackToAdmissions from '@/shared/BackToAdmissions'

/** Template E ("Ledger") — the application form on its own page. */
export default function AdmissionsApplyView({ data }: { data: SchoolData }) {
  return (
    <>
      <Container className="pt-10 sm:pt-12 lg:pt-14">
        <BackToAdmissions className="inline-flex items-center gap-2 text-[13px] font-semibold text-te-accent hover:underline" />
      </Container>
      <ApplicationForm data={data} />
    </>
  )
}
