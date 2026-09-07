'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Has this element been scrolled into view yet?
 *
 * The one piece of JavaScript the reveal animations need. Everything else —
 * the fade, the travel, the easing, the delay — is CSS, which is what let
 * framer-motion (a ~50 KB runtime shipped to every visitor of a school website)
 * be removed entirely.
 *
 * `once: true` by default and the observer disconnects on first sight, because
 * these are entrance animations: an element that has arrived has arrived.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '0px 0px -10% 0px',
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No IntersectionObserver (very old browsers, some crawlers): show the
    // content rather than leaving it permanently invisible.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    // Already on screen when we mount — above-the-fold content must not wait
    // for a scroll event that may never come.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
