/**
 * Spinner for the BUILDER preview only.
 *
 * This used to live at the app root, where it applied to the public pages too —
 * and once those pages became statically generated, Next started prerendering
 * this spinner as their fallback shell: an unknown host got "Loading…" with a
 * 200, which is what a crawler would then index. The public pages block on a
 * cold render instead (~half a second, once, then edge-cached), so they always
 * return real HTML and an honest status code.
 *
 * Preview is the opposite case: it is per-request by design, fetches draft
 * content on every load, and is only ever seen by a signed-in editor, so a
 * spinner is exactly right.
 */
export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white/70 px-6" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent text-stone-700" />
        <p className="m-0 text-sm font-medium tracking-wide text-stone-700">Loading…</p>
      </div>
    </main>
  )
}
