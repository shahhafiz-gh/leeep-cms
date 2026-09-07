'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'
import { isSectionVisible } from '@/shared/section-visibility'
import {
  contactEntryLabel,
  contactEntryValue,
  contactPhoneDisplay,
  contactPhoneHref,
} from '@/lib/contact-entry'

/**
 * Three-tier chrome, matching the school's existing site:
 *
 *   1. a near-white utility bar (email + social),
 *   2. a tall header band — logo left, then "call us now" / opening hours /
 *      app-download cards right,
 *   3. a white sticky nav with uppercase Poppins links and hover dropdowns.
 *
 * Every value is CMS-owned. The two app buttons come from `portalLinks`, which
 * already models a labelled outbound link with a primary/dark emphasis, so the
 * school edits them like any other field instead of the template hardcoding
 * store URLs.
 */
export default function Header({ data }: { data: SchoolData }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navLinks = (data.navigation ?? []).filter(
    (item) => item.href !== '/login' && item.label.toLowerCase() !== 'login',
  )
  const email = data.contact?.email?.[0]
  const phones = (data.contact?.phone ?? []).slice(0, 2)
  const appLinks = isSectionVisible(data, 'siteAppLinks') ? (data.portalLinks ?? []).slice(0, 2) : []
  // A school with more than one campus applies per campus, often on a different
  // site entirely, so the apply action becomes a small menu instead of a link.
  const campuses = isSectionVisible(data, 'siteCampuses')
    ? (data.campuses ?? []).filter((c) => c.name && c.admissionUrl)
    : []

  const active = (href: string) => {
    const normalise = (value: string) => value.replace(/\/+$/, '') || '/'
    return normalise(pathname) === normalise(href)
  }

  return (
    <header className="relative z-40">
      {/* ── Utility bar ───────────────────────────────────────────────── */}
      <div className="border-b border-th-line bg-th-paper">
        <div className="mx-auto flex min-h-9 max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 text-xs lg:px-8">
          <div className="flex min-w-0 items-center gap-5">
            {email && (
              <a
                href={`mailto:${contactEntryValue(email)}`}
                className="flex min-w-0 items-center gap-2 text-th-body transition-colors hover:text-th-primary"
              >
                <Icon icon="lucide:mail" className="h-3.5 w-3.5 shrink-0 text-th-primary" />
                <span className="truncate">{contactEntryValue(email)}</span>
              </a>
            )}
            {phones.map((phone, i) => (
              <a
                key={`phone-${i}`}
                href={contactPhoneHref(phone)}
                className="hidden items-center gap-2 text-th-body transition-colors hover:text-th-primary sm:flex"
              >
                <Icon icon="lucide:phone" className="h-3.5 w-3.5 shrink-0 text-th-primary" />
                <span>{contactPhoneDisplay(phone)}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {(data.socialLinks ?? []).map((social) => {
              if (!social.url || social.url === '#') return null
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="text-th-primary transition-opacity hover:opacity-70"
                >
                  <Icon icon={social.icon || `ri:${social.platform}-fill`} className="h-3.5 w-3.5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Header band ───────────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-4 px-4 py-5 lg:px-8">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
            {data.logo ? (
              <Image
                src={data.logo}
                alt={`${data.name} logo`}
                width={80}
                height={80}
                data-edit-img="logo"
                className="h-16 w-16 shrink-0 object-contain"
              />
            ) : (
              <span
                data-edit-img="logo"
                className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-th-primary text-white"
              >
                <Icon icon="lucide:graduation-cap" className="h-8 w-8" />
              </span>
            )}
            <span className="min-w-0">
              <span
                data-edit="name"
                data-style="name"
                style={styleObject(data, 'name')}
                className="block text-base font-bold uppercase leading-tight tracking-[0.01em] text-th-heading sm:text-lg"
              >
                {data.name}
              </span>
              {data.tagline && (
                <span
                  data-edit="tagline"
                  className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-th-primary"
                >
                  {data.tagline}
                </span>
              )}
            </span>
          </Link>

          {/* Info cards — hidden below xl where they would wrap into a wall. */}
          <div className="ml-auto hidden items-center gap-7 xl:flex">
            {phones[0] && (
              <InfoCard
                icon="lucide:phone-call"
                title={contactEntryLabel(phones[0]) || 'Call us now'}
                detail={contactPhoneDisplay(phones[0])}
                href={contactPhoneHref(phones[0])}
              />
            )}
            {data.contact?.workingHours && (
              <InfoCard icon="lucide:clock" title="Opening hours" detail={data.contact.workingHours} />
            )}
          </div>

          {appLinks.length > 0 && (
            <div className="hidden items-center gap-2.5 lg:flex">
              {appLinks.map((link, i) => (
                <a
                  key={`app-${i}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-sm px-3.5 py-2.5 text-[11px] font-semibold uppercase leading-tight tracking-wide transition-colors ${
                    link.variant === 'dark'
                      ? 'bg-th-heading text-white hover:bg-black'
                      : 'bg-th-primary text-white hover:bg-th-primary-600'
                  }`}
                >
                  <Icon icon="lucide:download" className="h-4 w-4 shrink-0" />
                  <span className="text-left">{link.label}</span>
                </a>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-th-primary text-white lg:hidden"
          >
            <Icon icon={open ? 'lucide:x' : 'lucide:menu'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Sticky nav ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 hidden border-y border-th-line bg-white shadow-[0_4px_16px_rgba(34,34,34,0.06)] lg:block">
        <nav className="mx-auto flex max-w-7xl items-stretch px-4 lg:px-8">
          {navLinks.map((item) => {
            const children = item.children ?? []
            const selected = active(item.href) || children.some((child) => active(child.href))
            return (
              <div key={`${item.href}-${item.label}`} className="group/nav relative flex items-stretch">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3.5 py-5 text-[13px] font-semibold uppercase tracking-[0.02em] transition-colors xl:px-4 ${
                    selected ? 'text-th-primary' : 'text-th-heading hover:text-th-primary'
                  }`}
                >
                  {item.label}
                  {children.length > 0 && <Icon icon="lucide:chevron-down" className="h-3.5 w-3.5" />}
                </Link>
                {/* The reference site draws its active/hover rule along the TOP
                    of the item, not underneath it. */}
                <span
                  className={`absolute inset-x-3 top-0 h-[2px] bg-th-primary transition-transform ${
                    selected ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
                  }`}
                />
                {children.length > 0 && (
                  <div className="invisible absolute left-0 top-full min-w-56 translate-y-2 border-t-2 border-th-primary bg-white py-1.5 opacity-0 shadow-xl transition-all group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
                    {children.map((child) => (
                      <Link
                        key={`${child.href}-${child.label}`}
                        href={child.href}
                        className="block px-4 py-2.5 text-[13px] font-medium text-th-heading transition-colors hover:bg-th-paper hover:text-th-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {campuses.length > 0 && (
            <div className="group/campus relative ml-auto flex items-center">
              <button
                type="button"
                className="flex items-center gap-1.5 bg-th-primary px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.02em] text-white transition-colors hover:bg-th-primary-600"
              >
                <Icon icon="lucide:graduation-cap" className="h-4 w-4" />
                Online Admission
                <Icon icon="lucide:chevron-down" className="h-3.5 w-3.5" />
              </button>
              <div className="invisible absolute right-0 top-full z-10 min-w-56 translate-y-2 border-t-2 border-th-primary bg-white py-1.5 opacity-0 shadow-xl transition-all group-hover/campus:visible group-hover/campus:translate-y-0 group-hover/campus:opacity-100 group-focus-within/campus:visible group-focus-within/campus:translate-y-0 group-focus-within/campus:opacity-100">
                {campuses.map((campus, i) => (
                  <a
                    key={`campus-${i}`}
                    href={campus.admissionUrl}
                    className="block px-4 py-2.5 text-[13px] font-medium text-th-heading transition-colors hover:bg-th-paper hover:text-th-primary"
                  >
                    {campus.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* ── Mobile nav ────────────────────────────────────────────────── */}
      {open && (
        <nav className="border-t border-th-line bg-white px-4 pb-5 lg:hidden">
          {navLinks.map((item) => (
            <div key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block border-b border-th-line py-3 text-sm font-semibold uppercase ${
                  active(item.href) ? 'text-th-primary' : 'text-th-heading'
                }`}
              >
                {item.label}
              </Link>
              {(item.children ?? []).map((child) => (
                <Link
                  key={`${child.href}-${child.label}`}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-th-line py-2.5 pl-4 text-sm text-th-body"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          {campuses.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-th-muted">
                Online Admission
              </p>
              {campuses.map((campus, i) => (
                <a
                  key={`m-campus-${i}`}
                  href={campus.admissionUrl}
                  className="block border-b border-th-line py-2.5 text-sm text-th-heading"
                >
                  {campus.name}
                </a>
              ))}
            </div>
          )}

          {appLinks.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {appLinks.map((link, i) => (
                <a
                  key={`app-${i}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-sm px-4 py-3 text-xs font-semibold uppercase tracking-wide ${
                    link.variant === 'dark' ? 'bg-th-heading text-white' : 'bg-th-primary text-white'
                  }`}
                >
                  <Icon icon="lucide:download" className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </nav>
      )}
    </header>
  )
}

function InfoCard({
  icon,
  title,
  detail,
  href,
}: {
  icon: string
  title: string
  detail: string
  href?: string
}) {
  const body = (
    <>
      <Icon icon={icon} className="h-8 w-8 shrink-0 text-th-primary" />
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold leading-tight text-th-heading">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-th-body">{detail}</span>
      </span>
    </>
  )
  const className = 'flex items-center gap-3'
  return href ? (
    <a href={href} className={`${className} transition-opacity hover:opacity-80`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}
