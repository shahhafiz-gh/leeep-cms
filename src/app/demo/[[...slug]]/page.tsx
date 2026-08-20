import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { PageType } from '@/types/school.types'
import { getDemoData, resolveDemoTemplate } from '@/lib/demo'
import { isEditPreview, type RouteSearchParams } from '@/lib/cms'
import { buildMetadata } from '@/lib/metadata'
import TemplateA from '@/templates/template-a/TemplateA'
import TemplateB from '@/templates/template-b/TemplateB'
import TemplateC from '@/templates/template-c/TemplateC'
import TemplateD from '@/templates/template-d/TemplateD'
import TemplateE from '@/templates/template-e/TemplateE'
import TemplateF from '@/templates/template-f/TemplateF'
import InlineEditLayer from '@/shared/InlineEditLayer'

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
  searchParams: Promise<RouteSearchParams>
}

/** Map the URL path under /demo to a template page. '' (no segment) → home. */
const SLUG_TO_PAGE: Record<string, PageType> = {
  '': 'home',
  about: 'about',
  academics: 'academics',
  admissions: 'admissions',
  // The application form and the status lookup are their own pages, so the demo
  // needs the nested paths too.
  'admissions/apply': 'admissions-apply',
  'admissions/status': 'admissions-status',
  contact: 'contact',
  updates: 'updates',
}

function resolvePage(slug?: string[]): PageType | null {
  if (!slug || slug.length === 0) return 'home'
  return SLUG_TO_PAGE[slug.join('/')] ?? null
}

export async function generateMetadata({ searchParams }: DemoProps): Promise<Metadata> {
  const template = resolveDemoTemplate((await searchParams).template)
  const data = getDemoData(template)
  return buildMetadata({ seo: data.seo, schoolName: data.name, title: `Template ${template} Demo` })
}

export default async function DemoPage({ params, searchParams }: DemoProps) {
  const page = resolvePage((await params).slug)
  if (!page) return notFound()

  const sp = await searchParams
  const template = resolveDemoTemplate(sp.template)
  const paletteRaw = Array.isArray(sp.palette) ? sp.palette[0] : sp.palette
  const data = getDemoData(template, paletteRaw)
  const editing = isEditPreview(sp)

  // The CARD's template (from the URL) decides the design — never the demo
  // data's `config.template_id`. Same `data` content, two different templates.
  return (
    <>
      {template === 'B' ? (
        <TemplateB data={data} page={page} />
      ) : template === 'C' ? (
        <TemplateC data={data} page={page} />
      ) : template === 'D' ? (
        <TemplateD data={data} page={page} />
      ) : template === 'E' ? (
        <TemplateE data={data} page={page} />
      ) : template === 'F' ? (
        <TemplateF data={data} page={page} />
      ) : (
        <TemplateA data={data} page={page} />
      )}
      {/* Inline-edit layer: injected ONLY for an editor preview
          (?preview=1&token=<PREVIEW_SECRET>). Capture-only — mirrors the
          home/about routes so every demo page (incl. About for both
          templates) is editable in the inline editor. */}
      {editing && <InlineEditLayer />}
    </>
  )
}

export const dynamic = 'force-dynamic'
