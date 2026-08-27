import type { SchoolData, PageType } from '@/types/school.types'
import HomeView from './views/HomeView'
import AboutView from './views/AboutView'
import TeamView from './views/TeamView'
import AcademicsView from './views/AcademicsView'
import AdmissionsView from './views/AdmissionsView'
import AdmissionsApplyView from './views/AdmissionsApplyView'
import AdmissionsStatusView from './views/AdmissionsStatusView'
import ContactView from './views/ContactView'
import UpdatesView from './views/UpdatesView'
import FacilitiesView from './views/FacilitiesView'
import { AlmanacGalleryView } from '@/shared/views/GalleryViews'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import StyleHydrator from '@/shared/StyleHydrator'
import { templateFFonts } from './fonts'

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
  gallery: AlmanacGalleryView,
}

/**
 * Template D — "Almanac"
 *
 * An editorial template with its OWN component set (unlike Horizon, which
 * re-themes Willow): oversized slab-serif display type, a terracotta-on-ivory
 * palette, and a composition built from full-bleed sand and ink panels rather
 * than the card grids the other templates use. Website Management can switch
 * its typeface between BioRhyme and Roboto Slab.
 *
 * Palette defaults to the built-in terracotta; `config.palette` can switch it to
 * any curated preset (sage / plum / cobalt — see globals.css).
 */
export default function TemplateF({ data, page, editing = false }: TemplateProps) {
  const PageComponent = pageMap[page]
  const palette = data.config?.palette || ''
  const font = data.config?.font_family === 'roboto-slab' ? 'roboto-slab' : 'biorhyme'

  return (
    <div
      className={`template-f flex min-h-screen flex-col bg-tf-paper font-(family-name:--font-tf-sans) text-tf-ink ${templateFFonts}`}
      data-palette={palette || undefined}
      data-font={font}
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
