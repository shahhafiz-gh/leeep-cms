import Image from '@/shared/SiteImage'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

export default function FacilitiesSection({ data }: { data: SchoolData }) {
  const items = (data.facilities?.items ?? []).slice(0, 3)
  if (!items.length) return null

  return (
    <section className="relative overflow-hidden bg-tb-secondary py-16 text-white md:py-24">
      {data.facilities?.heroImage && (
        <Image src={data.facilities.heroImage} alt="" fill className="object-cover opacity-15" sizes="100vw" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(33,52,122,0.96),rgba(107,49,161,0.88))]" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p data-edit="facilities.subtitle" className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/65">{data.facilities?.subtitle || 'Spaces to learn and grow'}</p>
            <h2 data-edit="facilities.title" className="mt-2 text-3xl font-extrabold text-white md:text-4xl">{data.facilities?.title || 'Our Facilities'}</h2>
          </div>
          <Link href="/facilities" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-white/75">Explore all facilities <Icon icon="lucide:arrow-right" className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <article key={`${item.name}-${index}`} className="group relative min-h-[310px] overflow-hidden bg-white/10">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill data-edit-img={`facilities.items.${index}.image`} className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-white/10"><Icon icon="lucide:school" className="h-14 w-14 text-white/30" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101b4d] via-[#101b4d]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 data-edit={`facilities.items.${index}.name`} className="text-xl font-extrabold text-white">{item.name}</h3>
                <p data-edit={`facilities.items.${index}.description`} className="mt-2 line-clamp-2 text-sm leading-6 text-white/70">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
