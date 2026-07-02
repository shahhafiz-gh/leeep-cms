import { Icon } from '@iconify/react'

/**
 * Editor-only "add item" button.
 *
 * Hidden on the live site (`display:none` + `data-editor-only`); InlineEditLayer
 * reveals it only while the inline editor is active and wires its click to post
 *
 *   { source: 'leeep-inline-edit', type: 'add-item', path }
 *
 * to the Vue admin, which appends a blank item to the list at `path`, saves, and
 * rebroadcasts the whole array — so the new (empty) card appears immediately in
 * the preview and is ready to fill in from either side.
 *
 * @param path  content path of the repeatable list, e.g. "alumni".
 * @param label button text.
 */
export default function AddItemButton({ path, label }: { path: string; label: string }) {
  return (
    <div data-editor-only style={{ display: 'none' }} className="mt-10 flex justify-center">
      <button
        type="button"
        data-edit-add={path}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-current px-6 py-3 text-sm font-semibold opacity-60 backdrop-blur-sm transition hover:opacity-100 hover:bg-current/10"
      >
        <Icon icon="lucide:plus" className="h-4 w-4" />
        {label}
      </button>
    </div>
  )
}
