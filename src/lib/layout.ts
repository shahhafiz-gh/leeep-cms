import type React from 'react'
import type { PageType, SchoolData } from '@/types/school.types'

/**
 * Page layout as DATA rather than as source code.
 *
 * A page used to be a hardcoded list of JSX tags, which meant the running order
 * of a school's home page lived in our repository and not in their content. Two
 * schools on the same template therefore had to look like the same school, and
 * "can we move the gallery above the programmes?" was a code change.
 *
 * Now a page is an ordered list of BLOCK IDS. Each template publishes a registry
 * mapping those ids to its own components — the same id renders Willow's card
 * grid or Almanac's ink panel — plus the default order it ships with. A school's
 * saved order lives in `data.layout[page]`, and its hidden blocks in
 * `data.hiddenSections`.
 *
 * Three rules make this safe to roll out to sites that already exist:
 *
 *   1. **No saved order means no change.** A school that has never touched the
 *      layout renders exactly the sequence its template always rendered.
 *   2. **Unknown ids are dropped.** The order is stored per page, not per
 *      template, so a school that switches template carries an order that may
 *      name blocks the new template does not have. Those are ignored rather
 *      than crashing the page.
 *   3. **Missing blocks are appended, not lost.** When we add a block to a
 *      template later, schools who saved an order before it existed still get
 *      it — at the end, where it is visible but not disruptive. Removing a block
 *      from a page is done by HIDING it, never by dropping it from the order,
 *      so an absent id always means "new", never "unwanted".
 */

/** A component a template can put in a page slot. */
export type BlockComponent = React.ComponentType<{ data: SchoolData; editing?: boolean }>

/** One template's blocks for one page: `{ hero: HeroSection, … }`. */
export type BlockRegistry = Record<string, BlockComponent>

/** The saved layout: an ordered list of block ids per page. */
export type LayoutMap = Partial<Record<PageType, string[]>>

/** Read a page's saved order, tolerating anything that is not a list of strings. */
function savedOrder(data: SchoolData, page: PageType): string[] | null {
  const saved = data.layout?.[page]
  if (!Array.isArray(saved)) return null
  const clean = saved.filter((id): id is string => typeof id === 'string' && id.trim() !== '')
  return clean.length > 0 ? clean : null
}

/** The ids a school has switched off. */
function hiddenIds(data: SchoolData): Set<string> {
  return new Set(Array.isArray(data.hiddenSections) ? data.hiddenSections : [])
}

/**
 * The ordered, visible block ids for a page — the single place the three rules
 * above are applied.
 *
 * `defaults` is the template's own running order and doubles as the list of
 * blocks that page HAS: an id outside it cannot be rendered by this template.
 */
export function resolveBlockOrder(
  data: SchoolData,
  page: PageType,
  defaults: readonly string[],
  registry: BlockRegistry,
): string[] {
  const available = new Set(defaults.filter((id) => id in registry))
  const saved = savedOrder(data, page)

  // Rule 1 + 2: start from what the school saved, keeping only ids this template
  // can actually draw; with nothing saved, the template's own order stands.
  const ordered = saved ? saved.filter((id) => available.has(id)) : [...available]

  // Rule 3: anything the template offers that the saved order predates.
  if (saved) {
    const seen = new Set(ordered)
    for (const id of defaults) {
      if (available.has(id) && !seen.has(id)) ordered.push(id)
    }
  }

  const hidden = hiddenIds(data)
  return ordered.filter((id) => !hidden.has(id))
}

/**
 * Every block this template can put on this page, in its default order, with
 * whether the school has it switched on.
 *
 * The BUILDER reads this — it needs the full list including hidden blocks, which
 * `resolveBlockOrder` deliberately filters out.
 */
export function describeBlocks(
  data: SchoolData,
  page: PageType,
  defaults: readonly string[],
  registry: BlockRegistry,
): { id: string; visible: boolean }[] {
  const hidden = hiddenIds(data)
  const available = defaults.filter((id) => id in registry)
  const saved = savedOrder(data, page)
  const ordered = saved
    ? [...saved.filter((id) => available.includes(id)), ...available.filter((id) => !saved.includes(id))]
    : available
  return ordered.map((id) => ({ id, visible: !hidden.has(id) }))
}
