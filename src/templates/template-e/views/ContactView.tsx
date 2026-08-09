import type { SchoolData } from '@/types/school.types'
import ContactSection from '../components/contact/ContactSection'

/** Template E ("Ledger") — Contact. */
export default function ContactView({ data }: { data: SchoolData }) {
  return <ContactSection data={data} />
}
