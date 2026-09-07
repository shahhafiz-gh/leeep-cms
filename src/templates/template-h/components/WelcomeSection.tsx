import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { isSectionVisible } from '@/shared/section-visibility'

/**
 * The reference site's welcome block: a framed campus photo beside an
 * introduction and three short pillars.
 *
 * Written against `homeAbout` rather than borrowing Heritage's equivalent
 * because that one carries its own stats bar, which would render the figures
 * twice on a page that already has the counter strip below it. `homeAbout`
 * exists precisely for a home-only teaser, and editing it never touches the
 * About page.
 */
export default function WelcomeSection({ data }: { data: SchoolData }) {
  const home = data.homeAbout
  const heading = home?.subtitle || data.about?.title
  const description = home?.description || data.about?.description
  const image = home?.image || data.about?.homeImage || data.about?.image
  const pillars = (home?.mission ?? data.about?.mission ?? []).slice(0, 3)

  if (!heading && !description) return null
  if (!isSectionVisible(data, 'homeAbout')) return null

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {image && (
          <div className="relative">
            <div className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={heading || data.name}
                data-edit-img="homeAbout.image"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {/* The reference site frames the photo with an offset rule. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-4 -right-4 -z-10 hidden h-full w-full border-[6px] border-th-primary-100 lg:block"
            />
          </div>
        )}

        <div>
          {home?.title && (
            <p
              data-edit="homeAbout.title"
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-th-primary"
            >
              {home.title}
            </p>
          )}
          {heading && (
            <h2
              data-edit="homeAbout.subtitle"
              className="text-2xl font-bold leading-tight text-th-heading md:text-3xl"
            >
              {heading}
            </h2>
          )}
          <span className="mt-4 block h-[3px] w-14 bg-th-primary" />
          {description && (
            <p
              data-edit="homeAbout.description"
              className="mt-6 text-[15px] leading-8 text-th-body"
            >
              {description}
            </p>
          )}

          {pillars.length > 0 && (
            <div className="mt-8 space-y-5">
              {pillars.map((item, i) => (
                <div key={`${item.title}-${i}`} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-th-primary-50 text-th-primary">
                    <Icon icon={item.icon || 'lucide:check'} className="h-5 w-5" />
                  </span>
                  <span>
                    <span
                      data-edit={`homeAbout.mission.${i}.title`}
                      className="block text-[15px] font-semibold text-th-heading"
                    >
                      {item.title}
                    </span>
                    {item.description && (
                      <span
                        data-edit={`homeAbout.mission.${i}.description`}
                        className="mt-1 block text-sm leading-6 text-th-body"
                      >
                        {item.description}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/about"
            className="mt-9 inline-flex items-center gap-2 bg-th-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-th-primary-600"
          >
            Know more
            <Icon icon="lucide:arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
