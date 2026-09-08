import type { SchoolData } from '@/types/school.types'
import PageSection from '@/shared/PageSection'
import PageHero from '@/templates/template-b/components/common/PageHero'
import OurStory from '@/templates/template-b/components/about/OurStory'
import MissionVision from '@/templates/template-b/components/about/MissionVision'
import WhyChooseUs from '@/templates/template-b/components/about/WhyChooseUs'
import Achievements from '@/templates/template-b/components/about/Achievements'
import LeadershipMessages from '../components/LeadershipMessages'
import ManagementStructure from '../components/ManagementStructure'

/**
 * Template H — About.
 *
 * Heritage's About sections, plus the two the old DGS site kept as separate
 * pages: the leadership messages and the organisation chart. That is the whole
 * reason this template has an About view of its own — the sections are the same,
 * the About menu just has more to point at.
 */
export default function AboutView({ data }: { data: SchoolData }) {
  return (
    <div className="font-[family-name:var(--font-hind)] bg-tb-background text-tb-foreground">
      <PageHero
        eyebrow={data.about?.subtitle || 'Dedicated to Excellence'}
        eyebrowEditPath="about.subtitle"
        title={data.about?.title || 'About Our School'}
        titleEditPath="about.title"
        description={data.about?.description}
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
      <LeadershipMessages data={data} />
      <PageSection id="management-structure">
        <ManagementStructure data={data} />
      </PageSection>
      <PageSection id="achievements">
        <Achievements data={data} />
      </PageSection>
    </div>
  )
}
