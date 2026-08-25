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
