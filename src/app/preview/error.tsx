'use client'

// Error boundary for the BUILDER's preview only.
//
// Without this, a crash inside the preview iframe fell through to the root
// `error.tsx`, which tells the visitor the school's website isn't available and
// to check that the site is published — the wrong diagnosis, and one that sent
// admins looking at publish state for what was really a client-side render
// crash. Preview is an editor surface, so name the two cases apart and show the
// actual message (client errors keep theirs in production; a server error is
// redacted to a digest, which is the tell that the backend is the problem).
import { useEffect } from 'react'

export default function PreviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[preview error]', error?.message, error?.digest)
  }, [error])

  // A digest with no message is a server render that Next redacted → the read
  // from Frappe failed. A message means the page itself threw in the browser.
  const isBackend = Boolean(error?.digest)

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        background: '#0b0b0c',
        color: '#e7e7ea',
      }}
    >
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {isBackend ? 'Couldn’t load this preview' : 'The preview stopped rendering'}
        </h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.5 }}>
          {isBackend
            ? 'The renderer couldn’t read content from this school’s Frappe site. Your unsaved edits in the form on the right are unaffected.'
            : 'Something in the page threw while updating. Your unsaved edits in the form on the right are unaffected — reload the preview to carry on.'}
        </p>
        {error?.message && !isBackend ? (
          <pre
            style={{
              marginTop: '1rem',
              padding: '0.6rem 0.75rem',
              borderRadius: 8,
              background: '#161618',
              color: '#b9b9c0',
              fontSize: '0.72rem',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {error.message}
          </pre>
        ) : null}
        {error?.digest ? (
          <p style={{ fontSize: '0.72rem', opacity: 0.4, marginTop: '1rem' }}>
            Reference: {error.digest}
          </p>
        ) : null}
        <button
          onClick={reset}
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: 8,
            border: '1px solid #3a3a3f',
            background: 'transparent',
            color: '#e7e7ea',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Reload preview
        </button>
      </div>
    </main>
  )
}
