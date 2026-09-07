'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

/** The shared entrance for this hero's copy: fade up, staggered by `delay`.
 *  Spread onto a plain element — the animation itself is CSS (`[data-enter]`). */
const fadeUp = (delay: number) => ({
  'data-enter': true,
  style: { '--reveal-y': '20px', '--reveal-delay': `${delay}s` } as CSSProperties,
})

export default function AboutHero({ data }: { data: SchoolData }) {
  return (
    <section className="relative w-full py-10 md:py-20 mt-20 overflow-hidden bg-ta-surface">
      {/* Decorative floating icons */}
      <div
        className="absolute top-10 left-10 text-ta-primary opacity-30 pointer-events-none"
        data-loop="float"
        style={{ '--loop-distance': '-10px', '--loop-duration': '4s' } as CSSProperties}
      >
        <Icon icon="lucide:pencil" className="text-4xl" />
      </div>
      <div
        className="absolute bottom-20 left-1/2 text-ta-secondary opacity-40 pointer-events-none"
        data-loop="pulse"
        style={{ '--loop-scale': '1.1', '--loop-duration': '5s' } as CSSProperties}
      >
        <Icon icon="lucide:star" className="text-5xl" />
      </div>
      <div
        className="absolute top-32 right-1/4 text-ta-primary opacity-20 pointer-events-none"
        data-loop="wobble"
        style={{ '--loop-rotate': '15deg', '--loop-duration': '6s' } as CSSProperties}
      >
        <Icon icon="lucide:layout-grid" className="text-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Content */}
          <div className="w-full md:w-[55%] flex flex-col items-start gap-6">
            

            <h1
              data-edit="about.title"
              className="font-(family-name:--font-ta-h1) text-4xl md:text-[56px] leading-[1.1] tracking-[-0.02em] font-extrabold text-ta-on-surface max-w-2xl"
              {...fadeUp(0.2)}
            >
              {data.about.title}
            </h1>

            <p
              data-edit="about.description"
              className="font-(family-name:--font-ta-body-lg) text-[17px] leading-relaxed text-ta-on-surface-variant"
              {...fadeUp(0.3)}
            >
              {data.about.description}
            </p>

            {/* Stats Row */}
            {data.stats.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-6 mt-6 border-t border-ta-outline-variant pt-6 w-full max-w-2xl"
                {...fadeUp(0.4)}
              >
                {data.stats.slice(0, 3).map((stat, i) => (
                  <div
                    key={stat.label}
                    data-note="These highlights come from your Stats. They’re not edited here — update them in the Stats section and they’ll change everywhere."
                    data-note-action="Edit in Stats →"
                    data-note-target={`stats.${i}.value`}
                    className="flex flex-row items-center gap-6"
                  >
                    <div className="flex flex-col">
                      <span className="text-ta-primary font-(family-name:--font-ta-h2) text-3xl font-bold">
                        <span data-bind={`stats.${i}.value`}>{stat.value}</span><span data-bind={`stats.${i}.suffix`}>{stat.suffix ?? ''}</span>
                      </span>
                      <span
                        data-bind={`stats.${i}.label`}
                        className="text-ta-on-surface-variant font-(family-name:--font-ta-label-md) text-ta-label-md mt-1"
                      >
                        {stat.label}
                      </span>
                    </div>
                    {i < Math.min(data.stats.length, 3) - 1 && (
                      <div className="hidden sm:block w-px h-12 bg-ta-outline-variant" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Image */}
          <div data-enter style={{ '--reveal-scale': '0.95', '--reveal-from-opacity': '0', '--reveal-delay': '0.2s', '--reveal-duration': '0.6s' } as CSSProperties}
            className="w-full md:w-[45%] relative mt-12 md:mt-0 flex justify-center items-center min-h-[340px]"
          >
            {/* Blob background */}
            <div className="absolute w-full h-[500px] bg-ta-secondary-container rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-40 z-0" />

            {/* Main image — the About hero's own picture (distinct from the
                "Our story" image, which uses data.about.image). */}
            {data.about.heroImage ? (
              <div className="relative border-8 border-white w-[60%] aspect-square rounded-3xl overflow-hidden z-10 shadow-lg">
                <Image
                  src={data.about.heroImage}
                  alt={`${data.name} campus`}
                  fill
                  className="object-cover"
                  data-edit-img="about.heroImage"
                />
              </div>
            ) : (
              <div className="relative border-8 border-white w-[60%] aspect-square rounded-3xl overflow-hidden z-10">
                <ImagePlaceholder label="Add hero image" editPath="about.heroImage" />
              </div>
            )}

            {/* Floating badge card */}
            {data.about.badges?.[0] && (
              <div className="absolute -bottom-6 -left-6 bg-ta-surface p-4 rounded-xl border border-ta-primary-container shadow-[0_4px_20px_rgba(10,140,50,0.08)] z-20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ta-primary-container flex items-center justify-center">
                  <Icon icon={data.about.badges[0].icon ?? 'lucide:award'} className="text-2xl text-ta-secondary-container" />
                </div>
                <div className="flex flex-col">
                  <span data-edit="about.badges.0.label" className="font-(family-name:--font-ta-h3) text-lg font-semibold text-ta-on-surface leading-tight">
                    {data.about.badges[0].label}
                  </span>
                  {data.about.badges[0].sublabel && (
                    <span data-edit="about.badges.0.sublabel" className="font-(family-name:--font-ta-body-md) text-sm text-ta-on-surface-variant">
                      {data.about.badges[0].sublabel}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
