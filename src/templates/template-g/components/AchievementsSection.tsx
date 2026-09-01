import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

export default function AchievementsSection({ data }: { data: SchoolData }) {
  const achievements = (data.about.achievements ?? []).slice(0, 6)
  if (!achievements.length) return null

  return (
    <section className="bg-[#f6f7fb] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-tb-primary-400">{data.name}</p>
          <h2 data-edit="about.achievementsTitle" className="mt-2 text-3xl font-extrabold text-tb-secondary md:text-4xl">{data.about.achievementsTitle || 'Achievements'}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, index) => (
            <article key={`${item.title}-${index}`} className="group border-b-4 border-tb-primary-400 bg-white p-6 shadow-[0_8px_25px_rgba(29,45,102,0.07)] transition-transform hover:-translate-y-1">
              <div className="mb-5 flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-tb-primary-50 text-tb-primary-400"><Icon icon={item.icon || 'lucide:trophy'} className="h-6 w-6" /></span>
                {item.year && <span data-edit={`about.achievements.${index}.year`} className="text-xs font-extrabold tracking-widest text-tb-body">{item.year}</span>}
              </div>
              <h3 data-edit={`about.achievements.${index}.title`} className="text-lg font-extrabold text-tb-secondary">{item.title}</h3>
              <p data-edit={`about.achievements.${index}.description`} className="mt-2 text-sm leading-6 text-tb-body">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
