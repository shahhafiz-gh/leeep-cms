'use client'

import type { CSSProperties } from 'react'
import Image from '@/shared/SiteImage'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

/** The shared entrance for this hero's copy: fade up, staggered by `delay`.
 *  Spread onto a plain element — the animation itself is CSS (`[data-enter]`). */
const fadeUp = (delay: number) => ({
  'data-enter': true,
  style: { '--reveal-y': '20px', '--reveal-delay': `${delay}s` } as CSSProperties,
})

export default function AcademicsHero({ data }: { data: SchoolData }) {
  const { academics } = data

  return (
    <section className="relative w-full py-12 md:py-20 mt-20 overflow-hidden bg-ta-surface">
      <div
        className="absolute top-16 right-12 text-ta-primary opacity-20 pointer-events-none hidden md:block"
        data-loop="float"
        style={{ '--loop-distance': '-12px', '--loop-duration': '5s' } as CSSProperties}
      >
        <Icon icon="lucide:book-open" className="text-5xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Content */}
          <div className="w-full md:w-[55%] flex flex-col items-start gap-6">
            <div data-enter style={{ '--reveal-scale': '0.9', '--reveal-from-opacity': '0', '--reveal-duration': '0.5s' } as CSSProperties}
              data-edit="academics.subtitle"
              className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md font-semibold inline-block"
            >
              {academics.subtitle ?? 'Academics'}
            </div>

            <h1
              data-edit="academics.title"
              className="font-(family-name:--font-ta-h1) text-4xl md:text-[56px] leading-[1.1] tracking-[-0.02em] font-extrabold text-ta-on-surface max-w-2xl"
              {...fadeUp(0.2)}
            >
              {academics.title}
            </h1>

            <p
              data-edit="academics.description"
              className="font-(family-name:--font-ta-body-lg) text-[17px] leading-relaxed text-ta-on-surface-variant max-w-xl"
              {...fadeUp(0.3)}
            >
              {academics.description}
            </p>
          </div>

          {/* Image */}
          <div data-enter style={{ '--reveal-scale': '0.95', '--reveal-from-opacity': '0', '--reveal-delay': '0.2s', '--reveal-duration': '0.6s' } as CSSProperties}
            className="w-full md:w-[45%] relative flex justify-center items-center min-h-[300px]"
          >
            <div className="absolute w-full h-[420px] bg-ta-secondary-container rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-40 z-0" />
            {academics.image ? (
              <div className="relative border-8 border-white w-[75%] aspect-[4/3] rounded-3xl overflow-hidden z-10 shadow-lg">
                <Image src={academics.image} alt={`${data.name} academics`} fill className="object-cover" data-edit-img="academics.image" />
              </div>
            ) : (
              <div className="relative border-8 border-white w-[75%] aspect-[4/3] rounded-3xl overflow-hidden z-10">
                <ImagePlaceholder label="Add academics image" icon="lucide:graduation-cap" editPath="academics.image" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
