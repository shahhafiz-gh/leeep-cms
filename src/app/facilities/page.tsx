import { headers } from 'next/headers'
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
  return buildMetadata({ favicon: data.config?.favicon, seo: data.seo, schoolName: data.name, title: data.facilities?.title || 'Facilities', description: data.facilities?.description })
}

export default async function FacilitiesRoute({ searchParams }: PageProps) {
  const headersList = await headers()
  const sp = await searchParams
  const school = resolveSchool(headersList, sp)
  const editing = isEditPreview(sp)
  const data = await getSiteData(school, resolvePreviewMode(sp), resolvePreviewToken(sp))

  return <>{renderTemplate(data, 'facilities', school, editing)}{editing && <InlineEditLayer />}</>
}

export const dynamic = 'force-dynamic'
