import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getSiteData, resolveSchool, isEditPreview, type RouteSearchParams } from '@/lib/cms'
import { renderTemplate } from '@/lib/render-template'
import { buildMetadata } from '@/lib/metadata'
import InlineEditLayer from '@/shared/InlineEditLayer'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<RouteSearchParams>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params
  const headersList = await headers()
  const sp = await searchParams
  // Published content for metadata (see HomePage note on draft auth).
  const data = await getSiteData(resolveSchool(headersList, sp), 'published')
  const announcement = data.updates.announcements.find((a) => a.id === id)
  return buildMetadata({
    seo: data.seo,
    schoolName: data.name,
    title: announcement?.title ?? 'Update',
    description: announcement?.short_description ?? undefined,
  })
}

export default async function UpdateDetailPage({ params, searchParams }: Props) {
  await params
  const headersList = await headers()
  const sp = await searchParams
  const school = resolveSchool(headersList, sp)
  const editing = isEditPreview(sp)
  // Content stays PUBLISHED even in editor preview for now — authenticated draft
  // fetching is wired later. The inline-edit layer is capture-only, so published
  // content is a correct base to edit against (mirrors the home route).
  const data = await getSiteData(school, 'published')
  // The update id is read via useParams() inside the client-side UpdatesView.
  return (
    <>
      {renderTemplate(data, 'updates', school, editing)}
      {/* Inline-edit layer: injected ONLY for an editor preview
          (?preview=1&token=<PREVIEW_SECRET>). Capture-only. */}
      {editing && <InlineEditLayer />}
    </>
  )
}

export const dynamic = 'force-dynamic'
