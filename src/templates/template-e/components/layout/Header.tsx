'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from '@/shared/SiteImage'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'
import { Container } from '../common/Bits'

/**
 * Ledger header — a dark utility strip, a serif wordmark, and a row of
 * underline tabs.
 *
 * The tab row is the design's signature but it is the first thing that fails on
 * a phone, so below `lg` it collapses into a disclosure sheet and the utility
 * strip drops everything except the locator line.
 */
export default function Header({ data }: { data: SchoolData }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const norm = (h: string) => h.replace(/\/+$/, '') || '/'
  const isActive = (href: string) => norm(pathname) === norm(href)

  const nav = (data.navigation ?? []).filter(
    (n) => n.href !== '/login' && n.label.toLowerCase() !== 'login',
  )
  const login = (data.navigation ?? []).find(
    (n) => n.href === '/login' || n.label.toLowerCase() === 'login',
  )

  return (
    <header className="border-b border-te-rule bg-te-paper">
      {/* Utility strip */}
      <div className="bg-te-ink text-te-on-ink-body">
        <Container>
          <div className="flex items-center gap-5 py-2 text-[12.5px] tracking-[0.04em]">
            {data.tagline && (
              <span data-edit="tagline" className="mr-auto truncate">{data.tagline}</span>
            )}
            <Link href="/updates" className="ml-auto hidden hover:text-white sm:inline lg:ml-0">
              Calendar
            </Link>
            <Link href="/contact" className="hidden hover:text-white sm:inline">
              Contact
            </Link>
            {login && (
              <Link
                href={login.href}
                className="-my-1.5 border border-te-ink-rule px-4 py-2 text-te-on-ink hover:border-te-on-ink-body sm:my-0 sm:px-3 sm:py-0.5"
              >
                {login.label}
              </Link>
            )}
          </div>
        </Container>
      </div>

      {/* Wordmark */}
      <Container>
        <div className="flex items-center justify-between gap-4 pt-5 lg:pt-6">
          <Link href="/" className="flex min-w-0 items-baseline gap-3">
            {data.logo && (
              <Image
                src={data.logo}
                alt={`${data.name} logo`}
                width={44}
                height={44}
                data-edit-img="logo"
                className="h-8 w-8 shrink-0 self-center object-contain"
              />
            )}
            <span
              data-edit="name"
              data-style="name"
              style={styleObject(data, 'name')}
              className="truncate font-(family-name:--font-te-serif) text-[24px] font-semibold tracking-[0.01em] text-te-ink sm:text-[28px] lg:text-[34px]"
            >
              {data.name}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="-mr-2 shrink-0 p-2 text-te-ink lg:hidden"
          >
            <Icon icon={open ? 'lucide:x' : 'lucide:menu'} className="h-6 w-6" />
          </button>
        </div>

        {/* Underline tabs (desktop) */}
        <nav className="hidden flex-wrap gap-6 pt-4 lg:flex">
          {nav.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`border-b-2 pb-3 text-[14px] font-medium tracking-[0.03em] transition-colors ${
                isActive(link.href)
                  ? 'border-te-accent text-te-accent'
                  : 'border-transparent text-te-ink hover:text-te-accent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Keeps the wordmark block from sitting flush on the bottom rule on
            mobile, where the tab row is absent. */}
        <div className="h-5 lg:hidden" />
      </Container>

      {/* Disclosure sheet (mobile) */}
      {open && (
        <div className="border-t border-te-rule lg:hidden">
          <Container>
            <ul className="flex flex-col py-1">
              {nav.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-te-rule py-3.5 text-[16px] ${
                      isActive(link.href) ? 'font-semibold text-te-accent' : 'text-te-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="my-4 block bg-te-accent py-3 text-center text-[14px] font-semibold tracking-[0.04em] text-te-paper"
            >
              Inquire &amp; Visit
            </Link>
          </Container>
        </div>
      )}
    </header>
  )
}
