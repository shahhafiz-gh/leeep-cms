import type { PrivacyPolicySection, SchoolData } from '@/types/school.types'
import { contactEntryValue } from '@/lib/contact-entry'

/**
 * The baseline privacy notice.
 *
 * Every school's site collects personal data from the day it goes live — the
 * admission enquiry form posts a child's name and a parent's phone number
 * straight into Frappe — so `/privacy` cannot wait for an admin to write
 * something. A footer link that 404s is worse than a generic notice, and an
 * empty page is worse than both.
 *
 * What this is NOT: legal advice, or a policy the school has agreed to. It
 * describes only what the platform demonstrably does (the admission form, the
 * school's own analytics id when it has set one, the contact details it
 * publishes), in plain language, with nothing invented about retention periods,
 * jurisdictions or third parties we cannot see from here. The page marks it as
 * the standard notice and Website Management tells the admin to replace it, so
 * nobody mistakes it for something their school drafted.
 *
 * The moment a school writes its own sections, these disappear entirely.
 */
export function baselinePrivacySections(data: SchoolData): PrivacyPolicySection[] {
  const school = data.name || 'the school'
  const email = (data.contact?.email ?? []).map(contactEntryValue).find(Boolean)
  const phone = (data.contact?.phone ?? []).map(contactEntryValue).find(Boolean)
  const address = data.contact?.address?.trim()
  const hasAnalytics = !!data.config?.analytics_id

  const reachUs = [
    email ? `email us at ${email}` : '',
    phone ? `call ${phone}` : '',
    address ? `write to us at ${address}` : '',
  ].filter(Boolean)

  const contactLine = reachUs.length
    ? `You can ${reachUs.join(', ')}.`
    : 'You can reach us through the contact details on our Contact page.'

  return [
    {
      heading: 'Who we are',
      body:
        `This notice explains how ${school} handles personal information collected ` +
        `through this website. ${contactLine}`,
    },
    {
      heading: 'Information we collect',
      body:
        'We only collect what you give us. If you submit an admission enquiry or ' +
        'application, that means the details entered on the form — typically the ' +
        "student's name, date of birth and class applied for, along with a parent " +
        'or guardian’s name, phone number, email address and address. If you ' +
        'contact us by email or phone, we hold what you send us.' +
        (hasAnalytics
          ? '\n\nThis site also uses Google Analytics, which records anonymous ' +
            'usage information such as the pages you visit, your approximate ' +
            'location and the type of device you are using.'
          : ''),
    },
    {
      heading: 'How we use it',
      body:
        'Application details are used to process the admission — to contact you ' +
        'about the application, arrange interactions or assessments where they ' +
        'apply, and enrol the student if a place is offered. Enquiries are used to ' +
        'answer you. We do not sell personal information, and we do not use it for ' +
        'advertising.',
    },
    {
      heading: 'Who can see it',
      body:
        `Application and enquiry details are visible to the staff at ${school} who ` +
        'handle admissions, and to the school management system the school uses to ' +
        'store its records. They are shared outside the school only where the law ' +
        'or an education authority requires it.',
    },
    {
      heading: 'How long we keep it',
      body:
        'Enquiries and applications are retained for as long as the school needs ' +
        'them for admissions and student records, and for as long as it is required ' +
        'to keep them by the education authority it is affiliated to.',
    },
    {
      heading: 'Your choices',
      body:
        'You can ask us what information we hold about you, ask us to correct it, ' +
        'or ask us to delete it where we are not required to keep it. ' +
        contactLine +
        (hasAnalytics
          ? ' You can stop analytics from recording your visit by using your ' +
            'browser’s "Do Not Track" setting or a tracking blocker.'
          : ''),
    },
    {
      heading: 'Changes to this notice',
      body:
        'If the way we handle information changes, we will update this page. Please ' +
        'check it from time to time.',
    },
  ]
}
