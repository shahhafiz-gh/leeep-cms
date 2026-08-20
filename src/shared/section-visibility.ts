import type { SchoolData } from '@/types/school.types'

/**
 * Per-school section visibility.
 *
 * Schools kept asking to "remove" a block — the FAQs, the fee table, the alumni
 * strip — and the honest answer was that a section only disappears when its
 * content is empty. That is a poor lever: emptying a section to hide it DELETES
 * the copy, so turning it back on means writing it again, and a section fed by
 * live records (announcements, open classes) cannot be emptied at all.
 *
 * So visibility is its own switch. `hiddenSections` holds the ids a school has
 * turned off; everything absent from it is visible, which means an existing
 * site with no such key behaves exactly as before.
 *
 * Ids are the SECTION ids the builder already uses (schema.ts) — `admissionsFaqs`,
 * `alumni`, `magazine` — so an admin toggling a card in the editor and this
 * check are naming the same thing.
 */
export function isSectionHidden(data: SchoolData, sectionId: string): boolean {
  const hidden = data.hiddenSections
  if (!Array.isArray(hidden)) return false
  return hidden.includes(sectionId)
}

/** Convenience inverse, for the common `if (!visible) return null` guard. */
export function isSectionVisible(data: SchoolData, sectionId: string): boolean {
  return !isSectionHidden(data, sectionId)
}
