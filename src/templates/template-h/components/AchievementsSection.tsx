import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { isSectionVisible } from '@/shared/section-visibility'

/**
 * "Our Achievements" — the reference site's card row of results and awards.
 * Cards carry a photo when one is authored and fall back to an icon tile, so a
 * school that has written the results but not uploaded the certificates still
 * gets an even row rather than ragged empty frames.
 */
export default function AchievementsSection({ data }: { data: SchoolData }) {
  const achievements = data.about?.achievements ?? []
  if (!achievements.length || !isSectionVisible(data, 'aboutAchievements')) return null

  return (
    <section className="bg-th-paper py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 data-edit="about.achievementsTitle" className="text-2xl font-bold text-th-heading md:text-3xl">
            {data.about?.achievementsTitle || 'Our Achievements'}
          </h2>
          <span className="mx-auto mt-4 block h-[3px] w-14 bg-th-primary" />
        </div>

        <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((item, i) => (
            <article
              key={`${item.title}-${i}`}
              className="group flex flex-col overflow-hidden bg-white shadow-[0_10px_30px_rgba(34,34,34,0.06)] transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-th-primary-50">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    data-edit-img={`about.achievements.${i}.image`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span
                    data-edit-img={`about.achievements.${i}.image`}
                    className="grid h-full w-full place-items-center text-th-primary"
                  >
                    <Icon icon={item.icon || 'lucide:award'} className="h-12 w-12" />
                  </span>
                )}
                {item.year && (
                  <span className="absolute left-0 top-4 bg-th-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    {item.year}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3
                  data-edit={`about.achievements.${i}.title`}
                  className="text-[15px] font-semibold uppercase leading-snug text-th-heading"
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p
                    data-edit={`about.achievements.${i}.description`}
                    className="mt-2.5 text-sm leading-6 text-th-body"
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
