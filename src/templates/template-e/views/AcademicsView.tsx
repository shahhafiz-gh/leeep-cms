import type { SchoolData } from '@/types/school.types'
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
      <StreamRows data={data} />
      <MethodSection data={data} />
    </>
  )
}
