import type { SchoolData } from '@/types/school.types'
import PrivacyPolicyPage from '@/shared/PrivacyPolicyPage'

/** The shared policy page in Almanac's layout — its tf-* tokens are re-pointed
 * to this template's colours in globals.css, and unlike Heritage's it doesn't
 * leave room for a header drawn over the page. */
export default function PrivacyView({ data }: { data: SchoolData; editing?: boolean }) {
  return <PrivacyPolicyPage data={data} variant="almanac" />
}
