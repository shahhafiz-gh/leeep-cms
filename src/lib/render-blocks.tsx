import type { PageType, SchoolData } from '@/types/school.types'
import { resolveBlockOrder, type BlockRegistry } from './layout'

/**
 * Render a page from its block registry.
 *
 * Returns an array of elements rather than a fragment so a caller can still wrap
 * or interleave them.
 */
export function renderBlocks(
  data: SchoolData,
  page: PageType,
  defaults: readonly string[],
  registry: BlockRegistry,
  editing = false,
): React.ReactElement[] {
  return resolveBlockOrder(data, page, defaults, registry).map((id) => {
    const Block = registry[id]
    return <Block key={id} data={data} editing={editing} />
  })
}

