import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import { Container, PageIntro } from '../components/common/Bits'
import StreamRows from '../components/academics/StreamRows'
import MethodSection from '../components/academics/MethodSection'

/** Template E ("Ledger") — Academics. */
export default function AcademicsView({ data }: { data: SchoolData }) {
  return (
    <>
      <Container className="pt-10 sm:pt-12 lg:pt-14">
        <PageIntro
          title={data.academics?.title}
          titlePath="academics.title"
          lede={data.academics?.description}
          ledePath="academics.description"
        />
      </Container>
      <PageSection id="streams">
        <StreamRows data={data} />
      </PageSection>
      <PageSection id="methodology">
        <MethodSection data={data} />
      </PageSection>
    </>
  )
}
