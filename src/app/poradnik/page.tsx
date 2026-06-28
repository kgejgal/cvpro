import Link from 'next/link'
import { ARTICLES } from '@/lib/poradnik'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export const metadata: Metadata = {
  title: 'Poradnik CV — jak napisać skuteczne CV | CVPro.pl',
  description: 'Praktyczne poradniki o pisaniu CV: jak napisać CV krok po kroku, jak przejść przez system ATS i ile naprawdę kosztuje kreator CV. Wiedza, która pomoże Ci znaleźć pracę.',
  alternates: { canonical: `${BASE}/poradnik` },
}

export default function PoradnikPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a3060', padding: '0 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none' }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <Link href="/" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Strona główna</Link>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '56px 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px', letterSpacing: -0.5 }}>
          Poradnik CV
        </h1>
        <p style={{ color: '#7a94bb', fontSize: 16, lineHeight: 1.65, maxWidth: 560, margin: '0 0 48px' }}>
          Praktyczna wiedza o pisaniu CV i szukaniu pracy. Dowiedz się, jak stworzyć dokument, który przejdzie przez systemy ATS i przekona rekrutera — oraz ile naprawdę kosztuje kreator CV.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {ARTICLES.map(a => (
            <Link
              key={a.slug}
              href={`/poradnik/${a.slug}`}
              style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: '22px 24px', textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: '#e2eeff', lineHeight: 1.3 }}>{a.title}</div>
              <div style={{ fontSize: 13, color: '#7a94bb', lineHeight: 1.5, marginBottom: 10 }}>{a.description.slice(0, 90)}…</div>
              <div style={{ fontSize: 13, color: '#4477ff' }}>Czytaj →</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
