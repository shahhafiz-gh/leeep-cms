import { buildSiteMetadata, renderSitePage, type TenantParams } from '@/lib/site-page'

type Props = { params: TenantParams }
export const revalidate = 3600
export function generateStaticParams() { return [] }

export async function generateMetadata({ params }: Props) {
  const metadata = await buildSiteMetadata(params, '/request-mobile-change', () => ({
    title: 'Request mobile number change', description: 'Request a change to your registered mobile number for school review.',
  }))
  return { ...metadata, robots: { index: false, follow: false } }
}

export default function MobileChangePage({ params }: Props) {
  return renderSitePage(params, 'request-mobile-change', '/request-mobile-change')
}
