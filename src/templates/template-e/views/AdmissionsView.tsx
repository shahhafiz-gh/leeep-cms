import type { SchoolData } from '@/types/school.types'
import { Container, PageIntro } from '../components/common/Bits'
import ProcessGrid from '../components/admissions/ProcessGrid'
import TuitionSection from '../components/admissions/TuitionSection'
import AdmissionDetailsSection from '../components/admissions/AdmissionDetailsSection'
import FaqSection from '../components/admissions/FaqSection'

/**
 * Template E ("Ledger") — Admissions.
 *
 * An INFORMATION page: the process, tuition, and the live admission details from
 * `Student Admission`. The form is a separate page (`/admissions/apply`), so a
 * school can keep this page useful even when it is not admitting.
 */
export default function AdmissionsView({ data }: { data: SchoolData }) {
  return (
    <>
      <Container className="pt-10 sm:pt-12 lg:pt-14">
        <PageIntro
          title={data.admissions?.title}
          titlePath="admissions.title"
          lede={data.admissions?.description}
          ledePath="admissions.description"
        />
      </Container>
      <ProcessGrid data={data} />
      <TuitionSection data={data} />
      {/* A school can switch the online form off and keep this an
          information-only page. */}
      {data.admissions?.formEnabled !== false && <AdmissionDetailsSection data={data} />}
      <FaqSection data={data} />
    </>
  )
}
