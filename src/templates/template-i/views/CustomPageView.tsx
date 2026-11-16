import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { CustomPage, CustomPageBlock, SchoolData } from '@/types/school.types'
import { findCustomPage, findGroup, pageHref } from '@/lib/custom-pages'
import PageShell from '../components/PageShell'
import PageBlocks from '../components/blocks/PageBlocks'

/**
 * `/<slug>`: a school-authored page, or — when the slug names a menu group
 * rather than a page — that group's index, a card per page in it.
 */
export default function CustomPageView({ data, slug }: { data: SchoolData; slug?: string }) {
  const page = slug ? findCustomPage(data, slug) : null
  if (page) {
    const index = (data.pages ?? []).indexOf(page)
    const base = index >= 0 ? `pages.${index}` : undefined
    const blocks = page.blocks ?? []
    // A page that is one form or one wide table reads better without the sidebar.
    const wide = blocks.length > 0 && blocks.every((b) => b.type === 'form' || b.type === 'table')
    return (
      <PageShell
        data={data}
        title={page.title}
        summary={repeatsBody(page.summary, blocks) ? undefined : page.summary}
        heroImage={page.heroImage}
        titlePath={base ? `${base}.title` : undefined}
        summaryPath={base ? `${base}.summary` : undefined}
        wide={wide}
      >
        {blocks.length ? (
          <PageBlocks blocks={blocks} page={page.slug} basePath={base ? `${base}.blocks` : undefined} />
        ) : (
          <p className="rounded-xl bg-white p-8 text-ts-muted shadow-sm ring-1 ring-ts-line">
            This page is being written. Please check back soon.
          </p>
        )}
      </PageShell>
    )
  }

  const group = slug ? findGroup(data, slug) : null
  if (!group) return null
  return (
    <PageShell data={data} title={group.label}>
      <PageCards pages={group.pages} />
    </PageShell>
  )
}

/** A summary that only restates the page's opening line is left off the banner. */
function repeatsBody(summary: string | undefined, blocks: CustomPageBlock[]): boolean {
  const plain = (text: string) => text.replace(/[*_[\]()#>]/g, '').replace(/…$/, '').replace(/\s+/g, ' ').trim().toLowerCase()
  const lead = blocks.find((b) => b.type === 'text' && b.body)?.body
  return Boolean(summary && lead && plain(lead).startsWith(plain(summary).slice(0, 80)))
}

/** Cards linking to custom pages — a group index, and the landing pages' "explore" grids. */
export function PageCards({ pages }: { pages: CustomPage[] }) {
  if (!pages.length) return null
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {pages.map((page) => (
        <Link
          key={page.slug}
          href={pageHref(page)}
          className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ts-line transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {page.heroImage ? (
            <img src={page.heroImage} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
          ) : (
            <span className="grid aspect-[16/9] place-items-center bg-gradient-to-br from-ts-primary to-ts-navy text-white/80">
              <Icon icon="lucide:book-open-text" className="h-10 w-10" />
            </span>
          )}
          <span className="flex flex-1 flex-col p-5">
            <span className="text-lg font-bold text-ts-heading group-hover:text-ts-primary">{page.navLabel || page.title}</span>
            {page.summary && <span className="mt-2 line-clamp-3 text-[15px] leading-6 text-ts-body">{page.summary}</span>}
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-ts-primary">
              Read more <Icon icon="lucide:arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
      ))}
    </div>
  )
}

