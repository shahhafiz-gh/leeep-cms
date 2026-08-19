import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getSiteData, resolveSchool, isEditPreview, type RouteSearchParams } from '@/lib/cms'
import { renderTemplate } from '@/lib/render-template'
import { buildMetadata } from '@/lib/metadata'
import InlineEditLayer from '@/shared/InlineEditLayer'

/**
 * The admission application form, on its own route.
 *
 * `/admissions` stays an information page (process, criteria, class-wise
 * details); this is where a family actually applies. The split also lets the
 * admissions page tell the truth when the school is not admitting — it simply
 * does not link here — and gives the form a URL that can be shared or
 * deep-linked with `?admission=` / `?program=` from the class table.
 */

type PageProps = { searchParams: Promise<RouteSearchParams> }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const headersList = await headers()
  const sp = await searchParams
  const data = await getSiteData(resolveSchool(headersList, sp), 'published')
  return buildMetadata({
    seo: data.seo,
    schoolName: data.name,
    title: 'Apply',
    description: `Apply for admission to ${data.name}.`,
  })
}

export default async function AdmissionsApplyPage({ searchParams }: PageProps) {
  const headersList = await headers()
  const sp = await searchParams
  const school = resolveSchool(headersList, sp)
  const editing = isEditPreview(sp)
  const data = await getSiteData(school, 'published')
  return (
    <>
      {renderTemplate(data, 'admissions-apply', school, editing)}
      {editing && <InlineEditLayer />}
    </>
  )
}

export const dynamic = 'force-dynamic'
