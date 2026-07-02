import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

export default function OurStory({ data }: { data: SchoolData }) {
  const storyText = data.about.story ?? data.about.description
  const paragraphs = storyText.split('\n').filter(Boolean)

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Image */}
          <ScrollReveal direction="left" className="w-full h-[400px] rounded-lg overflow-hidden">
            {data.about.image ? (
              <Image
                src={data.about.image}
                alt={`${data.name} campus`}
                width={600}
                height={400}
                className="w-full h-full object-cover"
                data-edit-img="about.image"
              />
            ) : (
              <div className="w-full h-full bg-tb-primary-50 flex items-center justify-center" data-edit-img="about.image">
                <Icon icon="lucide:image" className="w-16 h-16 text-tb-primary-400 opacity-30" />
              </div>
            )}
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal direction="right" className="lg:pl-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="lucide:book-open" className="w-6 h-6 text-tb-primary-400" />
              <span className="text-tb-primary-400 font-semibold uppercase tracking-wider text-sm">
                Our Story
              </span>
            </div>
            <h2 data-edit="about.subtitle" className="text-3xl font-bold text-tb-heading mb-6 leading-tight">
              {data.about.subtitle ?? 'A Legacy of Excellence in Education'}
            </h2>
            <div data-edit="about.story">
              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => (
                  <p key={i} className="text-tb-body text-lg leading-relaxed mb-4">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-tb-body text-lg leading-relaxed mb-4">
                  {data.about.description}
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Stats Row */}
        {data.stats.length > 0 && (
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 pt-16 pb-12 md:pt-24 md:pb-20 divide-y-2 lg:divide-y-0 items-start">
            {data.stats.slice(0, 4).map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center text-center pt-8 lg:pt-0">
                <h2 className="text-5xl md:text-6xl font-bold text-tb-primary-400 tracking-tight mb-3">
                  <span data-edit={`stats.${i}.value`}>{stat.value}</span>{stat.suffix ?? ''}
                </h2>
                <p data-edit={`stats.${i}.label`} className="text-base md:text-lg text-slate-700 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </StaggerChildren>
        )}
      </div>
    </div>
  )
}
