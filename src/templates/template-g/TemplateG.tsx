import type { PageType, SchoolData } from '@/types/school.types'
import AboutView from '@/templates/template-b/views/AboutView'
import AcademicsView from '@/templates/template-b/views/AcademicsView'
import AdmissionsView from '@/templates/template-f/views/AdmissionsView'
import AdmissionsApplyView from '@/templates/template-f/views/AdmissionsApplyView'
import AdmissionsStatusView from '@/templates/template-f/views/AdmissionsStatusView'
import ContactView from '@/templates/template-b/views/ContactView'
import UpdatesView from '@/templates/template-b/views/UpdatesView'
import FacilitiesView from '@/templates/template-b/views/FacilitiesView'
import PrivacyView from '@/templates/template-b/views/PrivacyView'
import TeamView from '@/shared/views/TeamView'
import { HeritageGalleryView } from '@/shared/views/GalleryViews'
import StyleHydrator from '@/shared/StyleHydrator'
import { templateBFonts } from '@/templates/template-b/fonts'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeView from './views/HomeView'

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
  gallery: HeritageGalleryView,
  privacy: PrivacyView,
}

/**
 * Baramulla-inspired public-school template.
 *
 * The home page and chrome follow the reference site's information hierarchy,
 * while most inner pages intentionally reuse Heritage's mature content views.
 * Admissions borrows Almanac's invitation page and staged rules -> application
 * process. `.template-g` remaps both templates' token sets to the reference
 * blue/purple palette in globals.css.
 */
export default function TemplateG({ data, page, editing = false }: TemplateProps) {
  const PageComponent = pageMap[page]

  return (
    <div
      className={`template-b template-g flex min-h-screen flex-col bg-tb-background font-[family-name:var(--font-inter)] text-tb-foreground ${templateBFonts}`}
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
