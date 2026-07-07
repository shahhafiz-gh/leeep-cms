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
}

/** Which style paths are styleable, and with which props. */
export const STYLEABLE: Record<string, string[]> = {
  name: ['align', 'wrap'],
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
  }
  return out as CSSProperties
}
