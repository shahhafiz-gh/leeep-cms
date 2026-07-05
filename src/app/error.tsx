'use client'

// Root error boundary. Turns a thrown Server Component render (e.g. the backend
// is unreachable or misconfigured) into a calm page instead of the production
// "message omitted / digest" white-screen. The real cause is in the Vercel
// Runtime Logs (search the digest below).
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surfaces in Vercel Runtime Logs with the real (un-omitted) message.
    console.error('[render error]', error?.message, error?.digest)
  }, [error])

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
      <div style={{ maxWidth: 460, textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          This website isn’t available right now
        </h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.5 }}>
          We couldn’t load this school’s site. If you’re the administrator, check that the
          site is published and the renderer’s backend settings are configured.
        </p>
        {error?.digest ? (
          <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '1rem' }}>
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
          Try again
        </button>
      </div>
    </main>
  )
}
