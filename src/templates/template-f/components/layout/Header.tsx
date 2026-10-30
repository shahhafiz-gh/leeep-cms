'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from '@/shared/SiteImage'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'

/**
 * Almanac header — sticky, hairline-separated, with the navigation living inside a
 * single sand "pill track". The track is the design's signature, so on desktop
 * the links stay in it and only collapse to a sheet below `lg`.
 */
export default function Header({ data }: { data: SchoolData }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    const norm = (h: string) => h.replace(/\/+$/, '') || '/'
    return norm(pathname) === norm(href)
  }

  // Auth links belong in the top-right utility slot, not the pill track.
  const navLinks = (data.navigation ?? []).filter(
    (n) => n.href !== '/login' && n.label.toLowerCase() !== 'login',
  )
  const loginLink = (data.navigation ?? []).find(
    (n) => n.href === '/login' || n.label.toLowerCase() === 'login',
  )

  return (
    <header className="sticky top-0 z-30 border-b border-tf-rail bg-tf-paper">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-8 lg:gap-8 lg:px-12 lg:py-[22px]">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-3 whitespace-nowrap">
          {data.logo ? (
            <Image
              src={data.logo}
              alt={`${data.name} logo`}
              width={52}
              height={52}
              data-edit-img="logo"
              className="max-h-[30px] max-w-[30px] shrink-0 rounded-md object-contain"
            />
          ) : (
            <span data-edit-img="logo" className="block h-[26px] w-[26px] shrink-0 rounded-md bg-tf-accent" />
          )}
          <span
            data-edit="name"
            data-style="name"
            style={styleObject(data, 'name')}
            className="max-w-[46vw] truncate text-[17px] font-bold tracking-[-0.02em] text-tf-ink sm:max-w-none lg:text-[19px]"
          >
            {data.name}
          </span>
        </Link>

        {/* Pill nav (desktop).
            An item with `children` keeps its own link AND opens a menu: the
            server sends Facilities/Downloads/About with sub-pages, and a parent
            that is only a menu trigger strands its own page. The menu opens on
            hover and on keyboard focus (`focus-within`), so it is reachable by
            tab without needing JS state per item. */}
        <nav className="hidden min-w-0 items-center gap-1 rounded-full bg-tf-rail p-[5px] lg:flex">
          {navLinks.map((link) => {
            const children = link.children ?? []
            const active = isActive(link.href) || children.some((c) => isActive(c.href))
            return (
              <div key={`${link.href}-${link.label}`} className="group/nav relative">
                <Link
                  href={link.href}
                  aria-haspopup={children.length > 0 || undefined}
                  className={`flex items-center gap-1 rounded-full px-4 py-[9px] text-[14.5px] font-medium whitespace-nowrap transition-colors ${
                    active ? 'bg-tf-ink text-tf-on-ink shadow-sm' : 'text-tf-body hover:text-tf-ink'
                  }`}
                >
                  {link.label}
                  {children.length > 0 && (
                    <Icon icon="lucide:chevron-down" className="h-3.5 w-3.5 opacity-60" aria-hidden />
                  )}
                </Link>

                {children.length > 0 && (
                  <div className="invisible absolute top-full left-0 z-40 min-w-[210px] translate-y-1 pt-2 opacity-0 transition-[opacity,transform] duration-150 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
                    <ul className="m-0 flex list-none flex-col gap-0.5 rounded-[14px] border border-tf-border bg-tf-card p-2 shadow-[0_16px_40px_-16px_rgba(36,24,16,0.4)]">
                      {children.map((child) => (
                        <li key={`${child.href}-${child.label}`}>
                          <Link
                            href={child.href}
                            className={`block rounded-[9px] px-3 py-2 text-[14px] whitespace-nowrap transition-colors hover:bg-tf-panel ${
                              isActive(child.href) ? 'font-semibold text-tf-accent' : 'text-tf-body hover:text-tf-ink'
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Utility slot (desktop) */}
        <div className="hidden shrink-0 items-center gap-3 whitespace-nowrap lg:flex">
          {loginLink && (
            <Link
              href={loginLink.href}
              className="text-[14.5px] font-medium text-tf-ink transition-colors hover:text-tf-accent"
            >
              {loginLink.label}
            </Link>
          )}
          <Link
            href="/admissions"
            className="rounded-full bg-tf-ink px-5 py-[11px] text-[14.5px] font-semibold text-tf-on-ink transition-opacity hover:opacity-90"
          >
            Apply now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="-mr-2 p-2 text-tf-ink lg:hidden"
        >
          <Icon icon={open ? 'lucide:x' : 'lucide:menu'} className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="border-t border-tf-rail bg-tf-paper px-5 pb-6 pt-2 md:px-8 lg:hidden">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-tf-rail py-3.5 text-[17px] ${
                    isActive(link.href) ? 'font-semibold text-tf-accent' : 'text-tf-ink'
                  }`}
                >
                  {link.label}
                </Link>
                {/* No nested disclosure on mobile: a sheet is already a list, so
                    the children are simply indented under their parent. */}
                {(link.children ?? []).map((child) => (
                  <Link
                    key={`${child.href}-${child.label}`}
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-tf-rail py-3 pl-4 text-[15px] ${
                      isActive(child.href) ? 'font-semibold text-tf-accent' : 'text-tf-muted'
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="rounded-full bg-tf-ink py-3.5 text-center text-[15px] font-semibold text-tf-on-ink"
            >
              Apply now
            </Link>
            {loginLink && (
              <Link
                href={loginLink.href}
                onClick={() => setOpen(false)}
                className="rounded-full border border-tf-border py-3.5 text-center text-[15px] font-medium text-tf-ink"
              >
                {loginLink.label}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
