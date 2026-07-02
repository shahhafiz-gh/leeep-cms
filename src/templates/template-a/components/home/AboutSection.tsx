'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import StaggerChildren from '@/shared/animations/stagger-children'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

export default function AboutSection({ data }: { data: SchoolData }) {
  // Home-only teaser content — independent of the About page.
  const homeAbout = data.homeAbout ?? {}
  return (
    <section className="py-10 md:py-20 bg-ta-surface overflow-hidden">
      <div className="container my-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative">
          {/* Left Column: Image with floating badges */}
          <div className="relative w-full max-w-[400px] md:max-w-none mx-auto aspect-square md:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-ta-primary/5 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] opacity-80 z-0 scale-110 animate-pulse" />

            <div className="relative z-10 w-full h-full rounded-[30%_60%_70%_30%/60%_30%_70%_40%] bg-ta-surface-dim overflow-hidden shadow-inner border-4 border-ta-surface">
              {homeAbout.image ? (
                <Image
                  src={homeAbout.image}
                  alt={`Students at ${data.name}`}
                  fill
                  className="object-cover"
                  data-edit-img="homeAbout.image"
                />
              ) : (
                <ImagePlaceholder label="Add about image" editPath="homeAbout.image" />
              )}
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col items-start gap-6 md:gap-8 relative z-10 px-4 md:px-0">
            <div className="flex items-center gap-2">
              <span data-edit="homeAbout.title" className="bg-ta-primary/10 text-ta-primary font-bold text-ta-label-md px-4 py-1 rounded-full uppercase tracking-wider">
                {homeAbout.title || 'About Us'}
              </span>
              <Icon icon="lucide:stars" className="text-ta-primary text-xl" />
            </div>

            <h2 data-edit="homeAbout.subtitle" className="font-(family-name:--font-ta-h2) text-3xl md:text-ta-h2 text-ta-on-surface m-0 leading-tight">
              {homeAbout.subtitle || 'Nurturing Excellence in Education'}
            </h2>

            <p data-edit="homeAbout.description" className="font-(family-name:--font-ta-body-lg) text-ta-body-lg text-ta-on-surface-variant leading-relaxed">
              {homeAbout.description}
            </p>

            {/* Mission Points — only when there are some */}
            {homeAbout.mission && homeAbout.mission.length > 0 && (
              <StaggerChildren stagger={0.1} className="flex flex-col gap-4 w-full">
                {homeAbout.mission.map((point, mi) => (
                  <div
                    key={point.title}
                    data-edit-group
                    className="flex gap-4 p-4 rounded-2xl bg-ta-surface-container-low border border-ta-outline-variant/30 hover:border-ta-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-ta-primary/10 flex items-center justify-center shrink-0">
                      <Icon icon="lucide:check" className="w-5 h-5 text-ta-primary" />
                    </div>
                    <div>
                      <h4 data-edit={`homeAbout.mission.${mi}.title`} className="font-bold text-ta-on-surface text-sm mb-1">{point.title}</h4>
                      <p data-edit={`homeAbout.mission.${mi}.description`} className="text-ta-on-surface-variant text-sm">{point.description}</p>
                    </div>
                  </div>
                ))}
              </StaggerChildren>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <Link href="/about">
                <button className="inline-flex items-center justify-center gap-2 cursor-pointer bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) rounded-full shadow-lg hover:shadow-ta-primary/20 hover:scale-105 active:scale-95 transition-all duration-200 px-6 py-3 font-bold">
                  Learn More About Us
                  <Icon icon="lucide:arrow-right" className="text-lg" />
                </button>
              </Link>

              {data.contact?.phone?.[0] && (
                <div className="flex items-center gap-3 text-ta-on-surface-variant group cursor-pointer">
                  <div className="bg-ta-surface-container-high p-3 rounded-full group-hover:bg-ta-primary/10 transition-colors">
                    <Icon icon="lucide:phone" className="text-ta-primary" />
                  </div>
                  <a
                    href={`tel:${data.contact?.phone?.[0]}`}
                    data-edit="contact.phone.0"
                    className="font-(family-name:--font-ta-label-md) text-ta-label-md font-bold text-ta-on-surface hover:text-ta-primary transition-colors"
                  >
                    {data.contact?.phone?.[0]}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
