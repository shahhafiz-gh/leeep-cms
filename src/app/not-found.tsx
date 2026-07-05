// Shown when a host resolves to no school (bare platform apex, unknown domain,
// or an unpublished site). Kept minimal and self-contained.
export default function NotFound() {
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
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Site not found</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.5 }}>
          No published school website is configured for this address.
        </p>
      </div>
    </main>
  )
}
