import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import AboutHero from '../components/about/AboutHero'
import OurStory from '../components/about/OurStory'
import MissionSection from '../components/about/MissionSection'
import WhyChooseUsSection from '../components/home/WhyChooseUsSection'
import Achievements from '../components/about/Achievements'

/** Template A — About Page View (IEIskp style) */
export default function AboutView({ data }: { data: SchoolData }) {
  return (
    <div className="font-(family-name:--font-ta-body) bg-ta-background text-ta-on-background">
      <AboutHero data={data} />
      <PageSection id="story">
        <OurStory data={data} />
      </PageSection>
      <PageSection id="vision-mission">
        <MissionSection data={data} />
      </PageSection>
      <PageSection id="why-choose">
        <WhyChooseUsSection data={data} />
      </PageSection>
      <PageSection id="achievements">
        <Achievements data={data} />
      </PageSection>
    </div>
  )
}
