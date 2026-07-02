'use client'

import { useEffect, useState } from 'react'

const ADMIN_SOURCE = 'leeep-admin'
const EDIT_SOURCE = 'leeep-inline-edit'

/**
 * Mirror a reorderable list (stats, programs, …) live in the preview.
 *
 * The Vue admin overlays single-field edits by index via InlineEditLayer's
 * `apply-field` DOM patching. That works for text but CANNOT move anything the
 * template derives from the item itself — a rendered icon SVG, a per-item
 * `suffix`, an index-cycled card colour. So a REORDER only shuffled the text and
 * left the icons/suffixes pinned to their old slot.
 *
 * A section using this hook instead OWNS its array in React state and rebuilds
 * on a full-array message, so add / remove / reorder re-render the whole card —
 * icon, suffix and colour included — with no index drift:
 *
 *   { source: 'leeep-admin', type: 'apply-list', path, value: T[] }
 *
 * On load, this hook also PULLS: it asks the admin for the saved array as soon as
 * its listener is attached. On a refresh the admin broadcasts the saved list once
 * (in response to the iframe's `ready`), but a section that mounts a beat later —
 * behind hydration / entrance animations — misses that one-shot message and would
 * be stuck on the demo scaffold until the next edit. Asking for it here closes
 * that race deterministically.
 *
 * On the live site no admin is listening, so the request goes unanswered and the
 * state simply stays at the server-rendered `initial`.
 */
export function useLiveList<T>(path: string, initial: T[]): T[] {
  const [items, setItems] = useState<T[]>(initial)

  // Re-sync if the server re-renders this section with fresh props (e.g. nav).
  useEffect(() => {
    setItems(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)])

  // Reflect add / remove / reorder pushed from the Vue admin panel.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const msg = e.data
      if (!msg || msg.source !== ADMIN_SOURCE) return
      if (msg.type === 'apply-list' && msg.path === path && Array.isArray(msg.value)) {
        setItems(msg.value as T[])
      }
    }
    window.addEventListener('message', onMessage)
    // Pull the current saved array now that we're listening (the admin validates
    // origin, so a wildcard target is fine for this no-op request).
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ source: EDIT_SOURCE, type: 'request-list', path }, '*')
    }
    return () => window.removeEventListener('message', onMessage)
  }, [path])

  return items
}
