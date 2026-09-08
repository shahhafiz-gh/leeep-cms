import type { PageType, SchoolData } from '@/types/school.types'
import AdmissionsView from '@/templates/template-f/views/AdmissionsView'
import AdmissionsApplyView from '@/templates/template-f/views/AdmissionsApplyView'
import AdmissionsStatusView from '@/templates/template-f/views/AdmissionsStatusView'
import ContactView from '@/templates/template-b/views/ContactView'
import UpdatesView from '@/templates/template-b/views/UpdatesView'
import FacilitiesView from '@/templates/template-b/views/FacilitiesView'
import StyleHydrator from '@/shared/StyleHydrator'
import { templateBFonts } from '@/templates/template-b/fonts'
import { templateHFonts } from './fonts'
import Header from './components/Header'
import Footer from './components/Footer'
import AboutView from './views/AboutView'
import AcademicsView from './views/AcademicsView'
import HomeView from './views/HomeView'
import TeamView from './views/TeamView'
import GalleryView from './views/GalleryView'

interface TemplateProps {
  data: SchoolData
  page: PageType
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
}

/**
 * Template H — "Grand". Private to Dubai Grand International School; the
 * catalogue in `education.education.api` will not serve it to any other site.
 *
 * The home page and chrome reproduce the school's existing site — a light
 * three-tier header, a brick-red accent on near-white paper, a rotating hero
 * and the quote/notice band. Inner pages reuse Heritage's mature content views
 * and Almanac's admissions flow, re-themed through the `.template-h` token
 * remap in globals.css rather than duplicated. The sub-pages the old site kept
 * separate (six About pages, six facility pages, four academics pages) are
 * folded onto those routes and reachable from the nav's dropdowns — the old
 * site's three galleries become one page (photos then videos), and its
 * department-led faculty listing becomes this template's own grouped Team view.
 *
 * About and Academics are Heritage's views plus the sections that folding needs:
 * the leadership messages and the organisation chart on About, the syllabus and
 * booklist downloads on Academics. Each of those sections carries the anchor its
 * menu entry points at (see NAV_BLUEPRINT on the server).
 *
 * Both `template-b` and `template-h` are on the root: the former keeps every
 * Heritage-scoped rule matching, the latter re-points the tokens those rules
 * read. Both font variable sets are applied for the same reason — Heritage's
 * views reference `--font-inter`, this template's chrome uses `--font-poppins`.
 */
export default function TemplateH({ data, page, editing = false }: TemplateProps) {
  const PageComponent = pageMap[page]

  return (
    <div
      className={`template-b template-h flex min-h-screen flex-col bg-white font-[family-name:var(--font-poppins)] text-th-body ${templateBFonts} ${templateHFonts}`}
    >
      <Header data={data} />
      <main className="grow">
        <PageComponent data={data} editing={editing} />
      </main>
      <Footer data={data} editing={editing} />
      <StyleHydrator data={data} />
    </div>
  )
}
