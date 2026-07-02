import type { SchoolData } from '@/types/school.types'
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
      <OurStory data={data} />
      <MissionSection data={data} />
      <WhyChooseUsSection data={data} />
      <Achievements data={data} />
    </div>
  )
}
