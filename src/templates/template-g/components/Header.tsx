'use client'

import { useState } from 'react'
import Image from '@/shared/SiteImage'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'
import { contactEntryValue, contactPhoneDisplay, contactPhoneHref } from '@/lib/contact-entry'

export default function Header({ data }: { data: SchoolData }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const phone = data.contact?.phone?.[0]
  const email = data.contact?.email?.[0]
  const navLinks = (data.navigation ?? []).filter(
    (item) => item.href !== '/login' && item.label.toLowerCase() !== 'login',
  )

  const active = (href: string) => {
    const normalise = (value: string) => value.replace(/\/+$/, '') || '/'
    return normalise(pathname) === normalise(href)
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_5px_20px_rgba(25,37,84,0.08)]">
      <div className="bg-tb-secondary text-white">
        <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs lg:px-8">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            {email && (
              <a href={`mailto:${contactEntryValue(email)}`} className="-m-2.5 flex min-w-0 items-center gap-2 p-2.5 hover:text-white/75 sm:m-0 sm:p-0">
                <Icon icon="lucide:mail" className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden truncate sm:inline">{contactEntryValue(email)}</span>
              </a>
            )}
            {phone && (
              <a href={contactPhoneHref(phone)} className="-my-2.5 flex items-center gap-2 py-2.5 hover:text-white/75 sm:my-0 sm:py-0">
                <Icon icon="lucide:phone" className="h-3.5 w-3.5" />
                <span>{contactPhoneDisplay(phone)}</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(data.socialLinks ?? []).map((social) => {
              if (!social.url || social.url === '#') return null
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/25 sm:h-6 sm:w-6"
                >
                  <Icon icon={social.icon || `ri:${social.platform}-fill`} className="h-3.5 w-3.5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[86px] max-w-7xl items-center gap-5 px-4 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3 lg:w-[280px]">
          {data.logo ? (
            <Image
              src={data.logo}
              alt={`${data.name} logo`}
              width={72}
              height={72}
              data-edit-img="logo"
              className="h-14 w-14 shrink-0 object-contain"
            />
          ) : (
            <span data-edit-img="logo" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-tb-primary-400 text-white">
              <Icon icon="lucide:graduation-cap" className="h-7 w-7" />
            </span>
          )}
          <span className="min-w-0">
            <span
              data-edit="name"
              data-style="name"
              style={styleObject(data, 'name')}
              className="block truncate text-base font-extrabold uppercase leading-tight tracking-[0.02em] text-tb-secondary sm:text-lg"
            >
              {data.name}
            </span>
            {data.tagline && (
              <span data-edit="tagline" className="mt-1 block truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-tb-primary-400">
                {data.tagline}
              </span>
            )}
          </span>
        </Link>

        <nav className="ml-auto hidden items-stretch self-stretch lg:flex">
          {navLinks.map((item) => {
            const children = item.children ?? []
            const selected = active(item.href) || children.some((child) => active(child.href))
            return (
              <div key={`${item.href}-${item.label}`} className="group/nav relative flex items-stretch">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3 text-[13px] font-bold uppercase tracking-[0.025em] transition-colors xl:px-4 ${
                    selected ? 'text-tb-primary-400' : 'text-tb-secondary hover:text-tb-primary-400'
                  }`}
                >
                  {item.label}
                  {children.length > 0 && <Icon icon="lucide:chevron-down" className="h-3.5 w-3.5" />}
                </Link>
                <span className={`absolute inset-x-3 bottom-0 h-[3px] bg-tb-primary-400 transition-transform ${selected ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}`} />
                {children.length > 0 && (
                  <div className="invisible absolute left-0 top-full min-w-52 translate-y-2 border-t-[3px] border-tb-primary-400 bg-white p-2 opacity-0 shadow-xl transition-all group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
                    {children.map((child) => (
                      <Link key={`${child.href}-${child.label}`} href={child.href} className="block px-3 py-2.5 text-sm font-semibold text-tb-secondary hover:bg-tb-primary-50 hover:text-tb-primary-400">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => setSearchOpen((value) => !value)}
          aria-label="Search website"
          aria-expanded={searchOpen}
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-tb-primary-50 text-tb-secondary transition-colors hover:bg-tb-primary-400 hover:text-white lg:grid"
        >
          <Icon icon={searchOpen ? 'lucide:x' : 'lucide:search'} className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-md bg-tb-secondary text-white lg:hidden"
        >
          <Icon icon={open ? 'lucide:x' : 'lucide:menu'} className="h-5 w-5" />
        </button>
      </div>

      {searchOpen && (
        <form action="/updates" className="border-t border-tb-line bg-tb-primary-50 px-4 py-4">
          <div className="mx-auto flex max-w-3xl overflow-hidden rounded-md border border-tb-primary-100 bg-white">
            <label htmlFor="site-search" className="sr-only">Search notices and events</label>
            <input id="site-search" name="q" type="search" placeholder="Search notices and events" className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" />
            <button className="bg-tb-primary-400 px-5 font-bold text-white" type="submit">Search</button>
          </div>
        </form>
      )}

      {open && (
        <nav className="border-t border-tb-line bg-white px-4 pb-5 lg:hidden">
          {navLinks.map((item) => (
            <div key={`${item.href}-${item.label}`}>
              <Link href={item.href} onClick={() => setOpen(false)} className={`block border-b border-tb-line py-3 text-sm font-bold uppercase ${active(item.href) ? 'text-tb-primary-400' : 'text-tb-secondary'}`}>
                {item.label}
              </Link>
              {(item.children ?? []).map((child) => (
                <Link key={`${child.href}-${child.label}`} href={child.href} onClick={() => setOpen(false)} className="block border-b border-tb-line py-2.5 pl-4 text-sm text-tb-body">
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
