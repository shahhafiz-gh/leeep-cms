'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from '@/shared/SiteImage'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'

/**
 * Quill header — sticky, hairline-separated, with the navigation living inside a
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
    <header className="sticky top-0 z-30 border-b border-td-rail bg-td-paper">
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
            <span data-edit-img="logo" className="block h-[26px] w-[26px] shrink-0 rounded-md bg-td-accent" />
          )}
          <span
            data-edit="name"
            data-style="name"
            style={styleObject(data, 'name')}
            className="max-w-[46vw] truncate text-[17px] font-bold tracking-[-0.02em] text-td-ink sm:max-w-none lg:text-[19px]"
          >
            {data.name}
          </span>
        </Link>

        {/* Pill nav (desktop) */}
        <nav className="hidden min-w-0 items-center gap-1 rounded-full bg-td-rail p-[5px] lg:flex">
          {navLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`rounded-full px-4 py-[9px] text-[14.5px] font-medium whitespace-nowrap transition-colors ${
                isActive(link.href)
                  ? 'bg-td-paper text-td-ink'
                  : 'text-td-body hover:text-td-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Utility slot (desktop) */}
        <div className="hidden shrink-0 items-center gap-3 whitespace-nowrap lg:flex">
          {loginLink && (
            <Link
              href={loginLink.href}
              className="text-[14.5px] font-medium text-td-ink transition-colors hover:text-td-accent"
            >
              {loginLink.label}
            </Link>
          )}
          <Link
            href="/admissions"
            className="rounded-full bg-td-ink px-5 py-[11px] text-[14.5px] font-semibold text-td-on-ink transition-opacity hover:opacity-90"
          >
            Book a visit
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="-mr-2 p-2 text-td-ink lg:hidden"
        >
          <Icon icon={open ? 'lucide:x' : 'lucide:menu'} className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="border-t border-td-rail bg-td-paper px-5 pb-6 pt-2 md:px-8 lg:hidden">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-td-rail py-3.5 text-[17px] ${
                    isActive(link.href) ? 'font-semibold text-td-accent' : 'text-td-ink'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="rounded-full bg-td-ink py-3.5 text-center text-[15px] font-semibold text-td-on-ink"
            >
              Book a visit
            </Link>
            {loginLink && (
              <Link
                href={loginLink.href}
                onClick={() => setOpen(false)}
                className="rounded-full border border-td-border py-3.5 text-center text-[15px] font-medium text-td-ink"
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
