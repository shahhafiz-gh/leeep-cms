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
import { HeritageGalleryView } from '@/shared/views/GalleryViews'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import StyleHydrator from '@/shared/StyleHydrator'
import { templateBFonts } from './fonts'

interface TemplateProps {
  data: SchoolData
  page: PageType
  /** True only in the inline editor preview — lets chrome (e.g. the footer)
   *  reveal un-configured affordances that stay hidden on the live site. */
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
  gallery: HeritageGalleryView,
}

/**
 * Template B — Kashmir-Cambridge Style
 * Premium Academic / Gold-Navy aesthetic.
 * Root component that routes to the correct page view.
 */
export default function TemplateB({ data, page, editing = false }: TemplateProps) {
  const PageComponent = pageMap[page]

  return (
    <div
      className={`template-b bg-tb-background text-tb-foreground font-[family-name:var(--font-inter)] min-h-screen flex flex-col ${templateBFonts}`}
      data-palette={data.config?.palette || undefined}
    >
      <Header data={data} page={page} />
      <main className="grow">
        <PageComponent data={data} />
      </main>
      <Footer data={data} editing={editing} />
      <StyleHydrator data={data} />
    </div>
  )
}
