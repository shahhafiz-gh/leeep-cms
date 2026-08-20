import type { SchoolData } from '@/types/school.types'
import ContactSection from '../components/contact/ContactSection'
import GettingHereSection from '../components/contact/GettingHereSection'

/** Template D ("Almanac") — Contact. */
export default function ContactView({ data }: { data: SchoolData }) {
  return (
    <>
      <ContactSection data={data} />
      <GettingHereSection data={data} />
    </>
  )
}
