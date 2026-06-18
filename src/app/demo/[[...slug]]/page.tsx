import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { PageType } from '@/types/school.types'
import { getDemoData, resolveDemoTemplate } from '@/lib/demo'
import { buildMetadata } from '@/lib/metadata'
import TemplateA from '@/templates/template-a/TemplateA'
import TemplateB from '@/templates/template-b/TemplateB'

/**
 * Neutral template DEMO route.
 *
 *   /demo?template=A            → Template A, Home
 *   /demo/about?template=A      → Template A, About
 *   /demo/academics?template=B  → Template B, Academics   …etc.
 *
 * Fully self-contained: data comes only from `getDemoData` (generic, fictional
 * content), never from Frappe, a subdomain, or any school's draft/published
 * content. It therefore works even with the backend offline and cannot leak
 * real school data.
 */

interface DemoProps {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ template?: string | string[] }>
}

/** Map the first URL segment under /demo to a template page. '' (no segment) → home. */
const SLUG_TO_PAGE: Record<string, PageType> = {
  '': 'home',
  about: 'about',
  academics: 'academics',
  admissions: 'admissions',
  contact: 'contact',
  updates: 'updates',
  login: 'login',
}

function resolvePage(slug?: string[]): PageType | null {
  if (!slug || slug.length === 0) return 'home'
  return SLUG_TO_PAGE[slug[0]] ?? null
}

export async function generateMetadata({ searchParams }: DemoProps): Promise<Metadata> {
  const template = resolveDemoTemplate((await searchParams).template)
  const data = getDemoData(template)
  return buildMetadata({ schoolName: data.name, title: `Template ${template} Demo` })
}

export default async function DemoPage({ params, searchParams }: DemoProps) {
  const page = resolvePage((await params).slug)
  if (!page) return notFound()

  const template = resolveDemoTemplate((await searchParams).template)
  const data = getDemoData(template)

  return template === 'B'
    ? <TemplateB data={data} page={page} />
    : <TemplateA data={data} page={page} />
}

export const dynamic = 'force-dynamic'
