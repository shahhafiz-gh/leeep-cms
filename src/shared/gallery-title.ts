import type { SchoolData } from '@/types/school.types'

export const DEFAULT_GALLERY_TITLE = 'School Gallery'

/** Former template defaults. A school that saved one of these never chose it —
 *  it was the scaffold's wording — so it is upgraded to the current default. */
const LEGACY_TITLES = new Set(['life at our campus', 'life on campus', 'life at our school'])

/** Home gallery heading: the school's own title, or "School Gallery". */
export function galleryTitle(data: SchoolData): string {
  const title = data.gallery?.title?.trim()
  if (!title || LEGACY_TITLES.has(title.toLowerCase())) return DEFAULT_GALLERY_TITLE
  return title
}
