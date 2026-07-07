'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useScrollHeader } from '@/templates/template-a/hooks/layout/useScrollHeader'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'
import { styleObject } from '@/lib/component-styles'

export default function Header({ data }: { data: SchoolData }) {
  const pathname = usePathname()
  const { isScrolled: scrolled } = useScrollHeader(20)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav
      className={`bg-ta-surface-bright/90 backdrop-blur-md text-ta-primary font-(family-name:--font-ta-label-md) overflow-hidden  text-(length:--text-ta-label-md) fixed top-0 w-full z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}
    >
      <div className="flex justify-between container items-center mx-auto px-6 h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-(--spacing-ta-xs) font-(family-name:--font-ta-h3) text-(length:--text-ta-h3) text-ta-on-surface tracking-tighter"
        >
          {data.logo ? (
            <Image
              src={data.logo}
              alt={`${data.name} Logo`}
              width={60}
              height={60}
              className="w-14 h-14 max-w-14 rounded-full object-contain shrink-0"
              data-edit-img="logo"
            />
          ) : (
            <ImagePlaceholder label="Logo" icon="lucide:image-plus" className="w-14 h-14 rounded-full shrink-0 gap-0.5" editPath="logo" />
          )}
          <span data-edit="name" data-style="name" style={styleObject(data, 'name')} className="hidden max-w-[200px] lg:block font-bold text-xl text-center tracking-tight text-ta-primary">
            {data.name}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-(--spacing-ta-gutter)">
          {data.navigation.map((link) => {
            const isActive = pathname === link.href || (pathname === '/' && link.label === 'Home')
            const hasChildren = !!link.children && link.children.length > 0
            return (
              <li key={link.label} className="relative group">
                <Link
                  href={link.href}
                  className={`relative inline-flex items-center gap-1 transition-all duration-300 ${
                    isActive
                      ? 'text-ta-primary-container border-b-2 border-ta-primary-container pb-1'
                      : 'text-ta-on-surface-variant hover:text-ta-primary-container hover:scale-105'
                  }`}
                >
                  {link.label}
                  {hasChildren && <Icon icon="lucide:chevron-down" className="w-4 h-4" />}
                </Link>
                {hasChildren && (
                  <div className="absolute left-0 top-full pt-3 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <ul className="bg-ta-surface-bright rounded-xl shadow-lg border border-ta-outline-variant/40 py-2">
                      {link.children!.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-ta-on-surface-variant hover:bg-ta-surface-container hover:text-ta-primary-container transition-colors"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
        
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 cursor-pointer bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) text-(length:--text-ta-label-md) rounded-full shadow-[0_8px_16px_rgba(0,107,32,0.2)] hover:scale-105 active:scale-95 transition-all duration-200 px-6 py-3"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-ta-on-surface p-2"
          aria-label="Toggle menu"
        >
          <Icon icon={mobileMenuOpen ? 'lucide:x' : 'lucide:menu'} className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ta-surface-dim bg-ta-surface-bright/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col p-4 gap-2">
            {data.navigation.map((link) => {
              const isActive = pathname === link.href || (pathname === '/' && link.label === 'Home')
              const hasChildren = !!link.children && link.children.length > 0
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-(family-name:--font-ta-label-md) text-(length:--text-ta-label-md) transition-colors ${
                      isActive
                        ? 'bg-ta-secondary-container text-ta-on-secondary-container'
                        : 'text-ta-on-surface-variant hover:bg-ta-surface-container-high'
                    }`}
                  >
                    {link.label}
                  </Link>
                  {hasChildren && (
                    <ul className="ml-4 mt-1 flex flex-col gap-1 border-l border-ta-outline-variant/40 pl-2">
                      {link.children!.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 rounded-lg text-sm text-ta-on-surface-variant hover:bg-ta-surface-container-high transition-colors"
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
            <li className="pt-2">
              <Link
                href="/admissions"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-ta-primary-container text-ta-on-primary rounded-full py-3 font-bold hover:scale-105 active:scale-95 transition-all"
              >
                Apply Now
              </Link>
            </li>
            <li className="pt-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-ta-primary-container text-ta-on-primary rounded-full py-3 font-bold hover:scale-105 active:scale-95 transition-all"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
