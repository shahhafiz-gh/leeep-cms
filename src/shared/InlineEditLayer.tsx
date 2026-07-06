  'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Generic inline-edit layer (capture only — NO save).
 *
 * Rendered ONLY in preview/draft mode (gated by the caller on
 * `resolvePreviewMode`). It walks the DOM for the editable tags emitted by the
 * Home/layout components and:
 *   - `[data-edit]`        → makes the element `contentEditable`
 *   - `[data-edit-img]`    → clickable, signals an image-upload intent
 *   - `[data-edit-icon]`   → clickable, prompts for a new iconify name
 *   - `[data-edit-link]`   → clickable, prompts for a new href
 *   - `[data-edit-date]`   → clickable, prompts for a new date (stored-blob dates)
 *   - `[data-edit-social]` → clickable, opens a CUSTOM popup to set the URL
 *
 * Every change is `postMessage`d to the parent (the Vue admin) as
 * `{ source, path, type, value }` with an explicit `targetOrigin`. It never
 * fetches, never saves, and never touches `updates.*` / `config.*`.
 */

const MESSAGE_SOURCE = 'leeep-inline-edit'
const ADMIN_SOURCE = 'leeep-admin'

/** Resolve the parent (admin) origin for `postMessage` targetOrigin. */
function getParentOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_ADMIN_ORIGIN
  if (configured) return configured
  if (typeof document !== 'undefined' && document.referrer) {
    try {
      return new URL(document.referrer).origin
    } catch {
      /* fall through */
    }
  }
  // Last resort so a change is never silently dropped in dev. The parent still
  // validates `event.origin`, so this stays a UX-only fallback.
  return '*'
}

/** Turn a content path into a short field label for an empty-field placeholder,
 *  e.g. "alumni.2.testimonial" → "Testimonial", "stats.0.value" → "Value". */
function humanizeField(path: string): string {
  const last = path.split('.').pop() || ''
  const words = last.replace(/([a-z])([A-Z])/g, '$1 $2')
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Edit'
}

/** Social-link editor state (drives the custom popup). */
type SocialEdit = { el: HTMLElement; path: string; platform: string; url: string }

export default function InlineEditLayer() {
  const [social, setSocial] = useState<SocialEdit | null>(null)
  const [draftUrl, setDraftUrl] = useState('')
  // Read-only informational note popup (e.g. hero stat badges). `action`/`target`
  // add a link that jumps the admin form to a related field.
  const [note, setNote] = useState<{
    text: string
    x: number
    y: number
    action?: string
    target?: string
  } | null>(null)
  // Shared-section note shown on HOVER (e.g. "Why choose us"). Distinct from the
  // click popup above so hovering the section reveals the info without a click.
  const [hoverNote, setHoverNote] = useState<{
    text: string
    x: number
    y: number
    action?: string
    target?: string
  } | null>(null)
  const hoverHideTimer = useRef<number | null>(null)
  const cancelHoverHide = () => {
    if (hoverHideTimer.current) {
      clearTimeout(hoverHideTimer.current)
      hoverHideTimer.current = null
    }
  }
  // Small grace delay so moving the pointer from the section into the tooltip
  // (e.g. to click its action button) doesn't dismiss it.
  const scheduleHoverHide = () => {
    cancelHoverHide()
    hoverHideTimer.current = window.setTimeout(() => setHoverNote(null), 160)
  }
  const targetOriginRef = useRef<string>('*')

  useEffect(() => {
    // Only meaningful inside the admin iframe.
    if (window.parent === window) return

    const targetOrigin = getParentOrigin()
    targetOriginRef.current = targetOrigin
    const cleanups: Array<() => void> = []

    const post = (payload: { path?: string; type: string; value?: unknown }) => {
      window.parent.postMessage({ source: MESSAGE_SOURCE, ...payload }, targetOrigin)
    }

    // Elements already wired, so re-scans (see the MutationObserver below) skip
    // them instead of stacking duplicate listeners. New nodes — e.g. a card a
    // client section adds on `apply-list` — get bound on the next scan.
    const bound = new WeakSet<HTMLElement>()

    // Applied media (image/video poster) overrides, keyed by content path. The
    // preview renders the DEMO scaffold; the admin overlays saved draft images
    // via `apply-image`. But next/image (lazy-loading / client re-render) can
    // reset an <img>'s src back to the demo AFTER our swap, so a refresh would
    // "lose" the saved image. We remember every applied override and re-assert
    // it whenever the element's src drifts (via the observer + timed passes).
    const mediaOverrides = new Map<string, string>()
    // Applied TEXT overrides (data-edit / data-bind), keyed by content path. Same
    // problem as media: the admin overlays draft text onto the demo scaffold, but
    // a React re-render (dev StrictMode / Fast Refresh, or any client re-render)
    // resets the element's text back to the demo value. We remember every applied
    // text override and re-assert it on drift so draft content stays visible in
    // the preview (this is why edits showed live but "vanished" on the draft
    // preview until published).
    const textOverrides = new Map<string, string>()
    // Re-assert every remembered text override whose element drifted back to a
    // different value (skipping one the admin is actively editing). Assigned here
    // so the observer/timers can call it; media version is assigned below.
    const reassertText = () => {
      textOverrides.forEach((value, path) => {
        document.querySelectorAll<HTMLElement>(`[data-edit="${path}"],[data-bind="${path}"]`).forEach((el) => {
          if (document.activeElement === el) return
          if (el.textContent !== value) el.textContent = value
        })
      })
    }
    // Assigned once `applyImage` exists (below); the observer calls it via this
    // binding so image overrides survive framework-driven src resets.
    let reassertMedia: () => void = () => {}

    // Bind every editable affordance found in the DOM right now. Idempotent, so
    // it's safe to call repeatedly as repeatable sections add/remove cards.
    const scan = () => {
    // ── Text ─────────────────────────────────────────────────────────────
    document.querySelectorAll<HTMLElement>('[data-edit]').forEach((el) => {
      if (bound.has(el)) return
      const path = el.getAttribute('data-edit')
      if (!path) return
      bound.add(el)
      el.setAttribute('contenteditable', 'plaintext-only')
      el.dataset.leeepEditable = 'text'
      // Placeholder for empty fields (e.g. a just-added blank card): derive a
      // label from the path's last segment and flag emptiness so the CSS
      // ::before hint appears until the admin types something.
      el.dataset.leeepPh = humanizeField(path)
      const syncEmpty = () => {
        if (el.innerText.trim() === '') el.dataset.leeepEmpty = ''
        else delete el.dataset.leeepEmpty
      }
      syncEmpty()
      const onBlur = () => {
        syncEmpty()
        const edited = el.innerText.trim()
        // Keep the override current with the admin's own inline edit, so a later
        // re-render's reassert restores THIS value, not the pre-edit one.
        textOverrides.set(path, edited)
        post({ path, type: 'text', value: edited })
      }
      // Keep edits single-line for text fields.
      const onKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          el.blur()
        }
      }
      el.addEventListener('blur', onBlur)
      el.addEventListener('keydown', onKeydown)
      el.addEventListener('input', syncEmpty)
      cleanups.push(() => {
        el.removeAttribute('contenteditable')
        delete el.dataset.leeepEditable
        delete el.dataset.leeepPh
        delete el.dataset.leeepEmpty
        el.removeEventListener('blur', onBlur)
        el.removeEventListener('keydown', onKeydown)
        el.removeEventListener('input', syncEmpty)
      })
    })

    // ── Editor-only affordances: reveal controls hidden on the live site ──
    // Components render these with inline `display:none` and `data-editor-only`
    // (e.g. the hero's optional "upload background video" button). They appear
    // only while the inline editor is active; live has no edit layer, so they
    // stay hidden.
    document.querySelectorAll<HTMLElement>('[data-editor-only]').forEach((el) => {
      if (bound.has(el)) return
      bound.add(el)
      const prev = el.style.display
      el.style.display = ''
      cleanups.push(() => {
        el.style.display = prev
      })
    })

    // ── Add-item: editor-only "add" buttons for repeatable lists ─────────
    // A button carries data-edit-add="<list path>" (e.g. "alumni"). Clicking
    // asks the admin to append a blank item at that path; the admin saves and
    // rebroadcasts the whole array, so the new card shows up immediately.
    document.querySelectorAll<HTMLElement>('[data-edit-add]').forEach((el) => {
      if (bound.has(el)) return
      const path = el.getAttribute('data-edit-add')
      if (!path) return
      bound.add(el)
      const onClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        post({ path, type: 'add-item' })
      }
      el.addEventListener('click', onClick)
      cleanups.push(() => el.removeEventListener('click', onClick))
    })

    // ── Images: signal INTENT only ───────────────────────────────────────
    // The authenticated admin opens a file picker and uploads (public) — the
    // renderer never uploads or fetches Frappe itself.
    document.querySelectorAll<HTMLElement>('[data-edit-img]').forEach((el) => {
      if (bound.has(el)) return
      const path = el.getAttribute('data-edit-img')
      if (!path) return
      bound.add(el)
      el.dataset.leeepEditable = 'image'
      const onClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        post({ path, type: 'image' })
      }
      el.addEventListener('click', onClick)
      cleanups.push(() => {
        delete el.dataset.leeepEditable
        el.removeEventListener('click', onClick)
      })
    })

    // ── Click-to-edit: icons / links / dates ─────────────────────────────
    const clickEditors: Array<{ attr: string; type: string; ask: string }> = [
      { attr: 'data-edit-icon', type: 'icon', ask: 'New icon name (e.g. lucide:star):' },
      { attr: 'data-edit-link', type: 'link', ask: 'New link URL:' },
      { attr: 'data-edit-date', type: 'date', ask: 'New date (YYYY-MM-DD):' },
    ]

    clickEditors.forEach(({ attr, type, ask }) => {
      document.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((el) => {
        if (bound.has(el)) return
        const path = el.getAttribute(attr)
        if (!path) return
        bound.add(el)
        el.dataset.leeepEditable = type
        const onClick = (e: MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          const next = window.prompt(ask, '')
          if (next !== null) post({ path, type, value: next })
        }
        el.addEventListener('click', onClick)
        cleanups.push(() => {
          delete el.dataset.leeepEditable
          el.removeEventListener('click', onClick)
        })
      })
    })
    } // end scan()

    scan()

    // Repeatable sections (alumni, testimonials, programs, …) add/remove cards at
    // runtime via `apply-list`; re-scan so those new cards' fields become
    // editable and get placeholders too. Debounced to one pass per frame.
    let scanQueued = false
    const observer = new MutationObserver(() => {
      if (scanQueued) return
      scanQueued = true
      requestAnimationFrame(() => {
        scanQueued = false
        scan()
        // Re-assert saved text + images if a re-render reset them back to the
        // demo. Guarded (only re-applies on drift), so this can't loop.
        reassertText()
        reassertMedia()
      })
    })
    // Watch src/srcset too: next/image resetting an <img> is an attribute change,
    // not a childList one, so without this the drift would go unnoticed.
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset'],
    })
    cleanups.push(() => observer.disconnect())

    // ── Social links: reveal empties + open the custom popup ──────────────
    // Live hides un-configured platforms (inline display:none); here we reveal
    // them so the editor can set each one, and flag configured ones as "done".
    document.querySelectorAll<HTMLElement>('[data-edit-social]').forEach((el) => {
      const path = el.getAttribute('data-edit-social')
      if (!path) return
      el.dataset.leeepEditable = 'social'
      if (el.getAttribute('data-social-empty') === 'true') {
        el.style.display = '' // reveal for editing (stays hidden in live)
      } else {
        el.setAttribute('data-leeep-social-done', 'true')
      }
      const onClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const url = el.getAttribute('data-social-url') || ''
        setSocial({
          el,
          path,
          platform: el.getAttribute('data-social-platform') || 'link',
          url,
        })
        setDraftUrl(url)
      }
      el.addEventListener('click', onClick)
      cleanups.push(() => {
        delete el.dataset.leeepEditable
        el.removeEventListener('click', onClick)
      })
    })

    // ── Shared-section note: hover outlines the section AND reveals the note ──
    // For whole sections whose content is reused on another page (e.g. "Why
    // choose us"). Hovering the section outlines it and shows the info tooltip;
    // it stays while the pointer is over the section or the tooltip itself.
    document.querySelectorAll<HTMLElement>('[data-section-note]').forEach((el) => {
      const text = el.getAttribute('data-section-note') || ''
      const action = el.getAttribute('data-note-action') || undefined
      const target = el.getAttribute('data-note-target') || undefined
      const onEnter = (e: MouseEvent) => {
        el.style.outline = '2px dashed rgba(37,99,235,.45)'
        el.style.outlineOffset = '-6px'
        cancelHoverHide()
        setHoverNote({ text, x: e.clientX, y: e.clientY, action, target })
      }
      const onLeave = () => {
        el.style.outline = ''
        el.style.outlineOffset = ''
        scheduleHoverHide()
      }
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        el.style.outline = ''
        el.style.outlineOffset = ''
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    })

    // ── Read-only note badges: click → informational popup ───────────────
    // For values shown here but EDITED elsewhere (e.g. hero stat badges come
    // from the Stats section). Not editable; clicking explains where to edit.
    document.querySelectorAll<HTMLElement>('[data-note]').forEach((el) => {
      const text = el.getAttribute('data-note')
      if (!text) return
      el.dataset.leeepEditable = 'note'
      const action = el.getAttribute('data-note-action') || undefined
      const target = el.getAttribute('data-note-target') || undefined
      const onClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setNote({ text, x: e.clientX, y: e.clientY, action, target })
      }
      el.addEventListener('click', onClick)
      cleanups.push(() => {
        delete el.dataset.leeepEditable
        el.removeEventListener('click', onClick)
      })
    })

    // ── Suppress link navigation while editing ───────────────────────────
    const onDocClickCapture = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a')
      if (anchor) e.preventDefault()
    }
    document.addEventListener('click', onDocClickCapture, true)
    cleanups.push(() => document.removeEventListener('click', onDocClickCapture, true))

    // ── Notify the admin which field is being edited ─────────────────────
    // So the sidebar form can jump to (open + scroll to) the matching input.
    const EDIT_ATTRS = [
      'data-edit', 'data-edit-img', 'data-edit-icon',
      'data-edit-link', 'data-edit-date', 'data-edit-social',
    ]
    const editPathOf = (start: HTMLElement | null): string | null => {
      let el: HTMLElement | null = start
      while (el && el !== document.body) {
        for (const attr of EDIT_ATTRS) {
          const p = el.getAttribute(attr)
          if (p) return p
        }
        el = el.parentElement
      }
      return null
    }
    const onActivate = (e: Event) => {
      const path = editPathOf(e.target as HTMLElement | null)
      if (path) post({ type: 'focus', path })
    }
    // focusin → text fields (contentEditable); pointerdown/click → images/links/etc.
    document.addEventListener('focusin', onActivate, true)
    document.addEventListener('pointerdown', onActivate, true)
    document.addEventListener('click', onActivate, true)
    cleanups.push(() => {
      document.removeEventListener('focusin', onActivate, true)
      document.removeEventListener('pointerdown', onActivate, true)
      document.removeEventListener('click', onActivate, true)
    })

    // ── Visible affordances ──────────────────────────────────────────────
    const style = document.createElement('style')
    style.textContent = `
      [data-leeep-editable]{outline:1px dashed rgba(59,130,246,.6);outline-offset:2px;border-radius:3px}
      /* Highlight the editable text WITHOUT changing its box. A spread box-shadow
         paints a soft "chip" around the element and background tints it, but
         NEITHER takes up layout space — so a centered element (mx-auto) keeps its
         centering and the box never grows/shrinks on hover or focus. The old
         approach used padding + a negative margin, which overrode mx-auto (the
         element jumped to the left) and changed the box size (the pointer fell in
         and out of it, causing flicker). */
      [data-leeep-editable="text"]{box-decoration-break:clone;-webkit-box-decoration-break:clone;border-radius:4px;transition:background-color .12s ease,box-shadow .12s ease}
      [data-leeep-editable="text"]:hover{background:rgba(59,130,246,.09);box-shadow:0 0 0 4px rgba(59,130,246,.09)}
      [data-leeep-editable="text"]:focus{outline:2px solid rgba(59,130,246,.9);outline-offset:2px;background:rgba(59,130,246,.16);box-shadow:0 0 0 4px rgba(59,130,246,.16)}
      /* Empty field (e.g. a just-added blank card) shows its label as a hint so
         the admin knows what to fill; it vanishes as soon as they type/focus. */
      [data-leeep-empty]::before{content:attr(data-leeep-ph);opacity:.5;font-style:italic;font-weight:400;pointer-events:none}
      [data-leeep-empty]:focus::before{content:''}
      [data-leeep-editable="image"],[data-leeep-editable="icon"],
      [data-leeep-editable="link"],[data-leeep-editable="date"],
      [data-leeep-editable="social"]{cursor:pointer!important}
      [data-leeep-editable="note"]{cursor:help!important;outline-style:dotted!important;outline-color:rgba(100,116,139,.55)!important}
      /* A group wrapper (e.g. a mission-point row) highlights as a whole while
         any editable element inside it is focused — so the entire point, not
         just the text run, reads as "being edited". */
      [data-edit-group]{border-radius:14px;transition:box-shadow .15s ease,outline-color .15s ease}
      [data-edit-group]:focus-within{outline:2px solid rgba(59,130,246,.55);outline-offset:3px;box-shadow:0 0 0 5px rgba(59,130,246,.12)}
      @keyframes leeepNoteIn{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}
      [data-leeep-social-done]{position:relative;outline-color:rgba(34,197,94,.7)!important}
      [data-leeep-social-done]::after{content:'✓';position:absolute;top:-6px;right:-6px;width:15px;height:15px;
        line-height:15px;font-size:10px;font-weight:700;text-align:center;background:#22c55e;color:#fff;
        border-radius:9999px;box-shadow:0 0 0 2px rgba(255,255,255,.85);pointer-events:none;z-index:2}
    `
    document.head.appendChild(style)
    cleanups.push(() => style.remove())

    // ── Apply an uploaded image back into the preview ─────────────────────
    // The preview renders PUBLISHED content (draft fetch needs the editor's
    // Frappe session, unavailable cross-origin), so a reload won't reflect a
    // just-uploaded draft image. The admin posts the new (absolute) URL back
    // and we swap the matching <img> in place — mirroring contentEditable.
    const applyImage = (el: HTMLElement, url: string) => {
      if (el instanceof HTMLImageElement) {
        el.srcset = url
        el.src = url
        // Guarantee a clean fit even if the original markup lacked object-cover
        // (e.g. an empty placeholder slot being filled for the first time).
        el.style.objectFit = 'cover'
        el.style.width = '100%'
        el.style.height = '100%'
      } else if (el instanceof HTMLVideoElement) {
        // `data-edit-img` on a <video> is its POSTER — the still image shown
        // before/behind the clip — not the playable source (that's patched via
        // `data-video-target`).
        el.poster = url
      } else {
        // Non-<img> slots (background-image divs, placeholder containers): always
        // cover + center + no-repeat so small images don't tile and large ones
        // don't overflow to a corner.
        el.style.backgroundImage = `url("${url}")`
        el.style.backgroundSize = 'cover'
        el.style.backgroundPosition = 'center'
        el.style.backgroundRepeat = 'no-repeat'
      }
    }

    // Re-apply every remembered image override whose element has drifted back to
    // a different src (e.g. next/image re-asserting the demo URL after our swap).
    // Guarded on drift so it never fights itself into a loop.
    reassertMedia = () => {
      mediaOverrides.forEach((url, path) => {
        document
          .querySelectorAll<HTMLElement>(`[data-edit-img="${path}"]`)
          .forEach((el) => {
            if (el instanceof HTMLImageElement) {
              if (el.getAttribute('src') !== url) applyImage(el, url)
            } else if (!(el instanceof HTMLVideoElement) && !el.style.backgroundImage.includes(url)) {
              applyImage(el, url)
            }
          })
      })
    }

    // Set/clear a background <video>'s playable source so an uploaded clip plays
    // in place (the poster stays the image). Works for BOTH the image-upload flow
    // (`apply-image`) and a value set from the form panel (`apply-field`).
    const applyVideo = (el: HTMLVideoElement, url: string) => {
      if (url) {
        el.setAttribute('src', url)
        let source = el.querySelector('source')
        if (!source) {
          source = document.createElement('source')
          el.appendChild(source)
        }
        source.setAttribute('src', url)
        source.setAttribute('type', 'video/mp4')
      } else {
        el.removeAttribute('src')
        el.querySelector('source')?.remove()
      }
      el.load()
      if (url) void el.play().catch(() => {})
    }

    // Briefly highlight an element the admin jumped to from the sidebar, and
    // scroll it into view. Mirrors the preview → form highlight (the amber tint),
    // so selecting a field in the form lands you on the exact element here.
    let scrollHl: { el: HTMLElement; restore: () => void; timer: number } | null = null
    const highlightElement = (el: HTMLElement) => {
      // Clear a previous highlight immediately so rapid field switches don't pile up.
      if (scrollHl) {
        clearTimeout(scrollHl.timer)
        scrollHl.restore()
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const prev = {
        outline: el.style.outline,
        outlineOffset: el.style.outlineOffset,
        boxShadow: el.style.boxShadow,
        borderRadius: el.style.borderRadius,
        transition: el.style.transition,
      }
      const restore = () => {
        el.style.outline = prev.outline
        el.style.outlineOffset = prev.outlineOffset
        el.style.boxShadow = prev.boxShadow
        el.style.borderRadius = prev.borderRadius
        el.style.transition = prev.transition
        scrollHl = null
      }
      el.style.transition = 'outline-color .2s ease, box-shadow .2s ease'
      el.style.outline = '2px solid rgba(59,130,246,.95)'
      el.style.outlineOffset = '3px'
      el.style.borderRadius = '4px'
      el.style.boxShadow = '0 0 0 6px rgba(59,130,246,.18)'
      const timer = window.setTimeout(restore, 1600)
      scrollHl = { el, restore, timer }
    }

    const onAdminMessage = (e: MessageEvent) => {
      const msg = e.data
      if (!msg || msg.source !== ADMIN_SOURCE) return
      if (typeof msg.path !== 'string') return
      // Paths only contain [\w.] so they're safe inside an attribute selector.
      const sel = (attr: string) => `[${attr}="${msg.path}"]`

      // Form → preview navigation: the admin focused a sidebar input; scroll the
      // matching element into view here and flash it (reverse of the focus flow).
      if (msg.type === 'scroll-to') {
        const target = document.querySelector<HTMLElement>(
          [
            'data-edit', 'data-edit-img', 'data-edit-link',
            'data-edit-social', 'data-bind', 'data-note', 'data-section-note',
          ].map(sel).join(','),
        )
        if (target) highlightElement(target)
        return
      }

      // Image upload / image field → swap every matching element's source.
      if (msg.type === 'apply-image') {
        const value = typeof msg.value === 'string' ? msg.value : ''
        if (value) mediaOverrides.set(msg.path, value)
        else mediaOverrides.delete(msg.path)
        document.querySelectorAll<HTMLElement>(sel('data-edit-img')).forEach((el) => applyImage(el, value))
        // Background-video sources (e.g. Template B hero): set/clear the playable
        // source so an uploaded clip plays in place (the poster stays the image).
        document.querySelectorAll<HTMLVideoElement>(sel('data-video-target')).forEach((el) => applyVideo(el, value))
        return
      }

      // Generic form-field edit (text / textarea / url) → patch in place, the
      // same way an inline edit mutates the DOM, so a sidebar edit shows live.
      // Skip an element the user is actively editing inline (don't fight the caret).
      if (msg.type === 'apply-field') {
        const value = msg.value == null ? '' : String(msg.value)
        // Remember the override so it survives a later re-render resetting it back
        // to the demo (see textOverrides). Applies to both editable + bound text.
        let hadTextTarget = false
        document.querySelectorAll<HTMLElement>(sel('data-edit')).forEach((el) => {
          hadTextTarget = true
          if (document.activeElement !== el) el.textContent = value
        })
        // Display-only mirrors (e.g. hero stat badges): reflect the value but
        // never editable — so edited stats show here without being editable.
        document.querySelectorAll<HTMLElement>(sel('data-bind')).forEach((el) => {
          hadTextTarget = true
          el.textContent = value
        })
        if (hadTextTarget) textOverrides.set(msg.path, value)
        // Remember image overrides delivered as apply-field too, so they survive
        // a later src reset (same reasoning as apply-image).
        const imgTargets = document.querySelectorAll<HTMLElement>(sel('data-edit-img'))
        if (imgTargets.length) {
          if (value) mediaOverrides.set(msg.path, value)
          else mediaOverrides.delete(msg.path)
        }
        imgTargets.forEach((el) => applyImage(el, value))
        // Background video set from the form panel → swap the playable source in
        // (this is the path the hero video uses; without it the clip never shows).
        document.querySelectorAll<HTMLVideoElement>(sel('data-video-target')).forEach((el) => applyVideo(el, value))
        document.querySelectorAll<HTMLElement>(sel('data-edit-link')).forEach((el) => {
          if (value) el.setAttribute('href', value)
        })
        // Social links (footer): set the href + stored url. We keep the icon
        // visible in the editor regardless (the edit layer reveals empties), so
        // an admin can still set a URL for a platform that's currently blank.
        // The green "configured" tick must toggle here too — the demo scaffold
        // starts with ALL platforms empty, so saved URLs arrive only via this
        // overlay, after the initial bind already ran.
        document.querySelectorAll<HTMLElement>(sel('data-edit-social')).forEach((el) => {
          el.setAttribute('data-social-url', value)
          if (value) {
            el.setAttribute('href', value)
            el.removeAttribute('data-social-empty')
            el.setAttribute('data-leeep-social-done', 'true')
            el.style.display = ''
          } else {
            el.removeAttribute('href')
            el.setAttribute('data-social-empty', 'true')
            el.removeAttribute('data-leeep-social-done')
          }
        })
        return
      }

      // Array-shaped sections (add / remove / reorder of whole items) are NOT
      // patched here — surgically rebuilding their DOM is fragile. They own their
      // list in a client component that listens for its own message. Currently:
      // the Template B gallery handles `type: 'apply-gallery'` (full GalleryImage[]
      // array) in GalleryGrid.tsx.
    }
    window.addEventListener('message', onAdminMessage)
    cleanups.push(() => {
      window.removeEventListener('message', onAdminMessage)
      if (scrollHl) {
        clearTimeout(scrollHl.timer)
        scrollHl.restore()
      }
    })

    // Handshake so the admin knows the editable layer is live.
    post({ type: 'ready' })

    // Ask the admin for every image slot's SAVED value. The preview renders the
    // demo image as a scaffold; the admin holds the real (uploaded) URL in the
    // draft. Unlike text, an image has no reliable per-field form entry to drive
    // the load-time overlay (a section may expose the image inline-only, with no
    // sidebar field), so we pull it here by the DOM's own [data-edit-img] paths.
    // The admin replies with `apply-image` for any path that has a saved URL,
    // which also records it in mediaOverrides so it survives later src resets.
    const requestImages = () => {
      const paths = Array.from(
        new Set(
          Array.from(document.querySelectorAll<HTMLElement>('[data-edit-img]'))
            .map((el) => el.getAttribute('data-edit-img'))
            .filter((p): p is string => !!p),
        ),
      )
      if (paths.length) post({ type: 'request-images', value: paths })
    }
    requestImages()

    // Belt-and-suspenders: re-assert saved images a few times after load, in case
    // next/image finishes (lazy) loading a below-the-fold image after the initial
    // overlay ran and reset its src back to the demo. The observer covers most
    // cases; these timed passes cover any it misses. We also re-request in case a
    // section's image slots mounted after the first pass (e.g. list cards).
    ;[300, 900, 1800].forEach((delay) => {
      const id = window.setTimeout(() => { reassertText(); reassertMedia(); requestImages() }, delay)
      cleanups.push(() => clearTimeout(id))
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  // ── Social popup handlers ──────────────────────────────────────────────
  const applySocial = (rawValue: string) => {
    if (!social) return
    const value = rawValue.trim()
    window.parent.postMessage(
      { source: MESSAGE_SOURCE, path: social.path, type: 'link', value },
      targetOriginRef.current,
    )
    const el = social.el
    el.setAttribute('data-social-url', value)
    if (value) {
      el.setAttribute('href', value)
      el.removeAttribute('data-social-empty')
      el.setAttribute('data-leeep-social-done', 'true')
      el.style.display = '' // visible in both editor and live
    } else {
      el.removeAttribute('href')
      el.setAttribute('data-social-empty', 'true')
      el.removeAttribute('data-leeep-social-done')
      // Stays revealed in the editor; live hides it (no edit layer to reveal).
    }
    setSocial(null)
  }

  // ── Read-only note popup (anchored near the clicked badge) ─────────────
  const notePopup = note ? (
    <div
      onClick={() => setNote(null)}
      style={{ position: 'fixed', inset: 0, zIndex: 2147483647 }}
    >
      <div
        role="dialog"
        aria-label="Note"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          left: Math.max(12, Math.min(note.x, window.innerWidth - 312)),
          top: Math.min(note.y + 16, window.innerHeight - 170),
          width: 300,
          background: '#fff',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 50px rgba(15,23,42,.28)',
          padding: 16,
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          color: '#0f172a',
          animation: 'leeepNoteIn .14s ease-out',
        }}
      >
        <style>{`@keyframes leeepNoteIn{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}`}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              borderRadius: 9999,
              background: '#eff6ff',
              color: '#2563eb',
              fontSize: 15,
              fontWeight: 700,
              flexShrink: 0,
            }}
            aria-hidden
          >
            i
          </span>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Good to know</h3>
          <button
            type="button"
            onClick={() => setNote(null)}
            aria-label="Close"
            style={{
              marginLeft: 'auto',
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: 18,
              lineHeight: 1,
              cursor: 'pointer',
              padding: 2,
            }}
          >
            ×
          </button>
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: '#475569' }}>{note.text}</p>
        {note.action && note.target && (
          <button
            type="button"
            onClick={() => {
              window.parent.postMessage(
                { source: MESSAGE_SOURCE, type: 'focus', path: note.target },
                targetOriginRef.current,
              )
              setNote(null)
            }}
            style={{
              marginTop: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              borderRadius: 8,
              padding: '7px 12px',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {note.action}
          </button>
        )}
      </div>
    </div>
  ) : null

  // ── Hover note tooltip (shared-section note, e.g. "Why choose us") ──────
  // No full-screen backdrop (that would block hovering the page); the card
  // itself keeps the tooltip alive while the pointer is over it.
  const hoverPopup = hoverNote ? (
    <div
      role="dialog"
      aria-label="Note"
      onMouseEnter={cancelHoverHide}
      onMouseLeave={scheduleHoverHide}
      style={{
        position: 'fixed',
        left: Math.max(12, Math.min(hoverNote.x, window.innerWidth - 312)),
        top: Math.min(hoverNote.y + 16, window.innerHeight - 170),
        width: 300,
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 50px rgba(15,23,42,.28)',
        padding: 16,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        color: '#0f172a',
        animation: 'leeepNoteIn .14s ease-out',
        zIndex: 2147483647,
      }}
    >
      <style>{`@keyframes leeepNoteIn{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            borderRadius: 9999,
            background: '#eff6ff',
            color: '#2563eb',
            fontSize: 15,
            fontWeight: 700,
            flexShrink: 0,
          }}
          aria-hidden
        >
          i
        </span>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Good to know</h3>
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: '#475569' }}>{hoverNote.text}</p>
      {hoverNote.action && hoverNote.target && (
        <button
          type="button"
          onClick={() => {
            window.parent.postMessage(
              { source: MESSAGE_SOURCE, type: 'focus', path: hoverNote.target },
              targetOriginRef.current,
            )
            setHoverNote(null)
          }}
          style={{
            marginTop: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            borderRadius: 8,
            padding: '7px 12px',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {hoverNote.action}
        </button>
      )}
    </div>
  ) : null

  // Editable affordance: outline any editable element on hover so the admin can
  // SEE what's clickable (clicking opens the docked editor panel in the admin).
  // Only present while this layer is mounted, i.e. the editor preview.
  const editHoverStyle = (
    <style>{`
      [data-edit]:hover, [data-edit-img]:hover, [data-edit-icon]:hover,
      [data-edit-link]:hover, [data-edit-date]:hover, [data-edit-social]:hover,
      [data-edit-add]:hover {
        outline: 2px solid rgba(37, 99, 235, 0.55);
        outline-offset: 2px;
        border-radius: 3px;
        cursor: pointer;
      }
      [data-edit]:hover { cursor: text; }
      [data-edit]:focus, [data-edit-img]:focus-visible {
        outline: 2px solid rgba(37, 99, 235, 0.85);
        outline-offset: 2px;
      }
    `}</style>
  )

  if (!social) return (
    <>
      {editHoverStyle}
      {notePopup}
      {hoverPopup}
    </>
  )

  const label = social.platform.charAt(0).toUpperCase() + social.platform.slice(1)
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') applySocial(draftUrl)
    if (e.key === 'Escape') setSocial(null)
  }

  return (
    <>
    {editHoverStyle}
    {notePopup}
    {hoverPopup}
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${label} link`}
      onClick={() => setSocial(null)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        background: 'rgba(15,23,42,.55)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 24px 60px rgba(0,0,0,.35)',
          padding: 22,
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          color: '#0f172a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{label} link</h3>
          {social.url && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#15803d',
                background: '#dcfce7',
                borderRadius: 9999,
                padding: '2px 8px',
              }}
            >
              ✓ Added
            </span>
          )}
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748b' }}>
          Paste the full URL to your {label} page. Leave empty to hide this icon on the live site.
        </p>
        <input
          autoFocus
          type="url"
          inputMode="url"
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`https://${social.platform}.com/your-school`}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            border: '1px solid #cbd5e1',
            borderRadius: 9,
            padding: '11px 12px',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
          {social.url && (
            <button
              type="button"
              onClick={() => applySocial('')}
              style={{
                marginRight: 'auto',
                border: '1px solid #fecaca',
                background: '#fff',
                color: '#dc2626',
                borderRadius: 9,
                padding: '9px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={() => setSocial(null)}
            style={{
              border: '1px solid #e2e8f0',
              background: '#fff',
              color: '#334155',
              borderRadius: 9,
              padding: '9px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => applySocial(draftUrl)}
            style={{
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              borderRadius: 9,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
