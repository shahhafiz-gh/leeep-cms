import type { SchoolData } from '@/types/school.types'
import { renderBlocks } from '@/lib/render-blocks'
import type { BlockRegistry } from '@/lib/layout'
import HeroSlider from '../components/home/HeroSlider'
import {
  ConnectSection,
  FacilitiesSection,
  GalleryStrip,
  MessageSection,
  NoticeBoard,
  ProspectusSection,
} from '../components/home/HomeSections'

/**
 * Template I ("Scholars") — Home.
 *
 * The default order follows what the school's families already look for first:
 * the campus slider, then notices, events and a word about the school side by
 * side, the director's message, the facilities, the prospectus, recent photos,
 * and finally where to follow and find the school. A school can reorder or hide
 * any block (`data.layout.home`, `data.hiddenSections`; see `lib/layout.ts`).
 */
const BLOCKS: BlockRegistry = {
  hero: HeroSlider,
  notifications: NoticeBoard,
  message: MessageSection,
  facilities: FacilitiesSection,
  prospectus: ProspectusSection,
  gallery: GalleryStrip,
  connect: ConnectSection,
}

export const HOME_BLOCKS = [
  'hero',
  'notifications',
  'message',
  'facilities',
  'prospectus',
  'gallery',
  'connect',
] as const

export default function HomeView({ data, editing }: { data: SchoolData; editing?: boolean }) {
  return <div className="bg-white text-ts-body">{renderBlocks(data, 'home', HOME_BLOCKS, BLOCKS, editing)}</div>
}
