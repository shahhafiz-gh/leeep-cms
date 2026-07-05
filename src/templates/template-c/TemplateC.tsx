import type { SchoolData, PageType } from '@/types/school.types'
// Template C ("Horizon") reuses Template A's proven page layout, re-themed via a
// distinct `.template-c` root: a warm editorial default palette (see globals.css)
// and serif headings. Content, sections and behaviour are identical to Template A,
// so it stays in lock-step with A's components for free.
import HomeView from '../template-a/views/HomeView'
import AboutView from '../template-a/views/AboutView'
import AcademicsView from '../template-a/views/AcademicsView'
import AdmissionsView from '../template-a/views/AdmissionsView'
import ContactView from '../template-a/views/ContactView'
import UpdatesView from '../template-a/views/UpdatesView'
import Header from '../template-a/components/layout/Header'
import Footer from '../template-a/components/layout/Footer'

interface TemplateProps {
  data: SchoolData
  page: PageType
  editing?: boolean
}

const pageMap: Record<PageType, React.ComponentType<{ data: SchoolData }>> = {
  home: HomeView,
  about: AboutView,
  academics: AcademicsView,
  admissions: AdmissionsView,
  contact: ContactView,
  updates: UpdatesView,
}

/**
 * Template C — "Horizon"
 * Template A's layout under a warm, editorial theme. Palette defaults to `warm`
 * and can be switched to any curated preset (warm / coastal / indigo / emerald).
 */
export default function TemplateC({ data, page, editing = false }: TemplateProps) {
  const PageComponent = pageMap[page]
  // `template-c` scopes the re-theme; `template-a` keeps any A-scoped rules working.
  const palette = data.config?.palette || 'warm'

  return (
    <div
      className="template-c template-a bg-ta-background text-ta-on-background font-(family-name:--font-dm-sans) min-h-screen flex flex-col"
      data-palette={palette}
    >
      <Header data={data} />
      <main className="grow">
        <PageComponent data={data} />
      </main>
      <Footer data={data} editing={editing} />
    </div>
  )
}
