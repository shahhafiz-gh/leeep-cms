'use client'

import type { SchoolData, PageType } from '@/types/school.types'
import Link from 'next/link'
import Image from '@/shared/SiteImage'
import { Icon } from '@iconify/react'
import { usePathname } from 'next/navigation'
import { useHeader } from '@/shared/hooks/useHeader'
import { styleObject } from '@/lib/component-styles'
import { isSectionVisible } from '@/shared/section-visibility'
import ImagePlaceholder from '@/templates/template-b/components/common/ImagePlaceholder'

/** Template B — Header (Kashmir-Cambridge style) */
export default function Header({ data, page }: { data: SchoolData; page: PageType }) {
  const pathname = usePathname()
  const isHomePage = page === 'home'

  const {
    isSticky,
    isVisible,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu
  } = useHeader(pathname)

  const isDark = !isHomePage || isSticky

  // The buttons in the top right are the school's own ("App / portal buttons"
  // in the editor). Heritage used to hardcode a single "Login" link, so a school
  // that added a student app or a fee-payment link saw nothing change; the login
  // link survives only as the fallback for a school that has configured none.
  // Two at most: they sit on the same row as a full nav, so a third would push
  // the menu off the header on anything narrower than a desktop.
  const portalLinks = (isSectionVisible(data, 'siteAppLinks') ? (data.portalLinks ?? []) : []).slice(0, 2)
  // Multi-campus schools apply per campus, often on a different site — so the
  // apply action becomes a small menu rather than one link. Empty for the
  // single-campus schools that are the norm, and then nothing is rendered.
  const campuses = isSectionVisible(data, 'siteCampuses')
    ? (data.campuses ?? []).filter((campus) => campus.name && campus.admissionUrl)
    : []

  return (
    <>
      <header
        className={`left-0 w-full z-50 transition-all duration-300 ${isSticky
            ? `fixed top-0 bg-tb-background shadow-sm border-b border-tb-line ${isVisible ? 'translate-y-0' : '-translate-y-full'}`
            : 'absolute top-0 bg-transparent border-b border-transparent translate-y-0'
          }`}
      >
        {/* The row carries the brand, a full nav, the campus menu and the
            school's portal buttons, so the gutter and the nav gap tighten on
            narrower desktops rather than letting the buttons run off-screen. */}
        <div className="w-full mx-auto px-4 lg:px-6 xl:px-12 2xl:px-24">
          <div className="flex justify-between items-center gap-4 py-2 lg:py-0">

            {/* Below lg the brand shares the bar with the menu button, so it may
                compress (the name ellipsises); from lg the nav has its own row
                space and the brand keeps its full size. */}
            <Link href="/" className="flex items-center min-w-0 shrink lg:shrink-0">
              <div className="flex items-center gap-3 py-4 min-w-0">
                {data.logo ? (
                  <Image
                    src={data.logo}
                    alt={data.name}
                    width={160}
                    height={160}
                    /* `h-14 w-auto` + object-contain, NOT a square box: a school
                       logo is as often a wide wordmark as a round crest, and the
                       old fixed 56x56 frame shrank a wordmark to an illegible
                       smudge. The max-width keeps a very wide mark from pushing
                       the nav off the row. */
                    className="h-11 sm:h-14 w-auto max-w-32 sm:max-w-40 object-contain shrink-0"
                    data-edit-img="logo"
                  />
                ) : (
                  <ImagePlaceholder label="Logo" icon="lucide:image-plus" className="w-11 h-11 sm:w-14 sm:h-14 rounded-full shrink-0 gap-0.5" editPath="logo" />
                )}
                <div className="flex flex-col ml-1 min-w-0 font-(family-name:--font-inter)">
                  {/* Sized by the school, not the template: alignment, wrap,
                      type size, line height and width are all curated style
                      options on the `name` path (see component-styles.ts). The
                      class list therefore sets only defaults — a fixed `w-52`
                      here is what used to make those controls look inert. */}
                  <span
                    data-edit="name"
                    data-style="name"
                    style={styleObject(data, 'name')}
                    /* Phone first: a smaller face that wraps to two whole lines,
                       instead of a 19px name cut off mid-word beside the menu. */
                    className={`font-bold text-base sm:text-[19px] max-w-52 leading-tight uppercase tracking-normal line-clamp-2 lg:line-clamp-none ${isDark ? 'text-tb-heading' : 'text-tb-background'}`}
                  >
                    {data.name}
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-9">
              {data.navigation.map((item) => {
                const isActive = pathname === item.href || (pathname === '/' && item.href === '/')
                const hasChildren = !!item.children && item.children.length > 0
                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1 font-medium text-[15px] uppercase font-(family-name:--font-inter) transition-colors duration-300 py-[37px] ${isDark
                        ? isActive ? 'text-tb-primary-400' : 'text-tb-heading hover:text-tb-primary-400'
                        : isActive ? 'text-tb-primary-400' : 'text-tb-background hover:text-tb-primary-400'
                        }`}
                    >
                      {item.label}
                      {hasChildren && <Icon icon="lucide:chevron-down" className="w-4 h-4" />}
                    </Link>
                    {hasChildren && (
                      <div className="absolute left-0 top-full min-w-[210px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <ul className="bg-tb-background rounded-xl shadow-xl border border-tb-line py-2">
                          {item.children!.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block px-4 py-2.5 text-sm uppercase font-medium text-tb-heading hover:text-tb-primary-400 transition-colors"
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

              {campuses.length > 0 && (
                <div className="relative group">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 font-medium text-[15px] uppercase font-(family-name:--font-inter) transition-colors duration-300 py-[37px] ${isDark ? 'text-tb-heading hover:text-tb-primary-400' : 'text-tb-background hover:text-tb-primary-400'
                      }`}
                  >
                    <span className="whitespace-nowrap">Online Admission</span>
                    <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full min-w-[250px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
                    <ul className="bg-tb-background rounded-xl shadow-xl border border-tb-line py-2">
                      {campuses.map((campus, ci) => (
                        <li key={`${campus.name}-${ci}`}>
                          <a
                            href={campus.admissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2.5 text-sm font-medium text-tb-heading hover:text-tb-primary-400 transition-colors"
                          >
                            <span className="block uppercase">{campus.name}</span>
                            {campus.address && (
                              <span className="mt-0.5 block text-xs font-normal normal-case text-tb-body">
                                {campus.address}
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </nav>

            {/* Desktop portal buttons — the school's own, with the login link as
                the fallback when it has configured none. */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {portalLinks.length > 0 ? (
                portalLinks.map((link, li) => (
                  <a
                    key={`${link.url}-${li}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    /* The first button takes the slot the old hardcoded
                       "Login" pill had; a second only appears where there is
                       genuinely room for it, and stays reachable from the
                       mobile menu everywhere else. */
                    className={`${li > 0 ? 'hidden 2xl:inline-flex' : 'inline-flex'} max-w-36 truncate px-5 py-3 rounded-full font-semibold text-[13px] transition-all duration-300 shadow-sm hover:shadow-md font-(family-name:--font-inter) tracking-wide 2xl:max-w-44 2xl:px-7 2xl:py-[14px] 2xl:text-sm ${link.variant === 'dark'
                      ? 'bg-tb-secondary text-tb-background hover:bg-tb-heading'
                      : 'bg-tb-primary-400 text-tb-background hover:bg-tb-primary-500'
                      }`}
                  >
                    {link.label}
                  </a>
                ))
              ) : (
                <Link
                  href="/login"
                  className="inline-flex px-10 py-[14px] rounded-full font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md bg-tb-primary-400 text-tb-background hover:bg-tb-primary-500 font-(family-name:--font-inter) tracking-wide"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-3 shrink-0">
              {/* On a phone the bar is the brand and the menu button only — the
                  pill moves into the menu (below), where it gets a full-width
                  button instead of squeezing the school's name. */}
              <Link
                href={portalLinks[0]?.url ?? '/login'}
                className={`hidden sm:inline-flex max-w-32 truncate px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${isDark
                  ? 'bg-tb-primary-400 text-tb-background hover:bg-tb-primary-500'
                  : 'bg-tb-background text-tb-primary-400 hover:bg-tb-light-white'
                  }`}
              >
                {portalLinks[0]?.label ?? 'Login'}
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="p-2 -mr-2 focus:outline-none"
                aria-label="Toggle Menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Icon
                  icon={isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'}
                  className={`w-7 h-7 ${isDark ? 'text-tb-heading' : 'text-tb-background'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-tb-background shadow-xl z-50 border-t border-tb-line">
            <nav className="flex flex-col py-4 px-6">
              <ul className="flex flex-col gap-2">
                {data.navigation.map((item) => {
                  const isActive = pathname === item.href
                  const hasChildren = !!item.children && item.children.length > 0
                  return (
                    <li key={item.href} className="border-b border-tb-line last:border-none">
                      <Link
                        href={item.href}
                        className={`block py-4 text-[15px] uppercase font-(family-name:--font-inter) font-medium transition-colors ${isActive ? 'text-tb-primary-400' : 'text-tb-heading hover:text-tb-primary-400'
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                      {hasChildren && (
                        <ul className="ml-3 mb-3 flex flex-col gap-1 border-l border-tb-line pl-3">
                          {item.children!.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block py-2 text-sm uppercase font-(family-name:--font-inter) text-tb-body hover:text-tb-primary-400 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}

                {campuses.map((campus, ci) => (
                  <li key={`campus-${ci}`} className="border-b border-tb-line last:border-none">
                    <a
                      href={campus.admissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-4 text-[15px] uppercase font-(family-name:--font-inter) font-medium text-tb-heading hover:text-tb-primary-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Apply — {campus.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Every portal button, full width. The first one is also in the
                  bar from `sm` up, so it is only repeated here on phones. (With
                  none configured, Login is already a menu item above.) */}
              {portalLinks.map((link, li) => (
                <a
                  key={`m-portal-${li}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${li === 0 ? 'flex sm:hidden' : 'flex'} mt-3 min-h-12 items-center justify-center px-5 rounded-full text-sm font-semibold ${link.variant === 'dark'
                    ? 'bg-tb-secondary text-tb-background'
                    : 'bg-tb-primary-400 text-tb-background'
                    }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
