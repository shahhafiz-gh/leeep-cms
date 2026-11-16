import type { SchoolData } from '@/types/school.types'
import MarkdownContent from '@/shared/MarkdownContent'
import { pagesInGroup } from '@/lib/custom-pages'
import PageShell from '../components/PageShell'
import { PROSE } from '../components/blocks/PageBlocks'
import { PageCards } from './CustomPageView'

interface LandingProps {
  data: SchoolData
  title: string
  summary?: string
  body?: string
  image?: string
  /** The menu group whose pages this landing page introduces. */
  group: string
  groupTitle?: string
  /** Id on the introduction, for menu entries that point into the page. */
  anchor?: string
  paths: { title: string; summary: string; image: string }
}

/**
 * About, Academics and Facilities share one shape here: the school's own
 * introduction, then a card for every page it filed under that menu — so the
 * menu's parent link lands somewhere useful instead of on an empty page.
 */
function Landing({ data, title, summary, body, image, group, groupTitle, anchor, paths }: LandingProps) {
  const pages = pagesInGroup(data, group)
  return (
    <PageShell data={data} title={title} summary={summary} titlePath={paths.title} summaryPath={paths.summary}>
      <div className="space-y-10">
        {(body || image) && (
          <div id={anchor} className="scroll-mt-24 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ts-line">
            {image && (
              <img src={image} alt="" data-edit-img={paths.image} className="max-h-[420px] w-full object-cover" />
            )}
            {body && (
              <div className="p-6 sm:p-8">
                <MarkdownContent source={body} className={PROSE} />
              </div>
            )}
          </div>
        )}
        {pages.length > 0 && (
          <section>
            <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-ts-heading">
              <span className="h-7 w-1.5 rounded-full bg-ts-accent" />
              {groupTitle || `More in ${group}`}
            </h2>
            <PageCards pages={pages} />
          </section>
        )}
      </div>
    </PageShell>
  )
}

export function AboutView({ data }: { data: SchoolData; editing?: boolean }) {
  const about = data.about
  return (
    <Landing
      data={data}
      title={about?.title || 'About Us'}
      summary={about?.subtitle}
      body={about?.story || about?.description}
      image={about?.image}
      group="About"
      groupTitle="Get to know us"
      anchor="story"
      paths={{
        title: 'about.title',
        summary: 'about.subtitle',
        image: 'about.image',
      }}
    />
  )
}

export function AcademicsView({ data }: { data: SchoolData; editing?: boolean }) {
  const academics = data.academics
  return (
    <Landing
      data={data}
      title={academics?.title || 'Academics'}
      summary={academics?.subtitle}
      body={academics?.description}
      image={academics?.image}
      group="Academics"
      groupTitle="Academic life"
      paths={{
        title: 'academics.title',
        summary: 'academics.subtitle',
        image: 'academics.image',
      }}
    />
  )
}

export function FacilitiesView({ data }: { data: SchoolData; editing?: boolean }) {
  const facilities = data.facilities
  return (
    <Landing
      data={data}
      title={facilities?.title || 'Facilities'}
      summary={facilities?.subtitle}
      body={facilities?.description}
      image={facilities?.heroImage}
      group="Facilities"
      groupTitle="Our facilities"
      paths={{
        title: 'facilities.title',
        summary: 'facilities.subtitle',
        image: 'facilities.heroImage',
      }}
    />
  )
}
