import type { SchoolData, PageType } from '@/types/school.types'
import HomeView from './views/HomeView'
import AboutView from './views/AboutView'
import AcademicsView from './views/AcademicsView'
import AdmissionsView from './views/AdmissionsView'
import ContactView from './views/ContactView'
import UpdatesView from './views/UpdatesView'
import LoginView from './views/LoginView'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

interface TemplateProps {
  data: SchoolData
  page: PageType
}

const pageMap: Record<PageType, React.ComponentType<{ data: SchoolData }>> = {
  home: HomeView,
  about: AboutView,
  academics: AcademicsView,
  admissions: AdmissionsView,
  contact: ContactView,
  updates: UpdatesView, 
  login: LoginView,
}

/**
 * Template B — Kashmir-Cambridge Style
 * Premium Academic / Gold-Navy aesthetic.
 * Root component that routes to the correct page view.
 */
export default function TemplateB({ data, page }: TemplateProps) {
  const PageComponent = pageMap[page]

  return (
    <div className="template-b bg-tb-background text-tb-foreground font-[family-name:var(--font-inter)] min-h-screen flex flex-col">
      <Header data={data} page={page} />
      <main className="grow">
        <PageComponent data={data} />
      </main>
      <Footer data={data} />
    </div>
  )
}
