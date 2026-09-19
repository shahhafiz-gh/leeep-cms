import type { PageType, SchoolData, SitePage } from '@/types/school.types'
import AdmissionsView from '@/templates/template-f/views/AdmissionsView'
import AdmissionsApplyView from '@/templates/template-f/views/AdmissionsApplyView'
import AdmissionsStatusView from '@/templates/template-f/views/AdmissionsStatusView'
import UpdatesView from './views/UpdatesView'
import PrivacyView from './views/PrivacyView'
import TeamView from '@/templates/template-h/views/TeamView'
import StyleHydrator from '@/shared/StyleHydrator'
import { templateIFonts } from './fonts'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeView from './views/HomeView'
import { AboutView, AcademicsView, FacilitiesView } from './views/LandingViews'
import ContactView from './views/ContactView'
import GalleryView from './views/GalleryView'
import CustomPageView from './views/CustomPageView'

interface TemplateProps {
  data: SchoolData
  page: SitePage
  /** For `page: 'custom'` — the page (or menu group) the route named. */
  pageSlug?: string
  editing?: boolean
}

const pageMap: Record<PageType, React.ComponentType<{ data: SchoolData; editing?: boolean }>> = {
  home: HomeView,
  about: AboutView,
  team: TeamView,
  academics: AcademicsView,
  admissions: AdmissionsView,
  'admissions-apply': AdmissionsApplyView,
  'admissions-status': AdmissionsStatusView,
  contact: ContactView,
  updates: UpdatesView,
  facilities: FacilitiesView,
  gallery: GalleryView,
  privacy: PrivacyView,
}

/**
 * Template I — "Scholars". Private to Scholars' School, Srinagar; the catalogue
 * in `education.education.api` serves it to no other site.
 *
 * Its own design in the school's colours — royal blue and navy with amber —
 * built for a school whose old site kept a page per topic: every one of those
 * (History, Syllabus, Honour Board, each boarding campus, the alumni register,
 * the feedback form, ...) is a custom page (`data.pages`, served at `/<slug>`),
 * filed under the menu it belongs to. About, Academics and Facilities are
 * landing pages that introduce their menu's pages.
 *
 * Team reuses Heritage's view and admissions reuses
 * Almanac's flow; the `.template-i` rule in globals.css re-points the token
 * contracts they read, so they come out in this template's colours.
 */
export default function TemplateI({ data, page, pageSlug, editing = false }: TemplateProps) {
  const PageComponent = page === 'custom' ? null : pageMap[page]
  const body = PageComponent ? (
    <PageComponent data={data} editing={editing} />
  ) : (
    <CustomPageView data={data} slug={pageSlug} />
  )

  return (
    <div
      className={`template-i flex min-h-screen flex-col bg-white font-[family-name:var(--font-ts-sans)] text-ts-body ${templateIFonts}`}
    >
      <Header data={data} />
      <main className="grow">{body}</main>
      <Footer data={data} editing={editing} />
      <StyleHydrator data={data} />
    </div>
  )
}
