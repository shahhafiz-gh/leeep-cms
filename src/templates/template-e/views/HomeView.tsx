import type { SchoolData } from '@/types/school.types'
import { renderBlocks } from '@/lib/render-blocks'
import type { BlockRegistry } from '@/lib/layout'
import HeroSection from '../components/home/HeroSection'
import StatsBand from '../components/home/StatsBand'
import DivisionsSection from '../components/home/DivisionsSection'
import DispatchSection from '../components/home/DispatchSection'

/**
 * Template E ("Ledger") — Home.
 *
 * The order below is this template's DEFAULT, not a fixed sequence. A school can
 * reorder or switch off any of these blocks; its choice lives in
 * `data.layout.home` and `data.hiddenSections` (see `lib/layout.ts`). A school
 * that has never touched the layout gets exactly this order.
 */
const BLOCKS: BlockRegistry = {
  hero: HeroSection,
  stats: StatsBand,
  programs: DivisionsSection,
  news: DispatchSection,
}

export const HOME_BLOCKS = [
  'hero',
  'stats',
  'programs',
  'news',
] as const

export default function HomeView({ data, editing }: { data: SchoolData; editing?: boolean }) {
  return <>{renderBlocks(data, 'home', HOME_BLOCKS, BLOCKS, editing)}</>
}
