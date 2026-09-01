import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

export default function InstitutionalHighlights({ data }: { data: SchoolData }) {
  const highlights = (data.about.whyChooseUs ?? []).slice(0, 4)
  const image = data.about.homeImage || data.homeAbout?.image || data.about.image
  const imagePath = data.about.homeImage
    ? 'about.homeImage'
    : data.homeAbout?.image
      ? 'homeAbout.image'
      : 'about.image'
  if (!highlights.length) return null

  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-stretch px-4 lg:grid-cols-2 lg:px-8">
        <div className="relative min-h-[390px] overflow-hidden bg-tb-secondary">
          {image && <Image src={image} alt={data.about.title} fill data-edit-img={imagePath} className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />}
          <div className="absolute inset-0 bg-gradient-to-t from-tb-secondary/90 via-tb-secondary/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Learning with purpose</p>
            <h2 data-edit="about.whyChooseTitle" className="mt-2 text-3xl font-extrabold leading-tight text-white md:text-4xl">{data.about.whyChooseTitle || 'Character, confidence and curiosity'}</h2>
          </div>
        </div>
        <div className="bg-[linear-gradient(145deg,#21347a,#6b31a1)] p-7 md:p-10">
          <p data-edit="about.whyChooseDescription" className="mb-8 max-w-xl leading-7 text-white/75">{data.about.whyChooseDescription || data.about.description}</p>
          <div className="grid gap-px bg-white/15 sm:grid-cols-2">
            {highlights.map((item, index) => (
              <div key={`${item.title}-${index}`} className="bg-white/[0.06] p-5 text-white transition-colors hover:bg-white/[0.12]">
                <Icon icon={item.icon || 'lucide:sparkles'} className="mb-4 h-7 w-7 text-white/75" />
                <h3 data-edit={`about.whyChooseUs.${index}.title`} className="font-extrabold text-white">{item.title}</h3>
                <p data-edit={`about.whyChooseUs.${index}.description`} className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
