import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getSiteData, resolveSchool, isEditPreview, type RouteSearchParams } from '@/lib/cms'
import { renderTemplate } from '@/lib/render-template'
import { buildMetadata } from '@/lib/metadata'
import InlineEditLayer from '@/shared/InlineEditLayer'

/**
 * "Check my application status", on its own route.
 *
 * Separate from `/admissions` (an information page) and `/admissions/apply`
 * (where a family applies): a parent coming back a fortnight later wants
 * neither of those, and making them hunt through the admissions page for a
 * lookup box is how they end up phoning the office instead.
 *
 * There is nothing school-specific in the URL — the lookup itself needs an
 * application number and a date of birth, which is what keeps one family's
 * outcome from being readable by anyone else.
 */

type PageProps = { searchParams: Promise<RouteSearchParams> }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const headersList = await headers()
  const sp = await searchParams
  const data = await getSiteData(resolveSchool(headersList, sp), 'published')
  return buildMetadata({
    favicon: data.config?.favicon,
    seo: data.seo,
    schoolName: data.name,
    title: 'Application status',
    description: `Check the status of your application to ${data.name}.`,
  })
}

export default async function AdmissionsStatusPage({ searchParams }: PageProps) {
  const headersList = await headers()
  const sp = await searchParams
  const school = resolveSchool(headersList, sp)
  const editing = isEditPreview(sp)
  const data = await getSiteData(school, 'published')
  return (
    <>
      {renderTemplate(data, 'admissions-status', school, editing)}
      {editing && <InlineEditLayer />}
    </>
  )
}

export const dynamic = 'force-dynamic'
