'use client'

import { useEffect } from 'react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'

// Every property a curated style can set (component-styles STYLE_PROPS). Cleared
// before re-applying so picking "Default" hands the property back to the template.
const RESET_PROPERTIES = ['fontSize', 'textAlign', 'whiteSpace', 'lineHeight', 'maxWidth'] as const

/** Applies saved curated typography to editable text on the published site. */
export default function StyleHydrator({ data }: { data: SchoolData }) {
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll<HTMLElement>('[data-edit], [data-bind]').forEach((element) => {
        const path = element.getAttribute('data-edit') || element.getAttribute('data-bind')
        if (!path) return
        if (!element.hasAttribute('data-style')) element.setAttribute('data-style', path)
        RESET_PROPERTIES.forEach((property) => { element.style[property] = '' })
        Object.assign(element.style, styleObject(data, path))
      })
    }

    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [data])

  return null
}
