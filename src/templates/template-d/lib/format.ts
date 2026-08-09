/** Date helpers shared by Quill's news, events and detail views. */

/** "AUG 24" — the compact uppercase stamp used on cards. */
export function shortDate(value?: string | null): string {
  const d = value ? new Date(value) : null
  if (!d || isNaN(d.getTime())) return ''
  return d
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    .toUpperCase()
}

/** "24 August 2026" — the long form used in headers and event rows. */
export function longDate(value?: string | null): string {
  const d = value ? new Date(value) : null
  if (!d || isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Split a date into the parts an event row shows in its left rail. */
export function dateParts(value?: string | null): { day: string; month: string } | null {
  const d = value ? new Date(value) : null
  if (!d || isNaN(d.getTime())) return null
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  }
}
