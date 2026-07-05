'use client'

import { useEffect, useState } from 'react'

const ADMIN_SOURCE = 'leeep-admin'
const EDIT_SOURCE = 'leeep-inline-edit'

/**
 * Mirror ONE string value live in the editor preview (the single-value sibling
 * of `useLiveList`).
 *
 * InlineEditLayer's `apply-field` patches element TEXT by path — that can't
 * update anything the template feeds into an attribute, like the contact map
 * <iframe src>. A component using this hook owns the value in React state
 * instead: it re-renders on the admin's `apply-field` broadcast for its path,
 * and on mount it PULLS the saved value (`request-value`) in case it missed
 * the load-time broadcast.
 *
 * On the live site no admin is listening, so the state stays at the
 * server-rendered `initial`.
 */
export function useLiveValue(path: string, initial: string): string {
  const [value, setValue] = useState(initial)

  useEffect(() => {
    setValue(initial)
  }, [initial])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const msg = e.data
      if (!msg || msg.source !== ADMIN_SOURCE) return
      if (msg.type === 'apply-field' && msg.path === path && typeof msg.value === 'string') {
        setValue(msg.value)
      }
    }
    window.addEventListener('message', onMessage)
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ source: EDIT_SOURCE, type: 'request-value', path }, '*')
    }
    return () => window.removeEventListener('message', onMessage)
  }, [path])

  return value
}
