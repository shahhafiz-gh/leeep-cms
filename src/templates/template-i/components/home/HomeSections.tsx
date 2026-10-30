import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import MarkdownContent from '@/shared/MarkdownContent'
import { toMapEmbedUrl } from '@/shared/map-embed'
import { longDate } from '@/shared/utils/format'
import { pageHref, pagesInGroup } from '@/lib/custom-pages'
import { PROSE } from '../blocks/PageBlocks'

function SectionHeading({ title, subtitle, light }: { title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className={`text-3xl font-bold sm:text-4xl ${light ? 'text-white' : 'text-ts-heading'}`}>{title}</h2>
      <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-ts-accent" />
      {subtitle && <p className={`mt-4 text-base sm:text-lg ${light ? 'text-white/75' : 'text-ts-body'}`}>{subtitle}</p>}
    </div>
  )
}

/**
 * Notifications, latest events and a short "about us", side by side and lifted
 * over the bottom of the hero — the first thing a parent checks.
 */
export function NoticeBoard({ data }: { data: SchoolData }) {
  const notices = (data.updates?.announcements ?? []).slice(0, 4)
  const events = (data.updates?.events ?? []).slice(0, 3)
  const about = data.homeAbout

  return (
    <section className="relative z-10 bg-ts-paper pb-14">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-10 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <Board title="Notifications" icon="lucide:bell-ring" href="/updates#news">
          {notices.length ? (
            notices.map((notice) => (
              <BoardItem
                key={notice.id}
                href={`/updates/${notice.id}`}
                title={notice.title}
                date={notice.published_date}
              />
            ))
          ) : (
            <p className="text-sm text-ts-muted">{data.notifications?.emptyText || 'No notifications right now.'}</p>
          )}
        </Board>
        <Board title="Latest Events" icon="lucide:calendar-days" href="/updates#events">
          {events.length ? (
            events.map((event) => (
              <BoardItem key={event.id} href={`/updates/${event.id}`} title={event.title} date={event.date} />
            ))
          ) : (
            <p className="text-sm text-ts-muted">No upcoming events.</p>
          )}
        </Board>
        {about?.description && (
          <Board title={about.title || 'About Us'} icon="lucide:school" href="/about" titlePath="homeAbout.title">
            <p data-edit="homeAbout.description" className="line-clamp-[9] text-[15px] leading-7 text-ts-body">
              {about.description}
            </p>
          </Board>
        )}
      </div>
    </section>
  )
}

function Board({
  title,
  icon,
  href,
  titlePath,
  children,
}: {
  title: string
  icon: string
  href: string
  titlePath?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-ts-line">
      <h2 className="flex items-center gap-3 bg-ts-primary px-5 py-4 text-lg font-bold text-white">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ts-accent text-ts-navy">
          <Icon icon={icon} className="h-5 w-5" />
        </span>
        <span data-edit={titlePath}>{title}</span>
      </h2>
      <div className="flex-1 space-y-4 p-5">{children}</div>
      <Link
        href={href}
        className="flex items-center justify-end gap-1 border-t border-ts-line px-5 py-3 text-sm font-bold text-ts-primary hover:bg-ts-paper"
      >
        View all <Icon icon="lucide:arrow-right" className="h-4 w-4" />
      </Link>
    </div>
  )
}

function BoardItem({ href, title, date }: { href: string; title: string; date?: string | null }) {
  return (
    <Link href={href} className="group flex gap-3">
      <Icon icon="lucide:chevron-right" className="mt-1 h-4 w-4 shrink-0 text-ts-accent-600" />
      <span className="min-w-0">
        <span className="block font-semibold leading-snug text-ts-heading group-hover:text-ts-primary">{title}</span>
        {date && <span className="mt-0.5 block text-xs font-semibold text-ts-muted">{longDate(date)}</span>}
      </span>
    </Link>
  )
}

/** A leadership welcome — portrait in an amber frame beside the message. */
export function MessageSection({ data }: { data: SchoolData }) {
  const message = data.homeMessage
  if (!message?.message) return null
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-[300px_1fr] lg:gap-16 lg:px-8">
        {message.image && (
          <div className="relative mx-auto w-64 md:w-full">
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-ts-accent" />
            <img
              src={message.image}
              alt={message.name || message.role}
              data-edit-img="homeMessage.image"
              className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        )}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ts-teal">{message.role}</p>
          <h2 data-edit="homeMessage.title" className="mt-2 text-3xl font-bold text-ts-heading sm:text-4xl">
            {message.title || `${message.role}'s Message`}
          </h2>
          <Icon icon="ri:double-quotes-l" className="mt-6 h-10 w-10 text-ts-primary-200" />
          <MarkdownContent source={message.message} className={`${PROSE} mt-2`} />
          {message.name && (
            <p className="mt-6 font-[family-name:var(--font-ts-serif)] text-lg font-bold italic text-ts-primary-700">
              — {message.name}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

/** The facilities pages (menu group "Facilities"), as photo cards. */
export function FacilitiesSection({ data }: { data: SchoolData }) {
  const pages = pagesInGroup(data, 'Facilities')
  if (!pages.length) return null
  return (
    <section className="bg-ts-paper py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title={data.facilities?.title || 'Available Facilities'}
          subtitle={data.facilities?.subtitle}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={pageHref(page)}
              className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ts-line transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="relative block overflow-hidden">
                {page.heroImage ? (
                  <img
                    src={page.heroImage}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="grid aspect-[4/3] place-items-center bg-ts-primary-50 text-ts-primary">
                    <Icon icon="lucide:building-2" className="h-10 w-10" />
                  </span>
                )}
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-ts-accent transition-all duration-500 group-hover:w-full" />
              </span>
              <span className="flex flex-1 flex-col p-5">
                <span className="text-lg font-bold text-ts-heading group-hover:text-ts-primary">
                  {page.navLabel || page.title}
                </span>
                {page.summary && <span className="mt-2 line-clamp-3 text-[15px] leading-6 text-ts-body">{page.summary}</span>}
                <span className="mt-auto pt-4 text-sm font-bold text-ts-primary">View more →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Prospectus band: page scans, the full reader page and the PDF. */
export function ProspectusSection({ data }: { data: SchoolData }) {
  const prospectus = data.prospectus
  const pages = (prospectus?.pages ?? []).filter(Boolean)
  if (!pages.length && !prospectus?.pdf) return null
  return (
    <section className="relative overflow-hidden bg-ts-navy py-16 text-white lg:py-20">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ts-primary/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          light
          title={prospectus?.title || 'School Prospectus'}
          subtitle={prospectus?.subtitle}
        />
        {pages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {pages.slice(0, 4).map((src, i) => (
              <Link
                key={`${src}-${i}`}
                href={prospectus?.href || '/'}
                className="group overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/15"
              >
                <img
                  src={src}
                  alt={`Prospectus page ${i + 1}`}
                  loading="lazy"
                  data-edit-img={`prospectus.pages.${i}`}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {prospectus?.href && (
            <Link
              href={prospectus.href}
              className="inline-flex items-center gap-2 rounded-md bg-ts-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-ts-navy hover:bg-ts-accent-600"
            >
              <Icon icon="lucide:book-open" className="h-4 w-4" /> View full prospectus
            </Link>
          )}
          {prospectus?.pdf && (
            <a
              href={prospectus.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/60 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10"
            >
              <Icon icon="lucide:download" className="h-4 w-4" /> Download PDF
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

/** A strip of recent photographs, leading to the full gallery. */
export function GalleryStrip({ data }: { data: SchoolData }) {
  const images = (data.gallery?.images ?? []).filter((image) => image.src).slice(0, 8)
  if (images.length < 4) return null
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title={data.gallery?.title || 'Photo Gallery'} subtitle={data.gallery?.subtitle} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {images.map((image, i) => (
            <Link
              key={`${image.src}-${i}`}
              href="/gallery"
              className={`group overflow-hidden rounded-lg ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                data-edit-img={`gallery.images.${i}.src`}
                className="h-full min-h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-md bg-ts-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-ts-primary-700"
          >
            Open the gallery <Icon icon="lucide:arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const SOCIAL_NAMES: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
}

/** Where to follow the school, and where to find it. */
export function ConnectSection({ data }: { data: SchoolData }) {
  const socials = (data.socialLinks ?? []).filter((s) => s.url && s.url !== '#')
  const map = toMapEmbedUrl(data.contact?.mapEmbedUrl || data.contact?.mapUrl)
  if (!socials.length && !map) return null
  return (
    <section className="bg-ts-paper py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <h2 className="text-3xl font-bold text-ts-heading sm:text-4xl">Connect With Us</h2>
          <span className="mt-3 block h-1 w-16 rounded-full bg-ts-accent" />
          <p className="mt-4 text-base text-ts-body sm:text-lg">
            Follow us on social media to stay updated with the latest news and events.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 font-bold text-ts-heading shadow-sm ring-1 ring-ts-line transition hover:bg-ts-primary hover:text-white"
              >
                <Icon icon={social.icon || `ri:${social.platform}-fill`} className="h-6 w-6" />
                {SOCIAL_NAMES[social.platform] ?? social.platform}
              </a>
            ))}
          </div>
        </div>
        {map && (
          <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-ts-line">
            <iframe
              src={map}
              title={`Map to ${data.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[340px] w-full border-0"
            />
          </div>
        )}
      </div>
    </section>
  )
}
