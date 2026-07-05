import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'

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

   
      </div>
    </div>
  )
}
