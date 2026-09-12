import type { Metadata } from 'next'
import dynamicImport from 'next/dynamic'
import { notFound } from 'next/navigation'
import type { PageType } from '@/types/school.types'
import {
  getSiteData,
  isEditPreview,
  resolvePreviewMode,
  resolvePreviewToken,
  type RouteSearchParams,
} from '@/lib/cms'
import { isAllowedBackend, tenantFromParams, type Tenant } from '@/lib/tenant'
import { renderTemplate } from '@/lib/render-template'
import { buildMetadata } from '@/lib/metadata'

/**
 * The BUILDER's live preview — every public page, rendered from draft content
 * with the inline-edit layer attached.
 *
 * This exists as a route of its own so that the public site does not have to
 * pay for it. Preview is authenticated, shows unpublished content, and changes
 * on every keystroke, so it must be rendered per request; the public pages must
 * not be, which is the whole point of the split. Reaching them through one
 * route meant `?preview=` had to be read on every public page, and reading a
 * query string is exactly what stopped those pages from being cacheable.
 *
 * `middleware.ts` rewrites `…/about?preview=1&token=…` here, so the builder's
 * existing preview URLs keep working untouched.
 */

export const dynamic = 'force-dynamic'

/** The editor layer is ~1,000 lines that no public visitor ever needs. */
const InlineEditLayer = dynamicImport(() => import('@/shared/InlineEditLayer'))

type Props = {
  params: Promise<{ host: string; slug: string; path?: string[] }>
  searchParams: Promise<RouteSearchParams>
}

/** Map the previewed path back to the page type its route would render. */
function pageTypeFor(segments: string[]): PageType | null {
  const path = `/${segments.join('/')}`.replace(/\/+$/, '') || '/'
  switch (path) {
    case '/':
      return 'home'
    case '/about':
      return 'about'
    case '/about/team':
      return 'team'
    case '/academics':
      return 'academics'
    case '/admissions':
      return 'admissions'
    case '/admissions/apply':
      return 'admissions-apply'
    case '/admissions/status':
      return 'admissions-status'
    case '/contact':
      return 'contact'
    case '/facilities':
      return 'facilities'
    case '/gallery':
      return 'gallery'
    case '/privacy':
      return 'privacy'
    default:
      // Announcement detail pages render the updates view, which picks the
      // announcement out of the payload client-side.
      return path === '/updates' || path.startsWith('/updates/') ? 'updates' : null
  }
}

/**
 * The builder runs on the school's own Frappe site and passes `?backend=` so
 * the shared renderer host knows where to read from. Trust it only after the
 * same zone check the middleware applies.
 */
async function resolvePreviewTenant(
  host: string,
  slug: string,
  sp: RouteSearchParams,
): Promise<Tenant | null> {
  const raw = sp.backend
  const fromQuery = (Array.isArray(raw) ? raw[0] : raw)?.replace(/\/$/, '')
  if (fromQuery && isAllowedBackend(fromQuery)) {
    return { host: decodeURIComponent(host), backend: fromQuery, slug: slug === '-' ? '' : slug }
  }
  return tenantFromParams(host, slug)
}

/**
 * The preview iframe shows the school's own tab title, matching what the page
 * will look like once published. Never indexed: the route is `noindex` because
 * it serves unpublished content at a URL that is not the school's real one.
 */
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { host, slug, path } = await params
  const sp = await searchParams
  const tenant = await resolvePreviewTenant(host, slug, sp)
  if (!tenant) return { title: 'Preview', robots: { index: false, follow: false } }
  try {
    const data = await getSiteData(tenant, resolvePreviewMode(sp), resolvePreviewToken(sp))
    return {
      ...buildMetadata({ favicon: data.config?.favicon, seo: data.seo, schoolName: data.name }),
      title: `${pageTypeFor(path ?? []) ?? 'Preview'} · ${data.name}`,
      robots: { index: false, follow: false },
    }
  } catch {
    return { title: 'Preview', robots: { index: false, follow: false } }
  }
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const { host, slug, path } = await params
  const sp = await searchParams

  const page = pageTypeFor(path ?? [])
  if (!page) notFound()

  const tenant = await resolvePreviewTenant(host, slug, sp)
  if (!tenant) notFound()

  // An invalid or expired token simply falls back to published content rather
  // than erroring: the editor sees the live site and knows to reopen the builder.
  const editing = isEditPreview(sp)
  const data = await getSiteData(tenant, resolvePreviewMode(sp), resolvePreviewToken(sp))

  // `renderTemplate` folds in the editor-only navigation itself when editing.
  return (
    <>
      {renderTemplate(data, page, tenant.slug || tenant.host, editing)}
      {editing && <InlineEditLayer />}
    </>
  )
}
