import type { SchoolData } from '@/types/school.types'
import VideoGallery from '@/shared/VideoGallery'
import PageShell from '../components/PageShell'
import ImagesBlock from '../components/blocks/ImagesBlock'

/**
 * The photo gallery (`galleryPage.images`, then any albums), full width with
 * the shared viewer, followed by the school's videos when it has published any.
 */
export default function GalleryView({ data }: { data: SchoolData; editing?: boolean }) {
  const page = data.galleryPage
  const images = (page?.images?.length ? page.images : data.gallery?.images ?? []).filter((image) => image.src)
  const albums = (page?.albums ?? []).filter((album) => album.images?.some((image) => image.src))

  return (
    <PageShell
      data={data}
      title={page?.title || 'Photo Gallery'}
      summary={page?.subtitle || page?.description}
      titlePath="galleryPage.title"
      summaryPath={page?.subtitle ? 'galleryPage.subtitle' : 'galleryPage.description'}
      wide
    >
      <div className="space-y-12">
        {images.length > 0 && (
          <ImagesBlock
            images={images.map((image) => ({ src: image.src, alt: image.alt }))}
            basePath={page?.images?.length ? 'galleryPage.images' : 'gallery.images'}
          />
        )}
        {albums.map((album, i) => (
          <section key={`${album.title}-${i}`}>
            <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-ts-heading">
              <span className="h-7 w-1.5 rounded-full bg-ts-accent" />
              {album.title}
              {album.date && <span className="text-base font-normal text-ts-muted">{album.date}</span>}
            </h2>
            <ImagesBlock images={(album.images ?? []).map((image) => ({ src: image.src, alt: image.alt }))} />
          </section>
        ))}
      </div>
      {(data.videoGallery?.videos?.length ?? 0) > 0 && (
        <div className="-mx-4 lg:-mx-8">
          <VideoGallery data={data} accentClass="text-ts-primary" headingClass="text-ts-heading" bodyClass="text-ts-body" />
        </div>
      )}
    </PageShell>
  )
}
