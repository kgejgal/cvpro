import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strona nie znaleziona | CVPro.pl',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: '#4477FF', lineHeight: 1, marginBottom: 16 }}>404</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 12px' }}>Strona nie znaleziona</h1>
        <p style={{ color: '#7a94bb', fontSize: 15, lineHeight: 1.65, margin: '0 0 32px' }}>
          Ta strona nie istnieje lub została przeniesiona. Sprawdź adres URL albo wróć na stronę główną.
        </p>
        <Link href="/" style={{ background: '#4477FF', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 10, display: 'inline-block' }}>
          Wróć na stronę główną
        </Link>
        <div style={{ marginTop: 24 }}>
          <Link href="/wzory-cv" style={{ color: '#4477FF', fontSize: 14, marginRight: 20, textDecoration: 'none' }}>Wzory CV</Link>
          <Link href="/poradnik" style={{ color: '#4477FF', fontSize: 14, marginRight: 20, textDecoration: 'none' }}>Poradnik</Link>
          <Link href="/cennik" style={{ color: '#4477FF', fontSize: 14, textDecoration: 'none' }}>Cennik</Link>
        </div>
      </div>
    </div>
  )
}
