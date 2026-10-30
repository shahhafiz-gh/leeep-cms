'use client'

import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'

// Every property a curated style can set (component-styles STYLE_PROPS). Cleared
// before re-applying so picking "Default" hands the property back to the template.
const RESET_PROPERTIES = ['fontSize', 'textAlign', 'whiteSpace', 'lineHeight', 'maxWidth'] as const

const ADMIN_SOURCE = 'leeep-admin'

/**
 * Applies saved curated typography to editable text.
 *
 * In the editor preview the page is rendered from the demo scaffold, so `data`
 * carries none of the draft's styles — the builder sends them as `apply-style`
 * messages instead. Those live picks are kept here and win over `data`;
 * otherwise the observer below (which re-runs on every DOM change the edit
 * layer makes) would wipe them and a style change would only show after publish.
 */
export default function StyleHydrator({ data }: { data: SchoolData }) {
  useEffect(() => {
    const live = new Map<string, CSSProperties>()

    const apply = () => {
      document.querySelectorAll<HTMLElement>('[data-edit], [data-bind]').forEach((element) => {
        const path = element.getAttribute('data-edit') || element.getAttribute('data-bind')
        if (!path) return
        if (!element.hasAttribute('data-style')) element.setAttribute('data-style', path)
        RESET_PROPERTIES.forEach((property) => { element.style[property] = '' })
        Object.assign(element.style, live.get(path) ?? styleObject(data, path))
      })
    }

    const onAdminMessage = (e: MessageEvent) => {
      const msg = e.data
      if (!msg || msg.source !== ADMIN_SOURCE || msg.type !== 'apply-style') return
      if (typeof msg.path !== 'string') return
      live.set(msg.path, msg.value && typeof msg.value === 'object' ? (msg.value as CSSProperties) : {})
      apply()
    }

    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('message', onAdminMessage)
    return () => {
      observer.disconnect()
      window.removeEventListener('message', onAdminMessage)
    }
  }, [data])

  return null
}
