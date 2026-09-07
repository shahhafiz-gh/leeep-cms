'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { isSectionVisible } from '@/shared/section-visibility'
import { parseVideo } from '@/shared/video-embed'

/**
 * The school's published videos.
 *
 * Rendered as click-to-play FACADES, not embeds. A school that has posted
 * fifteen videos would otherwise load fifteen third-party players on one page —
 * megabytes of script, and a tracking request per tile before the visitor has
 * asked to watch anything. Each tile is a poster and a play button until it is
 * clicked; only then is an iframe created, and only for that one video.
 *
 * Shared rather than per-template: nothing here is styled to one theme beyond
 * the tokens passed in via `accentClass`.
 */
export default function VideoGallery({
  data,
  accentClass = 'bg-tb-primary-400',
  headingClass = 'text-tb-secondary',
  bodyClass = 'text-tb-body',
}: {
  data: SchoolData
  accentClass?: string
  headingClass?: string
  bodyClass?: string
}) {
  const gallery = data.videoGallery
  const videos = (gallery?.videos ?? []).filter((v) => parseVideo(v.url))
  const [playing, setPlaying] = useState<string | null>(null)

  if (!videos.length || !isSectionVisible(data, 'videoGallery')) return null

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 data-edit="videoGallery.title" className={`text-2xl font-bold md:text-3xl ${headingClass}`}>
            {gallery?.title || 'Video Gallery'}
          </h2>
          <span className={`mx-auto mt-4 block h-[3px] w-14 ${accentClass}`} />
          {gallery?.subtitle && (
            <p data-edit="videoGallery.subtitle" className={`mx-auto mt-4 max-w-2xl text-sm leading-7 ${bodyClass}`}>
              {gallery.subtitle}
            </p>
          )}
        </div>

        <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => {
            const parsed = parseVideo(video.url)!
            const key = `${parsed.provider}-${parsed.id}-${i}`
            const poster = video.thumbnail || parsed.posterUrl
            const isPlaying = playing === key

            return (
              <figure key={key} className="flex flex-col overflow-hidden bg-white shadow-[0_10px_30px_rgba(34,34,34,0.06)]">
                <div className="relative aspect-video bg-black">
                  {isPlaying ? (
                    <iframe
                      src={parsed.embedUrl}
                      title={video.title || `Video ${i + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(key)}
                      aria-label={video.title ? `Play ${video.title}` : `Play video ${i + 1}`}
                      className="group absolute inset-0 h-full w-full"
                    >
                      {poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={poster}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center bg-neutral-900 text-white/40">
                          <Icon icon="lucide:video" className="h-10 w-10" />
                        </span>
                      )}
                      <span className="absolute inset-0 grid place-items-center bg-black/25 transition-colors group-hover:bg-black/40">
                        <span className={`grid h-16 w-16 place-items-center rounded-full text-white shadow-lg transition-transform group-hover:scale-110 ${accentClass}`}>
                          <Icon icon="lucide:play" className="ml-1 h-7 w-7" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>

                {(video.title || video.description) && (
                  <figcaption className="p-5">
                    {video.title && (
                      <h3 data-edit={`videoGallery.videos.${i}.title`} className={`text-[15px] font-semibold ${headingClass}`}>
                        {video.title}
                      </h3>
                    )}
                    {video.description && (
                      <p data-edit={`videoGallery.videos.${i}.description`} className={`mt-2 text-sm leading-6 ${bodyClass}`}>
                        {video.description}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
