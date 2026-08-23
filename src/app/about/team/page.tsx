import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSiteData, resolveSchool, isEditPreview, resolvePreviewMode, resolvePreviewToken, type RouteSearchParams } from '@/lib/cms'
import { renderTemplate } from '@/lib/render-template'
import { buildMetadata } from '@/lib/metadata'
import InlineEditLayer from '@/shared/InlineEditLayer'

type PageProps = { searchParams: Promise<RouteSearchParams> }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const headersList = await headers()
  const sp = await searchParams
  const data = await getSiteData(resolveSchool(headersList, sp), 'published')
  return buildMetadata({
    favicon: data.config?.favicon,
    seo: data.seo,
    schoolName: data.name,
    title: data.team?.title || 'Our Team',
    description: data.team?.description || `Meet the people behind ${data.name}.`,
  })
}

export default async function TeamPage({ searchParams }: PageProps) {
  const headersList = await headers()
  const sp = await searchParams
  const school = resolveSchool(headersList, sp)
  const editing = isEditPreview(sp)
  const data = await getSiteData(school, resolvePreviewMode(sp), resolvePreviewToken(sp))

  // The backend exposes this navigation item only for schools that opted into
  // the extended page set. Keep direct URL access governed by that same flag.
  if (!data.config?.extended_pages) notFound()

  return (
    <>
      {renderTemplate(data, 'team', school, editing)}
      {editing && <InlineEditLayer />}
    </>
  )
}

export const dynamic = 'force-dynamic'
