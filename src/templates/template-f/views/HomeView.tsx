import type { SchoolData } from '@/types/school.types'
import HeroSection from '../components/home/HeroSection'
import NotificationsSection from '../components/home/NotificationsSection'
import ProgramsSection from '../components/home/ProgramsSection'
import GallerySection from '../components/home/GallerySection'
import SocialSpaceSection from '../components/home/SocialSpaceSection'
import MagazineSection from '../components/home/MagazineSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import NewsSection from '../components/home/NewsSection'
import AdmissionsCta from '../components/home/AdmissionsCta'

/**
 * Template F ("Almanac") — Home.
 *
 * The running order differs from Quill's in one deliberate way: the noticeboard
 * takes the slot directly under the hero, where Quill puts its stats band. On a
 * school site that position belongs to whatever changed this week — the people
 * who visit most are already enrolled and are checking for news, not being sold
 * to. The stats still fill the About page header, so nothing an admin wrote is
 * orphaned by the swap.
 *
 * After that the page alternates paper and ink panels: programmes, the drifting
 * gallery, the social wall (ink), the magazine shelf, testimonials, then events.
 */
export default function HomeView({ data }: { data: SchoolData }) {
  return (
    <>
      <HeroSection data={data} />
      <NotificationsSection data={data} />
      <ProgramsSection data={data} />
      <GallerySection data={data} />
      <SocialSpaceSection data={data} />
      <MagazineSection data={data} />
      <TestimonialsSection data={data} />
      <NewsSection data={data} />
      <AdmissionsCta data={data} />
    </>
  )
}
