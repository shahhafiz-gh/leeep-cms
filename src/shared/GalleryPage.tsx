import { Icon } from '@iconify/react'
import type { GalleryImage, SchoolData } from '@/types/school.types'

export type GalleryVariant = 'willow' | 'heritage' | 'quill' | 'ledger' | 'almanac'

const themes: Record<GalleryVariant, Record<'page' | 'hero' | 'eyebrow' | 'title' | 'body' | 'rule' | 'panel', string>> = {
  willow: { page: 'bg-ta-background text-ta-on-background pt-20', hero: 'bg-ta-surface', eyebrow: 'text-ta-primary', title: 'font-(family-name:--font-ta-h1) text-ta-on-surface', body: 'text-ta-on-surface-variant', rule: 'border-ta-outline-variant/40', panel: 'bg-ta-surface-container rounded-lg' },
  heritage: { page: 'bg-tb-background text-tb-foreground', hero: 'bg-tb-secondary', eyebrow: 'text-tb-accent', title: 'font-[family-name:var(--font-playfair)] text-white', body: 'text-white/75', rule: 'border-tb-border', panel: 'bg-tb-light-white' },
  quill: { page: 'bg-td-paper text-td-ink', hero: 'bg-td-panel', eyebrow: 'text-td-accent', title: 'font-(family-name:--font-td-display) text-td-ink', body: 'text-td-body', rule: 'border-td-border', panel: 'bg-td-panel' },
  ledger: { page: 'bg-te-paper text-te-ink', hero: 'bg-te-panel', eyebrow: 'text-te-accent', title: 'font-(family-name:--font-te-serif) text-te-ink', body: 'text-te-body', rule: 'border-te-rule', panel: 'bg-te-panel-alt' },
  almanac: { page: 'bg-tf-paper text-tf-ink', hero: 'bg-tf-panel', eyebrow: 'text-tf-accent', title: 'font-(family-name:--font-tf-serif) text-tf-ink', body: 'text-tf-body', rule: 'border-tf-border', panel: 'bg-tf-panel rounded-[20px]' },
}

function PhotoGrid({ images, basePath, panel }: { images: GalleryImage[]; basePath?: string; panel: string }) {
  if (!images.length) return null
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-5">
      {images.map((image, index) => (
        <figure key={`${image.src}-${index}`} className={`group m-0 overflow-hidden ${panel}`}>
          <div className="relative aspect-[4/3] overflow-hidden">
            {image.src ? (
              <img loading="lazy" decoding="async"
                src={image.src}
                alt={image.alt || `Gallery photo ${index + 1}`}
                data-edit-img={basePath ? `${basePath}.${index}.src` : undefined}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full items-center justify-center" data-edit-img={basePath ? `${basePath}.${index}.src` : undefined}>
                <Icon icon="lucide:image-plus" className="h-9 w-9 opacity-40" />
              </div>
            )}
          </div>
          {image.alt && (
            <figcaption data-edit={basePath ? `${basePath}.${index}.alt` : undefined} className="px-3 py-3 text-sm leading-5">
              {image.alt}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}

export default function GalleryPage({ data, variant }: { data: SchoolData; variant: GalleryVariant }) {
  const page = data.galleryPage
  const pageImages = (page?.images ?? []).filter((image) => image.src)
  const homeImages = (data.gallery?.images ?? []).filter((image) => image.src)
  const albums = (page?.albums ?? []).filter((album) => album.title || album.cover || album.images?.some((image) => image.src))
  const eventImages: GalleryImage[] = page?.showEventPhotos === 'yes'
    ? (data.updates?.events ?? []).filter((event) => event.image).map((event) => ({ src: event.image || '', alt: event.title, eventId: event.id }))
    : []
  const t = themes[variant]
  const hasPhotos = pageImages.length || homeImages.length || albums.length || eventImages.length

  return (
    <div className={t.page}>
      <section className={`${t.hero} border-b ${t.rule}`}>
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          {page?.subtitle && <p data-edit="galleryPage.subtitle" className={`mb-4 text-xs font-bold uppercase tracking-[0.16em] ${t.eyebrow}`}>{page.subtitle}</p>}
          <h1 data-edit="galleryPage.title" className={`m-0 max-w-[16ch] text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-7xl ${t.title}`}>{page?.title || data.gallery?.title || 'Gallery'}</h1>
          {(page?.description || data.gallery?.subtitle) && <p data-edit="galleryPage.description" className={`mt-6 max-w-[700px] text-base leading-7 sm:text-lg ${t.body}`}>{page?.description || data.gallery?.subtitle}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        {pageImages.length > 0 && (
          <section>
            <h2 className={`mb-7 text-3xl font-semibold ${t.title}`}>Gallery</h2>
            <PhotoGrid images={pageImages} basePath="galleryPage.images" panel={t.panel} />
          </section>
        )}

        {homeImages.length > 0 && (
          <section className={pageImages.length ? `mt-16 border-t pt-12 ${t.rule}` : ''}>
            <h2 className={`mb-7 text-3xl font-semibold ${t.title}`}>Campus life</h2>
            <PhotoGrid images={homeImages} basePath="gallery.images" panel={t.panel} />
          </section>
        )}

        {albums.map((album, albumIndex) => {
          const images = (album.images ?? []).filter((image) => image.src)
          const albumImages = album.cover ? [{ src: album.cover, alt: `${album.title} cover` }, ...images] : images
          if (!albumImages.length) return null
          return (
            <section key={`${album.title}-${albumIndex}`} className={`mt-16 border-t pt-12 ${t.rule}`}>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                <h2 data-edit={`galleryPage.albums.${albumIndex}.title`} className={`m-0 text-3xl font-semibold ${t.title}`}>{album.title || `Album ${albumIndex + 1}`}</h2>
                {album.date && <p data-edit={`galleryPage.albums.${albumIndex}.date`} className={`m-0 text-sm ${t.body}`}>{album.date}</p>}
              </div>
              <PhotoGrid images={albumImages} basePath={album.cover ? undefined : `galleryPage.albums.${albumIndex}.images`} panel={t.panel} />
            </section>
          )
        })}

        {eventImages.length > 0 && (
          <section className={`mt-16 border-t pt-12 ${t.rule}`}>
            <h2 className={`mb-7 text-3xl font-semibold ${t.title}`}>Events</h2>
            <PhotoGrid images={eventImages} panel={t.panel} />
          </section>
        )}

        {!hasPhotos && (
          <div className={`border p-12 text-center ${t.rule} ${t.panel}`}>
            <Icon icon="lucide:images" className={`mx-auto h-11 w-11 ${t.eyebrow}`} />
            <p className={`mt-4 ${t.body}`}>Photos will appear here soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
