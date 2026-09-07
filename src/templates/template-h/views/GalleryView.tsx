import type { SchoolData } from '@/types/school.types'
import { HeritageGalleryView } from '@/shared/views/GalleryViews'
import VideoGallery from '@/shared/VideoGallery'

/**
 * Photos then videos on one Gallery page.
 *
 * The old site split these across Event Gallery / Image Gallery / Video Gallery.
 * They are one route here — the albums the photo gallery already supports cover
 * the event/image split, and the videos sit below them rather than behind a
 * third nav item nobody clicked.
 */
export default function GalleryView({ data }: { data: SchoolData }) {
  return (
    <>
      <HeritageGalleryView data={data} />
      <div className="bg-th-paper">
        <VideoGallery
          data={data}
          accentClass="bg-th-primary"
          headingClass="text-th-heading"
          bodyClass="text-th-body"
        />
      </div>
    </>
  )
}
