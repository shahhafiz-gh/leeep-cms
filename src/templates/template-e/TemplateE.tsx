import type { SchoolData, PageType } from '@/types/school.types'
import HomeView from './views/HomeView'
import AboutView from './views/AboutView'
import AcademicsView from './views/AcademicsView'
import AdmissionsView from './views/AdmissionsView'
import AdmissionsApplyView from './views/AdmissionsApplyView'
import AdmissionsStatusView from './views/AdmissionsStatusView'
import ContactView from './views/ContactView'
import UpdatesView from './views/UpdatesView'
import FacilitiesView from './views/FacilitiesView'
import TeamView from '@/shared/views/TeamView'
import { LedgerGalleryView } from '@/shared/views/GalleryViews'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import StyleHydrator from '@/shared/StyleHydrator'
import { templateEFonts } from './fonts'

interface TemplateProps {
  data: SchoolData
  page: PageType
  editing?: boolean
}

const pageMap: Record<PageType, React.ComponentType<{ data: SchoolData }>> = {
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
  gallery: LedgerGalleryView,
}

/**
 * Template E — "Ledger"
 *
 * The institutional register: Lora over Work Sans, warm paper, a brick accent,
 * and structure carried entirely by hairline rules — no rounded corners, no
 * shadows, no cards. Where Quill is a magazine and Willow is an app, Ledger is
 * a printed prospectus.
 *
 * `config.palette` swaps only the accent (forest / navy / violet); the paper and
 * rules are the design and never move.
 */
export default function TemplateE({ data, page, editing = false }: TemplateProps) {
  const PageComponent = pageMap[page]
  const palette = data.config?.palette || ''

  return (
    <div
      className={`template-e flex min-h-screen flex-col bg-te-paper font-(family-name:--font-te-sans) text-te-ink ${templateEFonts}`}
      data-palette={palette || undefined}
    >
      <Header data={data} />
      <main className="grow">
        <PageComponent data={data} />
      </main>
      <Footer data={data} editing={editing} />
      <StyleHydrator data={data} />
    </div>
  )
}
