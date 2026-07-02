'use client'

import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

export default function OurStory({ data }: { data: SchoolData }) {
  const storyText = data.about.story ?? data.about.description
  const paragraphs = storyText.split('\n').filter(Boolean)

  return (
    <section className="py-16 md:py-24 bg-ta-surface-container-low overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Image with blob */}
          <ScrollReveal direction="left" className="relative w-full max-w-[400px] md:max-w-none mx-auto aspect-square md:h-[500px] flex items-center justify-center">
            {/* Animated blob bg */}
            <div className="absolute inset-0 bg-ta-primary/5 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] opacity-80 z-0 scale-110 animate-pulse" />

            {/* Image */}
            <div className="relative z-10 w-full h-full rounded-[30%_60%_70%_30%/60%_30%_70%_40%] bg-ta-surface-dim overflow-hidden shadow-inner border-4 border-ta-surface">
              {data.about.image ? (
                <Image
                  src={data.about.image}
                  alt={`${data.name} campus`}
                  fill
                  className="object-cover"
                  data-edit-img="about.image"
                />
              ) : (
                <ImagePlaceholder label="Add about image" editPath="about.image" />
              )}
            </div>

            {/* Floating badge */}
            {data.about.badges?.[0] && (
              <ScrollReveal direction="left" delay={0.3} className="absolute top-4 -left-2 md:top-8 md:-left-8 z-20">
                <div className="bg-ta-tertiary-container text-ta-on-tertiary-container px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ta-on-tertiary-container/10 flex items-center justify-center">
                    <Icon icon={data.about.badges[0].icon ?? 'lucide:landmark'} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm" data-edit="about.badges.0.label">{data.about.badges[0].label}</div>
                    {data.about.badges[0].sublabel && (
                      <div className="text-xs opacity-80" data-edit="about.badges.0.sublabel">{data.about.badges[0].sublabel}</div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </ScrollReveal>

          {/* Right: Content */}
          <ScrollReveal direction="right" className="flex flex-col gap-6 px-4 md:px-0">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <Icon icon="lucide:book-open" className="w-5 h-5 text-ta-primary" />
              <span className="text-ta-primary font-(family-name:--font-ta-label-md) text-ta-label-md font-semibold uppercase tracking-wider">
                Our Story
              </span>
            </div>

            <h2 data-edit="about.subtitle" className="font-(family-name:--font-ta-h2) text-3xl md:text-[--text-ta-h2] text-ta-on-surface leading-tight">
              {data.about.subtitle ?? 'A Legacy of Excellence in Education'}
            </h2>

            <div data-edit="about.story" className="flex flex-col gap-4">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-(family-name:--font-ta-body-lg) text-[--text-ta-body-lg] text-ta-on-surface-variant leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
