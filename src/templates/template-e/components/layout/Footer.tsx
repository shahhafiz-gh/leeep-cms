'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'
import { Container } from '../common/Bits'

/**
 * Ledger footer — a full-bleed ink band, the one place the design inverts.
 *
 * Columns come from the site NAVIGATION rather than the editable `footer.columns`
 * blob (the same rule the other templates follow), so a stale label saved in
 * that blob can never surface here.
 */
export default function Footer({ data, editing = false }: { data: SchoolData; editing?: boolean }) {
  const contact = data.contact ?? { address: '', phone: [], email: [] }

  const links = (data.navigation ?? [])
    .filter((n) => n.href !== '/login' && n.label.toLowerCase() !== 'login')
    .map((n) => ({ label: n.label, href: n.href }))
  const half = Math.ceil(links.length / 2)
  const columns = [
    { title: 'School', links: links.slice(0, half) },
    { title: 'Connect', links: links.slice(half) },
  ].filter((c) => c.links.length > 0)

  return (
    <footer className="mt-auto bg-te-ink text-te-on-ink-body">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          <div className="flex flex-col gap-3">
            <div
              data-bind="name"
              data-style="name"
              style={styleObject(data, 'name')}
              className="font-(family-name:--font-te-serif) text-[22px] text-te-on-ink"
            >
              {data.name}
            </div>
            <div className="text-[13.5px] leading-[1.7]">
              {contact.address && <div data-bind="contact.address">{contact.address}</div>}
              {(contact.phone ?? []).map((p, i) => (
                <div key={p} data-bind={`contact.phone.${i}`}>{p}</div>
              ))}
              {(contact.email ?? []).map((e, i) => (
                <div key={e} data-bind={`contact.email.${i}`}>{e}</div>
              ))}
            </div>

            {/* In the EDITOR every canonical platform renders (hidden, revealed
                by the edit layer) so each can be configured; on the LIVE site an
                un-configured platform never appears. */}
            <div className="flex items-center gap-3 pt-1">
              {(data.socialLinks ?? []).map((social, si) => {
                const hasUrl = !!social.url && social.url !== '#'
                if (!editing && !hasUrl) return null
                return (
                  <a
                    key={social.platform}
                    href={social.url || undefined}
                    data-edit-social={`socialLinks.${si}.url`}
                    data-social-platform={social.platform}
                    data-social-url={social.url || ''}
                    data-social-empty={hasUrl ? undefined : 'true'}
                    style={hasUrl ? undefined : { display: 'none' }}
                    aria-label={social.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-te-on-ink-body transition-colors hover:text-white"
                  >
                    <Icon icon={social.icon || `ri:${social.platform}-fill`} className="h-[18px] w-[18px]" />
                  </a>
                )
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-2.5">
              <div className="text-[11.5px] uppercase tracking-[0.14em] text-te-on-ink-faint">
                {col.title}
              </div>
              {col.links.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="text-[13.5px] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-te-ink-rule py-6 text-[12.5px] text-te-on-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span data-edit="footer.copyright">{data.footer?.copyright}</span>
          {/* Hardcoded brand attribution, not school content. */}
          <span className="flex items-center gap-1.5">
            Powered by
            <a href="https://leeep.in" className="transition-opacity hover:opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/kcs/leeep.svg" alt="Leeep" className="inline h-6 w-auto" />
            </a>
          </span>
        </div>
      </Container>
    </footer>
  )
}
