import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import PageHero from '../components/common/PageHero'
import OurStory from '../components/about/OurStory'
import MissionVision from '../components/about/MissionVision'
import WhyChooseUs from '../components/about/WhyChooseUs'
import Achievements from '../components/about/Achievements'

/** Template B — About Page View (Kashmir-Cambridge style) */
export default function AboutView({ data }: { data: SchoolData }) {
  return (
    <div className="font-[family-name:var(--font-hind)] bg-tb-background text-tb-foreground">
      <PageHero
        eyebrow="Dedicated to Excellence"
        title={data.about.title || 'About Our School'}
        titleEditPath="about.title"
        description={data.about.description}
        descriptionEditPath="about.description"
      />
      <PageSection id="story">
        <OurStory data={data} />
      </PageSection>
      <PageSection id="vision-mission">
        <MissionVision data={data} />
      </PageSection>
      <PageSection id="why-choose">
        <WhyChooseUs data={data} />
      </PageSection>
      <PageSection id="achievements">
        <Achievements data={data} />
      </PageSection>
    </div>
  )
}
