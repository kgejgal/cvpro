import Link from 'next/link'
import { WZORY } from '@/lib/wzory-cv'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wzory CV dla różnych zawodów — CVPro.pl',
  description: 'Wybierz swój zawód i pobierz gotowy wzór CV z przykładowym doświadczeniem, umiejętnościami i wskazówkami. Stwórz własne CV online w kilka minut.',
}

export default function WzoryCVPage() {
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
          Wzory CV dla różnych zawodów
        </h1>
        <p style={{ color: '#7a94bb', fontSize: 16, lineHeight: 1.65, maxWidth: 560, margin: '0 0 48px' }}>
          Wybierz swój zawód i zobacz gotowy wzór CV — z przykładowym doświadczeniem, umiejętnościami i wskazówkami, co wpisać, aby przejść rekrutację oraz systemy ATS. Następnie stwórz własne CV w kilka minut.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {WZORY.map(wzor => (
            <Link
              key={wzor.slug}
              href={`/wzory-cv/${wzor.slug}`}
              style={{
                background: '#0f2040',
                border: '1px solid #1e3f75',
                borderRadius: 12,
                padding: '20px 24px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{wzor.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: '#e2eeff' }}>{wzor.title}</div>
              <div style={{ fontSize: 13, color: '#4477ff' }}>Wzór, przykład i wskazówki →</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
