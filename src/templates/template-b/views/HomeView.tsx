import type { SchoolData } from '@/types/school.types'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import WhyChooseUs from '../components/about/WhyChooseUs'
import NewsSection from '../components/sections/NewsSection'
import EventsSection from '../components/sections/EventsSection'
import ProgramsSection from '../components/sections/ProgramsSection'
import GallerySection from '../components/sections/GallerySection'
import AlumniSection from '../components/sections/AlumniSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import AdmissionsSection from '../components/sections/AdmissionsSection'

/** Template B — Home Page View (Kashmir-Cambridge style) */
export default function HomeView({ data }: { data: SchoolData }) {
  return (
    <div className="font-(family-name:--font-inter) bg-tb-background text-tb-foreground">
      <HeroSection data={data} />
      <NewsSection data={data} />
      <EventsSection data={data} />
      <AboutSection data={data} />
      <WhyChooseUs data={data} />
      <ProgramsSection data={data} />
      <GallerySection data={data} />
      <AlumniSection data={data} />
      <TestimonialsSection data={data} />
      <AdmissionsSection data={data} />
    </div>
  )
}
