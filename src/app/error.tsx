'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>Coś poszło nie tak</h2>
        <p style={{ color: '#7a94bb', fontSize: 15, lineHeight: 1.65, margin: '0 0 32px' }}>
          Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
        </p>
        <button
          onClick={reset}
          style={{ background: '#4477FF', color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 10, cursor: 'pointer', marginRight: 12 }}
        >
          Spróbuj ponownie
        </button>
        <a href="/" style={{ color: '#7a94bb', fontSize: 14 }}>Strona główna</a>
      </div>
    </div>
  )
}
