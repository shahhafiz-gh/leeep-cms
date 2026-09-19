'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { NavigationItem, SchoolData } from '@/types/school.types'
import { contactEntryValue, contactPhoneDisplay, contactPhoneHref } from '@/lib/contact-entry'
import { longDate } from '@/shared/utils/format'

interface PageShellProps {
  data: SchoolData
  title: string
  summary?: string
  heroImage?: string
  /** Edit paths for the builder's inline editor, when the copy lives in content. */
  titlePath?: string
  summaryPath?: string
  /** Pages without a sidebar (a form, a wide table) use the full width. */
  wide?: boolean
  children: React.ReactNode
}

function normalise(href: string) {
  return href.split('#')[0].replace(/\/+$/, '') || '/'
}

/** The menu group the current page belongs to — its parent entry and siblings. */
function sectionFor(nav: NavigationItem[], path: string): NavigationItem | null {
  for (const item of nav) {
    if (normalise(item.href) === path && item.children?.length) return item
    if ((item.children ?? []).some((child) => normalise(child.href) === path)) return item
  }
  return null
}

/**
 * Every inner page: a navy banner with the title and a breadcrumb, then the
 * page body beside a sidebar. The sidebar lists the other pages in the same
 * menu group — so a family reading "Syllabus" can step to "Examination System"
 * without going back up to the menu — and closes with the school's contact
 * details and the latest notices.
 */
export default function PageShell({
  data,
  title,
  summary,
  heroImage,
  titlePath,
  summaryPath,
  wide,
  children,
}: PageShellProps) {
  const path = normalise(usePathname() ?? '/')
  const section = sectionFor(data.navigation ?? [], path)
  const crumbs = [{ label: 'Home', href: '/' }]
  if (section && normalise(section.href) !== path) crumbs.push({ label: section.label, href: section.href })

  return (
    <>
      <section className="relative overflow-hidden bg-ts-navy text-white">
        {heroImage && (
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ts-navy via-ts-navy/90 to-ts-primary/70" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/70">
            {crumbs.map((crumb) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                <Link href={crumb.href} className="hover:text-ts-accent">
                  {crumb.label}
                </Link>
                <Icon icon="lucide:chevron-right" className="h-3 w-3" />
              </span>
            ))}
            <span className="text-ts-accent">{title}</span>
          </nav>
          <h1 data-edit={titlePath} className="mt-3 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {summary && (
            <p data-edit={summaryPath} className="mt-4 max-w-3xl text-base leading-7 text-white/80 sm:text-lg">
              {summary}
            </p>
          )}
        </div>
      </section>

      <div className="bg-ts-paper">
        <div
          className={`mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:px-8 lg:py-14 ${
            wide ? '' : 'lg:grid-cols-[minmax(0,1fr)_320px]'
          }`}
        >
          <div className="min-w-0">{children}</div>
          {!wide && <Sidebar data={data} section={section} path={path} />}
        </div>
      </div>
    </>
  )
}

function Sidebar({ data, section, path }: { data: SchoolData; section: NavigationItem | null; path: string }) {
  const phone = data.contact?.phone?.[0]
  const email = data.contact?.email?.[0]
  const notices = (data.updates?.announcements ?? []).slice(0, 4)

  return (
    <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
      {section && (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ts-line">
          <h2 className="bg-ts-primary px-5 py-3.5 text-lg font-bold text-white">{section.label}</h2>
          <ul>
            {(section.children ?? []).map((child) => {
              const active = normalise(child.href) === path
              return (
                <li key={child.href} className="border-t border-ts-line first:border-t-0">
                  <Link
                    href={child.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between gap-3 border-l-4 px-5 py-3 text-[15px] transition-colors ${
                      active
                        ? 'border-ts-accent bg-ts-primary-50 font-bold text-ts-primary-700'
                        : 'border-transparent text-ts-heading hover:bg-ts-paper hover:text-ts-primary'
                    }`}
                  >
                    {child.label}
                    <Icon icon="lucide:chevron-right" className="h-4 w-4 shrink-0 opacity-50" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="rounded-xl bg-ts-navy p-6 text-white/85">
        <h2 className="text-lg font-bold text-white">Contact us</h2>
        <span className="mt-2 block h-0.5 w-10 bg-ts-accent" />
        <ul className="mt-4 space-y-3 text-[15px]">
          {email && (
            <li className="flex gap-3">
              <Icon icon="lucide:mail" className="mt-1 h-4 w-4 shrink-0 text-ts-accent" />
              <a href={`mailto:${contactEntryValue(email)}`} className="break-all hover:text-ts-accent">
                {contactEntryValue(email)}
              </a>
            </li>
          )}
          {phone && (
            <li className="flex gap-3">
              <Icon icon="lucide:phone" className="mt-1 h-4 w-4 shrink-0 text-ts-accent" />
              <a href={contactPhoneHref(phone)} className="hover:text-ts-accent">
                {contactPhoneDisplay(phone)}
              </a>
            </li>
          )}
          {data.contact?.address && (
            <li className="flex gap-3">
              <Icon icon="lucide:map-pin" className="mt-1 h-4 w-4 shrink-0 text-ts-accent" />
              <span>{data.contact.address}</span>
            </li>
          )}
        </ul>
      </div>

      {notices.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ts-line">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ts-heading">
            <Icon icon="lucide:bell-ring" className="h-5 w-5 text-ts-accent-600" />
            Notifications
          </h2>
          <ul className="mt-4 space-y-3">
            {notices.map((notice) => (
              <li key={notice.id}>
                <Link href={`/updates/${notice.id}`} className="group block">
                  <span className="block text-[15px] font-semibold leading-snug text-ts-primary-700 group-hover:underline">
                    {notice.title}
                  </span>
                  {notice.published_date && (
                    <span className="mt-0.5 block text-xs text-ts-muted">{longDate(notice.published_date)}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/updates" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-ts-primary hover:underline">
            View all <Icon icon="lucide:arrow-right" className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </aside>
  )
}
