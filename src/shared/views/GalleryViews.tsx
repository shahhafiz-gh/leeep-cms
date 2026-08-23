import type { SchoolData } from '@/types/school.types'
import GalleryPage, { type GalleryVariant } from '@/shared/GalleryPage'

const view = (variant: GalleryVariant) => function GalleryView({ data }: { data: SchoolData }) {
  return <GalleryPage data={data} variant={variant} />
}

export const WillowGalleryView = view('willow')
export const HeritageGalleryView = view('heritage')
export const QuillGalleryView = view('quill')
export const LedgerGalleryView = view('ledger')
export const AlmanacGalleryView = view('almanac')
