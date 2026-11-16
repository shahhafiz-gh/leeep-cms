/**
 * Keep a year range in school-authored admissions copy in step with the live
 * admission.
 *
 * Starter copy ships as "Session 2025–26" and schools rarely revisit it, so the
 * badge kept advertising last year's intake. When a window is open, any
 * `2025–26` / `2025-2026` style range is replaced by its `academic_year`; the
 * rest of the school's wording is left alone. No open window → text unchanged.
 */
export function withLiveSession(text: string, academicYear?: string | null): string {
  if (!academicYear) return text
  return text.replace(/\b\d{4}\s*[–-]\s*\d{2,4}\b/, academicYear)
}
