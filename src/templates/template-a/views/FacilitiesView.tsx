import type { SchoolData } from '@/types/school.types'
import FacilitiesPage from '@/shared/FacilitiesPage'

export default function FacilitiesView({ data }: { data: SchoolData }) {
  return <FacilitiesPage data={data} variant="willow" />
}
