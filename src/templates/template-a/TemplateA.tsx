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
import { WillowGalleryView } from '@/shared/views/GalleryViews'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import StyleHydrator from '@/shared/StyleHydrator'

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
  gallery: WillowGalleryView,
}

/**
 * Template A — IEIskp Style
 * Material Design 3 / Green Nature aesthetic.
 * Root component that routes to the correct page view.
 */
export default function TemplateA({ data, page, editing = false }: TemplateProps) {
  const PageComponent = pageMap[page]

  return (
    <div
      className="template-a bg-ta-background text-ta-on-background font-(family-name:--font-dm-sans) min-h-screen flex flex-col"
      data-palette={data.config?.palette || undefined}
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
