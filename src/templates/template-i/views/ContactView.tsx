import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { toMapEmbedUrl } from '@/shared/map-embed'
import { contactEntryLabel, contactEntryValue, contactPhoneDisplay, contactPhoneHref } from '@/lib/contact-entry'
import PageShell from '../components/PageShell'

/**
 * How to reach the school: the office's address, numbers and hours, then who to
 * contact for what (`contact.directory`), then the map.
 */
export default function ContactView({ data }: { data: SchoolData; editing?: boolean }) {
  const contact = data.contact
  const directory = (contact?.directory ?? []).filter((person) => person.role)
  const map = toMapEmbedUrl(contact?.mapEmbedUrl || contact?.mapUrl)

  const cards = [
    contact?.address && {
      icon: 'lucide:map-pin',
      title: 'Visit us',
      lines: [<span key="a" data-edit="contact.address">{contact.address}</span>],
    },
    contact?.phone?.length && {
      icon: 'lucide:phone',
      title: 'Call us',
      lines: contact.phone.map((phone, i) => (
        <a key={i} href={contactPhoneHref(phone)} className="block hover:text-ts-primary">
          {contactEntryLabel(phone) && <span className="text-ts-muted">{contactEntryLabel(phone)}: </span>}
          {contactPhoneDisplay(phone)}
        </a>
      )),
    },
    contact?.email?.length && {
      icon: 'lucide:mail',
      title: 'Write to us',
      lines: contact.email.map((email, i) => (
        <a key={i} href={`mailto:${contactEntryValue(email)}`} className="block break-all hover:text-ts-primary">
          {contactEntryValue(email)}
        </a>
      )),
    },
    contact?.workingHours && {
      icon: 'lucide:clock',
      title: 'Office hours',
      lines: [<span key="h" data-edit="contact.workingHours">{contact.workingHours}</span>],
    },
  ].filter(Boolean) as { icon: string; title: string; lines: React.ReactNode[] }[]

  return (
    <PageShell
      data={data}
      title={contact?.title || 'Contact Us'}
      summary={contact?.description || contact?.subtitle}
      titlePath="contact.title"
      summaryPath={contact?.description ? 'contact.description' : 'contact.subtitle'}
      wide
    >
      <div className="space-y-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ts-line">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ts-primary text-white">
                <Icon icon={card.icon} className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-ts-heading">{card.title}</h2>
              <div className="mt-2 space-y-1 text-[15px] leading-6 text-ts-body">{card.lines}</div>
            </div>
          ))}
        </div>

        {directory.length > 0 && (
          <section>
            <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-ts-heading">
              <span className="h-7 w-1.5 rounded-full bg-ts-accent" />
              Who to contact
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {directory.map((person, i) => (
                <div key={i} className="rounded-xl border-t-4 border-ts-primary bg-white p-5 shadow-sm ring-1 ring-ts-line">
                  <p data-edit={`contact.directory.${i}.role`} className="text-xs font-bold uppercase tracking-wider text-ts-teal">
                    {person.role}
                  </p>
                  {person.name && (
                    <p data-edit={`contact.directory.${i}.name`} className="mt-1 text-lg font-bold text-ts-heading">
                      {person.name}
                    </p>
                  )}
                  <div className="mt-3 space-y-1.5 text-[15px] text-ts-body">
                    {person.email && (
                      <a href={`mailto:${person.email}`} className="flex items-center gap-2 break-all hover:text-ts-primary">
                        <Icon icon="lucide:mail" className="h-4 w-4 shrink-0 text-ts-primary" />
                        {person.email}
                      </a>
                    )}
                    {person.phone && (
                      <a href={`tel:${person.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 hover:text-ts-primary">
                        <Icon icon="lucide:phone" className="h-4 w-4 shrink-0 text-ts-primary" />
                        {person.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {map && (
          <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-ts-line">
            <iframe
              src={map}
              title={`Map to ${data.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0"
            />
          </div>
        )}
      </div>
    </PageShell>
  )
}
