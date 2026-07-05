import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

const inputClass =
  'w-full px-4 py-3 border-[1.5px] border-tb-line rounded-lg text-sm text-tb-heading bg-[#fafafa] placeholder:text-slate-400 outline-none focus:border-tb-primary-400 transition-colors'
const labelClass = 'text-[13px] font-semibold text-tb-heading'

const SOCIAL_ICONS: Record<string, string> = {
  facebook: 'lucide:facebook',
  instagram: 'lucide:instagram',
  youtube: 'lucide:youtube',
  twitter: 'lucide:twitter',
  linkedin: 'lucide:linkedin',
}

function InfoRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
        <Icon icon={icon} className="text-white text-lg" />
      </div>
      <div>
        <p className="text-white font-semibold text-[13px] uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-white/85 text-[15px]">{children}</div>
      </div>
    </div>
  )
}

export default function ContactForm({ data }: { data: SchoolData }) {
  const { contact } = data
  // Only platforms the school has actually configured (URL set).
  const socialLinks = data.socialLinks.filter((s) => s.url)

  return (
    <section className="py-16 md:py-24 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left — Info panel */}
          <div className="lg:col-span-5">
            <div className="h-full min-h-[520px] p-8 rounded-xl flex flex-col justify-between bg-gradient-to-br from-tb-primary-500 via-tb-primary-400 to-tb-primary-600">
              <div>
                <h2 className="text-white font-bold text-[28px] mb-2">Get In Touch</h2>
                <p className="text-white/75 text-[15px] mb-10">
                  We&apos;re here to help. Reach out to us and our team will respond within 24 hours.
                </p>

                <InfoRow icon="lucide:map-pin" label="Address">
                  {data.name}
                  <br />
                  <span data-edit="contact.address">{contact.address}</span>
                </InfoRow>
                <InfoRow icon="lucide:phone" label="Phone">
                  {contact.phone.map((p, i) => (
                    <a key={i} href={`tel:${p.replace(/\s+/g, '')}`} className="block hover:text-white" data-edit={`contact.phone.${i}`}>{p}</a>
                  ))}
                </InfoRow>
                <InfoRow icon="lucide:mail" label="Email">
                  {contact.email.map((e, i) => (
                    <a key={i} href={`mailto:${e}`} className="block hover:text-white" data-edit={`contact.email.${i}`}>{e}</a>
                  ))}
                </InfoRow>
                <InfoRow icon="lucide:clock" label="Office Hours">
                  <span data-edit="contact.workingHours">{contact.workingHours ?? 'Mon – Sat: 9 AM – 5 PM'}</span>
                  <span className="block text-white/55 text-[13px]">Sunday: Closed</span>
                </InfoRow>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-white/15">
                  {socialLinks.map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="w-[38px] h-[38px] rounded-lg bg-white/12 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                    >
                      <Icon icon={s.icon || SOCIAL_ICONS[s.platform] || 'lucide:link'} className="text-[15px]" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-7">
            <div className="h-full p-8 rounded-xl bg-white shadow-[0_4px_30px_rgba(203,167,61,0.15)]">
              <h3 className="font-bold text-2xl text-tb-heading mb-1.5">Send Us a Message</h3>
              <p className="text-tb-body text-sm mb-8">
                Fill out the form and we&apos;ll get back to you as soon as possible.
              </p>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Full Name *</label>
                  <input className={inputClass} type="text" placeholder="e.g. Ahmad Khan" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Email Address *</label>
                  <input className={inputClass} type="email" placeholder="you@example.com" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Phone Number</label>
                  <input className={inputClass} type="tel" placeholder="+91 000 000 0000" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Subject *</label>
                  <input className={inputClass} type="text" placeholder="How can we help?" required />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className={labelClass}>Message *</label>
                  <textarea className={`${inputClass} resize-none`} rows={5} placeholder="Write your message here..." required />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 px-9 py-3.5 rounded-lg text-white font-semibold text-[15px] bg-gradient-to-br from-tb-primary-400 to-tb-primary-500 hover:opacity-90 transition-opacity"
                  >
                    Send Message
                    <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
