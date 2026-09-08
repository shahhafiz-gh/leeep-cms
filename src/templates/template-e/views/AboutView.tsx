import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import AboutIntro from '../components/about/AboutIntro'
import GlanceSection from '../components/about/GlanceSection'
import LeadershipSection from '../components/about/LeadershipSection'

/** Template E ("Ledger") — About. */
export default function AboutView({ data }: { data: SchoolData }) {
  return (
    <div className="pb-14 lg:pb-16">
      <PageSection id="story">
        <AboutIntro data={data} />
      </PageSection>
      <GlanceSection data={data} />
      <LeadershipSection data={data} />
    </div>
  )
}
