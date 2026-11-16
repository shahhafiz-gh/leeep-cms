'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { NavigationItem, SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'
import { isSectionVisible } from '@/shared/section-visibility'
import { contactEntryValue, contactPhoneDisplay, contactPhoneHref } from '@/lib/contact-entry'

/**
 * Scholars chrome, top to bottom:
 *
 *   1. a navy utility bar — phone and email left, the school's quick links
 *      right (`portalLinks`; a `primary` link becomes the amber call to action),
 *   2. a white masthead — crest, name and tagline, with the school's motto
 *      (`quote.text`) set in italic on the right,
 *   3. a sticky royal-blue menu with dropdowns,
 *   4. an amber ribbon of notices (`ticker`, else the latest announcements).
 */
export default function Header({ data }: { data: SchoolData }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const nav = (data.navigation ?? []).filter((item) => item.href !== '/login')
  const phone = data.contact?.phone?.[0]
  const email = data.contact?.email?.[0]
  const quickLinks = isSectionVisible(data, 'siteQuickLinks') ? data.portalLinks ?? [] : []
  const motto = data.quote?.text?.trim()

  const current = (href: string) => {
    const normalise = (value: string) => value.split('#')[0].replace(/\/+$/, '') || '/'
    return normalise(pathname ?? '/') === normalise(href)
  }
  const selected = (item: NavigationItem) =>
    current(item.href) || (item.children ?? []).some((child) => current(child.href))

  return (
    <header className="relative z-40">
      {/* ── Utility bar ─────────────────────────────────────────────── */}
      <div className="bg-ts-navy text-white/85">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1.5 px-4 py-2 text-[13px] lg:px-8">
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1">
            {phone && (
              <a href={contactPhoneHref(phone)} className="flex items-center gap-2 hover:text-ts-accent">
                <Icon icon="lucide:phone" className="h-3.5 w-3.5 text-ts-accent" />
                {contactPhoneDisplay(phone)}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${contactEntryValue(email)}`}
                className="hidden items-center gap-2 hover:text-ts-accent sm:flex"
              >
                <Icon icon="lucide:mail" className="h-3.5 w-3.5 text-ts-accent" />
                {contactEntryValue(email)}
              </a>
            )}
          </div>
          {quickLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {quickLinks.map((link, i) =>
                link.variant === 'primary' ? (
                  <QuickLink
                    key={`q-${i}`}
                    href={link.url}
                    className="rounded-full bg-ts-accent px-3.5 py-1 text-[12px] font-bold uppercase tracking-wide text-ts-navy hover:bg-ts-accent-600"
                  >
                    {link.label}
                  </QuickLink>
                ) : (
                  <QuickLink key={`q-${i}`} href={link.url} className="hover:text-ts-accent">
                    {link.label}
                  </QuickLink>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Masthead ────────────────────────────────────────────────── */}
      <div className="border-b-4 border-ts-accent bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-8 lg:py-5">
          <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
            {data.logo ? (
              <Image
                src={data.logo}
                alt={`${data.name} crest`}
                width={88}
                height={88}
                data-edit-img="logo"
                className="h-14 w-14 shrink-0 object-contain sm:h-20 sm:w-20"
              />
            ) : (
              <span
                data-edit-img="logo"
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ts-primary text-white sm:h-20 sm:w-20"
              >
                <Icon icon="lucide:book-open" className="h-8 w-8" />
              </span>
            )}
            <span className="min-w-0">
              <span
                data-edit="name"
                data-style="name"
                style={styleObject(data, 'name')}
                className="block font-[family-name:var(--font-ts-serif)] text-xl font-bold leading-tight text-ts-primary-700 sm:text-3xl"
              >
                {data.name}
              </span>
              {data.tagline && (
                <span
                  data-edit="tagline"
                  className="mt-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-ts-teal sm:text-xs"
                >
                  {data.tagline}
                </span>
              )}
            </span>
          </Link>

          {motto && (
            <p
              data-edit="quote.text"
              className="ml-auto hidden max-w-xs border-l-2 border-ts-accent pl-4 text-right font-[family-name:var(--font-ts-serif)] text-base italic leading-snug text-ts-primary-700 lg:block"
            >
              {motto}
            </p>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-md bg-ts-primary text-white lg:hidden"
          >
            <Icon icon={open ? 'lucide:x' : 'lucide:menu'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Menu ────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 hidden bg-ts-primary shadow-[0_6px_18px_rgba(23,42,68,0.18)] lg:block">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-stretch justify-center px-4 lg:px-8">
          {nav.map((item) => {
            const children = item.children ?? []
            const active = selected(item)
            return (
              <div key={`${item.href}-${item.label}`} className="group/nav relative flex">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] transition-colors xl:px-4 ${
                    active ? 'bg-ts-primary-700 text-ts-accent' : 'text-white hover:bg-ts-primary-600'
                  }`}
                >
                  {item.label}
                  {children.length > 0 && <Icon icon="lucide:chevron-down" className="h-3.5 w-3.5 opacity-80" />}
                </Link>
                {children.length > 0 && (
                  <div className="invisible absolute left-0 top-full min-w-60 translate-y-1 rounded-b-md border-t-[3px] border-ts-accent bg-white py-2 opacity-0 shadow-xl transition-all group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
                    {children.map((child) => (
                      <Link
                        key={`${child.href}-${child.label}`}
                        href={child.href}
                        className={`block border-l-[3px] px-4 py-2 text-[14px] transition-colors ${
                          current(child.href)
                            ? 'border-ts-primary bg-ts-primary-50 font-semibold text-ts-primary-700'
                            : 'border-transparent text-ts-heading hover:border-ts-primary hover:bg-ts-paper hover:text-ts-primary'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────── */}
      {open && (
        <nav className="border-b border-ts-line bg-white px-4 pb-4 shadow-lg lg:hidden">
          {nav.map((item) => {
            const children = item.children ?? []
            const isOpen = expanded === item.href
            return (
              <div key={`${item.href}-${item.label}`} className="border-b border-ts-line">
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide ${
                      selected(item) ? 'text-ts-primary' : 'text-ts-heading'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {children.length > 0 && (
                    <button
                      type="button"
                      aria-label={`Show ${item.label} pages`}
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : item.href)}
                      className="grid h-10 w-10 place-items-center text-ts-muted"
                    >
                      <Icon icon="lucide:chevron-down" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {isOpen &&
                  children.map((child) => (
                    <Link
                      key={`${child.href}-${child.label}`}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="block border-t border-ts-line py-2.5 pl-4 text-sm text-ts-body"
                    >
                      {child.label}
                    </Link>
                  ))}
              </div>
            )
          })}
        </nav>
      )}

      <NoticeRibbon data={data} />
    </header>
  )
}

/** A quick link: an in-site path navigates client-side, anything else opens out. */
function QuickLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link href={href} className={`transition-colors ${className}`}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`transition-colors ${className}`}>
      {children}
    </a>
  )
}

/**
 * The amber ribbon of one-line notices. Authored items (`ticker`) win; without
 * them it runs the newest announcements, so a notice published once shows here,
 * on the home board and on Updates alike.
 */
function NoticeRibbon({ data }: { data: SchoolData }) {
  if (!isSectionVisible(data, 'ticker')) return null
  const authored = (data.ticker ?? []).filter((item) => item.text?.trim())
  const items = authored.length
    ? authored
    : (data.updates?.announcements ?? []).slice(0, 6).map((a) => ({ text: a.title, href: `/updates/${a.id}` }))
  if (!items.length) return null

  // Twice over, so the -50% translate lands exactly where the loop started.
  const loop = [...items, ...items]
  return (
    <div className="ts-ticker flex items-stretch overflow-hidden bg-ts-accent text-ts-navy">
      <span className="z-10 flex shrink-0 items-center gap-2 bg-ts-navy px-4 text-[12px] font-bold uppercase tracking-wider text-ts-accent">
        <Icon icon="lucide:megaphone" className="h-4 w-4" />
        <span className="hidden sm:inline">Notices</span>
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden py-2">
        <div
          className="ts-ticker-track flex w-max items-center"
          style={{ ['--ts-ticker-duration' as string]: `${Math.max(20, items.length * 9)}s` }}
        >
          {loop.map((item, i) => (
            <span key={i} className="flex items-center" aria-hidden={i >= items.length}>
              {item.href ? (
                <Link
                  href={item.href}
                  tabIndex={i >= items.length ? -1 : undefined}
                  className="px-6 text-[14px] font-semibold hover:underline"
                >
                  {item.text}
                </Link>
              ) : (
                <span className="px-6 text-[14px] font-semibold">{item.text}</span>
              )}
              <Icon icon="lucide:sparkle" className="h-3 w-3 opacity-60" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
