import type { SchoolData } from '@/types/school.types'
import { Container, PageIntro } from '../components/common/Bits'
import ProcessGrid from '../components/admissions/ProcessGrid'
import TuitionSection from '../components/admissions/TuitionSection'
import ApplicationForm from '../components/admissions/ApplicationForm'
import FaqSection from '../components/admissions/FaqSection'

/** Template E ("Ledger") — Admissions. */
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
      {/* The form is the point of the page — but a school can switch it off and
          keep the process, fees and FAQs as an information-only page. */}
      {data.admissions?.formEnabled !== false && <ApplicationForm data={data} />}
      <FaqSection data={data} />
    </>
  )
}
