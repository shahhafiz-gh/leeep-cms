'use client'

import { Icon } from '@iconify/react'
import type { LeadershipMessage, SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import PageSection from '@/shared/PageSection'

/** The anchor a message answers to, matching the menu's `/about#message-<role>`. */
export function messageAnchor(role: string) {
  return `message-${role.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

/**
 * Chairman's / Principal's / Management's messages, one section each.
 *
 * The old DGS site gave each of these a page of its own, and the About menu a
 * link to each. Here they are sections on the About page with the same links —
 * the reader gets the same route in, and the school edits three text fields
 * instead of maintaining three pages.
 */
export default function LeadershipMessages({ data }: { data: SchoolData }) {
  const messages = useLiveList<LeadershipMessage>('about.messages', data.about?.messages ?? [])
  if (!messages.length) return null

  return (
    <div className="bg-white">
      {messages.map((entry, index) => (
        <PageSection key={`${entry.role}-${index}`} id={messageAnchor(entry.role)}>
          <section className="border-b border-th-line py-14 last:border-b-0 md:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[280px_1fr] lg:gap-16 lg:px-8">
              <div>
                <div className="aspect-[4/5] w-full max-w-[280px] overflow-hidden border border-th-line bg-th-primary-50">
                  {entry.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.image}
                      alt={entry.name || entry.role}
                      data-edit-img={`about.messages.${index}.image`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      data-edit-img={`about.messages.${index}.image`}
                      className="grid h-full w-full place-items-center text-th-primary"
                    >
                      <Icon icon="lucide:quote" className="h-10 w-10" />
                    </span>
                  )}
                </div>
                {entry.name && (
                  <p
                    data-edit={`about.messages.${index}.name`}
                    className="mt-4 text-[15px] font-semibold text-th-heading"
                  >
                    {entry.name}
                  </p>
                )}
                <p
                  data-edit={`about.messages.${index}.role`}
                  className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-th-primary"
                >
                  {entry.role}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-th-heading md:text-3xl">
                  {entry.role}&rsquo;s Message
                </h2>
                <span className="mt-4 block h-[3px] w-14 bg-th-primary" />
                <div
                  data-edit={`about.messages.${index}.message`}
                  className="mt-6 text-[15px] leading-8 text-th-body"
                >
                  {(entry.message || '')
                    .split(/\n{2,}/)
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i} className="mb-4 last:mb-0">
                        {para}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </section>
        </PageSection>
      ))}
    </div>
  )
}
