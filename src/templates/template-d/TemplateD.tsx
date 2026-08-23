import type { SchoolData, PageType } from '@/types/school.types'
import HomeView from './views/HomeView'
import AboutView from './views/AboutView'
import AcademicsView from './views/AcademicsView'
import AdmissionsView from './views/AdmissionsView'
import AdmissionsApplyView from './views/AdmissionsApplyView'
import AdmissionsStatusView from './views/AdmissionsStatusView'
import ContactView from './views/ContactView'
import UpdatesView from './views/UpdatesView'
import TeamView from '@/shared/views/TeamView'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

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
}

/**
 * Template D — "Quill"
 *
 * An editorial template with its OWN component set (unlike Horizon, which
 * re-themes Willow): oversized grotesk display type with serif italic accents,
 * a terracotta-on-ivory palette, and a composition built from full-bleed sand
 * and ink panels rather than the card grids the other templates use.
 *
 * Palette defaults to the built-in terracotta; `config.palette` can switch it to
 * any curated preset (sage / plum / cobalt — see globals.css).
 */
export default function TemplateD({ data, page, editing = false }: TemplateProps) {
  const PageComponent = pageMap[page]
  const palette = data.config?.palette || ''

  return (
    <div
      className="template-d flex min-h-screen flex-col bg-td-paper font-(family-name:--font-td-sans) text-td-ink"
      data-palette={palette || undefined}
    >
      <Header data={data} />
      <main className="grow">
        <PageComponent data={data} />
      </main>
      <Footer data={data} editing={editing} />
    </div>
  )
}
