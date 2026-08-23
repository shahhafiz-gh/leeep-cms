export type ContactEntry = string | { label?: string; value?: string }

export function contactEntryValue(entry: ContactEntry | undefined) {
  return typeof entry === 'string' ? entry : entry?.value || ''
}

export function contactEntryLabel(entry: ContactEntry | undefined) {
  return typeof entry === 'string' ? '' : entry?.label || ''
}
