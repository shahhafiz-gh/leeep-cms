import type { SchoolData } from '@/types/school.types'
import HeroSection from '../components/home/HeroSection'
import StatsSection from '../components/home/StatsSection'
import ProgramsSection from '../components/home/ProgramsSection'
import QuoteSection from '../components/home/QuoteSection'
import GallerySection from '../components/home/GallerySection'
import NewsSection from '../components/home/NewsSection'
import AdmissionsCta from '../components/home/AdmissionsCta'

/** Template D ("Quill") — Home. */
export default function HomeView({ data }: { data: SchoolData }) {
  return (
    <>
      <HeroSection data={data} />
      <StatsSection data={data} />
      <ProgramsSection data={data} />
      <QuoteSection data={data} />
      <GallerySection data={data} />
      <NewsSection data={data} />
      <AdmissionsCta data={data} />
    </>
  )
}
