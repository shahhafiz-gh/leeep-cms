import type { SchoolData } from '@/types/school.types'
import HeroSection from '../components/home/HeroSection'
import StatsBand from '../components/home/StatsBand'
import DivisionsSection from '../components/home/DivisionsSection'
import DispatchSection from '../components/home/DispatchSection'

/** Template E ("Ledger") — Home. */
export default function HomeView({ data }: { data: SchoolData }) {
  return (
    <>
      <HeroSection data={data} />
      <StatsBand data={data} />
      <DivisionsSection data={data} />
      <DispatchSection data={data} />
    </>
  )
}
