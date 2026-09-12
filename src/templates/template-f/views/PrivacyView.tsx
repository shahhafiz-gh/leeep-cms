import type { SchoolData } from '@/types/school.types'
import PrivacyPolicyPage from '@/shared/PrivacyPolicyPage'

export default function PrivacyView({ data }: { data: SchoolData }) {
  return <PrivacyPolicyPage data={data} variant="almanac" />
}
