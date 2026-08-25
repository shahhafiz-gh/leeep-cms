export type ContactEntry = string | { label?: string; value?: string }

export function contactEntryValue(entry: ContactEntry | undefined) {
  return typeof entry === 'string' ? entry : entry?.value || ''
}

export function contactEntryLabel(entry: ContactEntry | undefined) {
  return typeof entry === 'string' ? '' : entry?.label || ''
}

/** Display Indian numbers locally while keeping other country codes intact. */
export function contactPhoneDisplay(entry: ContactEntry | undefined) {
  const value = contactEntryValue(entry).trim()
  const digits = value.replace(/\D/g, '')
  return digits.length === 12 && digits.startsWith('91')
    ? value.replace(/^\s*\+?\s*91[\s-]*/, '')
    : value
}

/** A compact dialable value; the original country code remains useful to phones. */
export function contactPhoneHref(entry: ContactEntry | undefined) {
  const value = contactEntryValue(entry).trim()
  if (!value) return undefined
  const digits = value.replace(/\D/g, '')
  if (!digits) return undefined
  return `tel:${value.startsWith('+') ? '+' : ''}${digits}`
}
