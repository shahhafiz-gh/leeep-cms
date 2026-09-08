import type { SchoolData } from '@/types/school.types'
import { HeritageGalleryView } from '@/shared/views/GalleryViews'
import VideoGallery from '@/shared/VideoGallery'
import PageSection from '@/shared/PageSection'

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
      <PageSection id="photos">
        <HeritageGalleryView data={data} />
      </PageSection>
      <PageSection id="videos">
        <div className="bg-th-paper">
          <VideoGallery
            data={data}
            accentClass="bg-th-primary"
            headingClass="text-th-heading"
            bodyClass="text-th-body"
          />
        </div>
      </PageSection>
    </>
  )
}
