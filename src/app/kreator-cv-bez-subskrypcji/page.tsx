import Link from 'next/link'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'
const URL = `${BASE}/kreator-cv-bez-subskrypcji`

const TITLE = 'Kreator CV bez subskrypcji — płacisz raz | CVPro.pl'
const DESC = 'Kreator CV z jednorazową płatnością, bez ukrytej subskrypcji i bez automatycznych opłat. Stwórz profesjonalne CV po polsku, zoptymalizowane pod ATS. Płacisz raz — od 15 zł.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    url: URL,
    title: TITLE,
    description: DESC,
    locale: 'pl_PL',
    siteName: 'CVPro.pl',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
}

const SUB_CONS = [
  'Niska cena startowa (np. 5,95 zł) ukrywa automatyczne odnowienie',
  'Po kilku dniach z konta znika ~60–100 zł — co miesiąc',
  'O subskrypcji dowiadujesz się dopiero przy pobieraniu CV',
  'Trzeba pamiętać o anulowaniu, żeby nie płacić dalej',
  'Trudny i czasochłonny proces rezygnacji',
]

const CVPRO_PROS = [
  'Jedna, jawna opłata — od 15 zł',
  'Zero automatycznych odnowień i ukrytych opłat',
  'Cena widoczna od początku, zanim zaczniesz',
  'Nie musisz niczego anulować',
  '16 szablonów, analiza ATS i list motywacyjny w cenie',
]

const FAQS = [
  {
    q: 'Czy CVPro.pl pobiera opłaty cykliczne?',
    a: 'Nie. CVPro.pl działa wyłącznie w modelu jednorazowej płatności. Płacisz raz za wybrany plan i nie ma żadnych automatycznych odnowień ani ukrytych opłat miesięcznych.',
  },
  {
    q: 'Ile kosztuje stworzenie CV?',
    a: 'Plany zaczynają się od 15 zł (jednorazowo). Pełny pakiet z analizą ATS i listem motywacyjnym to 39 zł — również jednorazowo. Cenę widzisz od razu, bez niespodzianek.',
  },
  {
    q: 'Czym różni się jednorazowa płatność od subskrypcji?',
    a: 'W subskrypcji płacisz cyklicznie, dopóki sam jej nie anulujesz — a wiele serwisów ukrywa tę informację. Przy jednorazowej płatności płacisz tylko raz i temat jest zamknięty.',
  },
  {
    q: 'Jak mogę zapłacić?',
    a: 'Obsługujemy BLIK, karty płatnicze oraz Przelewy24. Płatność jest jednorazowa i bezpieczna.',
  },
]

export default function KreatorBezSubskrypcjiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a3060', padding: '0 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none' }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <Link href="/cennik" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>Cennik →</Link>
        </div>
      </header>

      <main style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#34D399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', padding: '5px 14px', borderRadius: 20, marginBottom: 20, letterSpacing: '0.05em' }}>
            💳 JEDNORAZOWA PŁATNOŚĆ
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: 900, margin: '0 0 18px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Kreator CV bez subskrypcji
          </h1>
          <p style={{ color: '#9ab4d8', fontSize: 17, lineHeight: 1.7, maxWidth: 640, margin: 0 }}>
            Stwórz profesjonalne CV po polsku i zapłać tylko raz. Bez automatycznych odnowień, bez ukrytych opłat miesięcznych, bez pułapki subskrypcji. Cenę widzisz od początku — od 15 zł.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link href="/auth/signup" style={{ background: 'linear-gradient(135deg,#4477FF,#7055FF)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, display: 'inline-block', boxShadow: '0 4px 22px rgba(68,119,255,0.4)' }}>
              Stwórz CV bez subskrypcji →
            </Link>
          </div>
        </div>

        {/* The problem */}
        <section style={{ marginBottom: 44, background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 14, padding: '28px 32px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 14px' }}>Dlaczego to ważne?</h2>
          <p style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.7, margin: '0 0 14px' }}>
            Wiele popularnych kreatorów CV kusi niską ceną startową, a w tle uruchamia automatycznie odnawianą subskrypcję. Użytkownik często dowiaduje się o niej dopiero wtedy, gdy z konta zaczynają znikać kolejne opłaty.
          </p>
          <p style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            Praktyka ta jest na tyle problematyczna, że w 2026 roku{' '}
            <a href="https://uokik.gov.pl/kreator-cv-z-subskrypcja-w-tle-zarzuty-prezesa-uokik" target="_blank" rel="noopener noreferrer" style={{ color: '#7aafff' }}>
              UOKiK nałożył na operatora jednego z największych kreatorów CV karę ponad 760 000 zł
            </a>{' '}
            za ukrywanie informacji o subskrypcji. CVPro.pl powstało jako uczciwa alternatywa — płacisz raz i temat jest zamknięty.
          </p>
        </section>

        {/* Comparison */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 24px', textAlign: 'center' }}>Jednorazowa płatność vs. subskrypcja</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Subscription */}
            <div style={{ background: '#1a0d0d', border: '1px solid #3a1515', borderRadius: 14, padding: '24px 26px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#e09090', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Model subskrypcyjny</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {SUB_CONS.map((c, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#e06060', fontWeight: 800, flexShrink: 0 }}>✕</span>
                    <span style={{ color: '#c9a8a8', fontSize: 14, lineHeight: 1.5 }}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* CVPro */}
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: '24px 26px', boxShadow: '0 8px 32px rgba(16,185,129,0.08)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>CVPro.pl — płacisz raz</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CVPRO_PROS.map((p, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#34D399', fontWeight: 800, flexShrink: 0 }}>✓</span>
                    <span style={{ color: '#b8e6cf', fontSize: 14, lineHeight: 1.5 }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px' }}>Często zadawane pytania</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <details key={i} style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 10, overflow: 'hidden' }}>
                <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', userSelect: 'none' }}>
                  {faq.q}
                  <span style={{ color: '#4477ff', fontSize: 18, flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <div style={{ padding: '0 20px 16px', color: '#9ab4d8', fontSize: 14, lineHeight: 1.65 }}>{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: '#4477ff12', border: '1px solid #4477ff30', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>Stwórz CV, za które płacisz tylko raz</h2>
          <p style={{ color: '#9ab4d8', fontSize: 15, margin: '0 0 24px' }}>16 szablonów, analiza ATS i list motywacyjny. Bez subskrypcji, od 15 zł.</p>
          <Link href="/auth/signup" style={{ background: '#4477ff', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 16, padding: '14px 34px', borderRadius: 10, display: 'inline-block' }}>
            Zaczynam →
          </Link>
        </div>
      </main>
    </div>
  )
}
