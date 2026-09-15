import type { CSSProperties } from 'react'
import type { SchoolData } from '@/types/school.types'

/**
 * Curated per-component STYLE presets. A school picks from a fixed set of options
 * per property (never raw CSS), so it can adjust layout/typography without being
 * able to break the design — the same guarantee as colour palettes.
 *
 * Each option resolves to a concrete CSS value so it can be applied both at SSR
 * (inline `style`) and live in the editor (`apply-style` postMessage → el.style).
 * This registry MUST stay in sync with the builder's copy (config.ts).
 */
export const STYLE_PROPS: Record<string, { css: keyof CSSProperties; options: Record<string, string> }> = {
  align: { css: 'textAlign', options: { left: 'left', center: 'center', right: 'right' } },
  wrap: { css: 'whiteSpace', options: { on: 'normal', off: 'nowrap' } },
  fontSize: {
    css: 'fontSize',
    options: {
      small: '0.875em',
      medium: '1em',
      large: '1.125em',
      xlarge: '1.25em',
    },
  },
  // How tightly the lines of a wrapped name stack. A two-line school name set
  // at the template's own heading leading often reads as two separate labels;
  // "tight" pulls it back into one block without changing the type size.
  lineHeight: {
    css: 'lineHeight',
    options: {
      tight: '1.05',
      normal: '1.25',
      relaxed: '1.5',
    },
  },
  // How much horizontal room the name may take before it wraps. Templates used
  // to hardcode this (Heritage pinned it to 13rem), which made both the wrap
  // and the alignment controls look broken: the box never changed size, so the
  // name wrapped in the same place whatever was chosen.
  maxWidth: {
    css: 'maxWidth',
    options: {
      narrow: '11rem',
      medium: '14rem',
      wide: '20rem',
      full: 'none',
    },
  },
}

/** Which style paths are styleable, and with which props. */
export const STYLEABLE: Record<string, string[]> = {
  name: ['align', 'wrap', 'fontSize', 'lineHeight', 'maxWidth'],
}

/** Resolve a component's saved style ids into an inline-style object. */
export function styleObject(data: SchoolData, path: string): CSSProperties {
  const saved = data.styles?.[path]
  if (!saved) return {}
  const out: Record<string, string> = {}
  for (const [prop, id] of Object.entries(saved)) {
    const def = STYLE_PROPS[prop]
    const value = def?.options[String(id)]
    if (def && value) out[def.css as string] = value
    else if (prop === 'fontSize' && /^\d+(?:\.\d+)?px$/.test(String(id))) {
      out.fontSize = String(id)
    }
  }
  return out as CSSProperties
}
