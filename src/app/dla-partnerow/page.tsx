import Link from 'next/link'
import type { Metadata } from 'next'
import { WZORY } from '@/lib/wzory-cv'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export const metadata: Metadata = {
  title: 'CVPro dla agencji pracy, biur karier i szkół',
  description: 'Poleć swoim kandydatom i uczniom prosty kreator CV po polsku: start bez konta, wzory CV dla wielu zawodów, płatność jednorazowa od 15 zł. Napisz do nas.',
  alternates: { canonical: `${BASE}/dla-partnerow` },
}

const MAIL = 'kontakt@cvpro.pl'
const MAIL_HREF = `mailto:${MAIL}?subject=${encodeURIComponent('Współpraca z CVPro')}`

const BENEFITS: { title: string; text: string }[] = [
  { title: 'Start bez zakładania konta', text: 'Kandydat otwiera kreator i od razu pisze CV. Szkic zapisuje się w jego przeglądarce, a konto założy dopiero, gdy będzie chciał go zachować.' },
  { title: 'Wczytanie starego CV', text: 'Ktoś ma już CV w pliku PDF lub DOCX? Po założeniu darmowego konta wczytuje je, a formularz uzupełnia się danymi, które wystarczy sprawdzić i poprawić.' },
  { title: 'Działa na telefonie', text: 'Większość kandydatów ma pod ręką tylko telefon. Edytor i podgląd CV działają na małym ekranie.' },
  { title: 'Cena bez niespodzianek', text: 'Płatność jednorazowa od 15 zł, BLIK lub karta. Bez subskrypcji i bez ukrytych opłat.' },
  { title: `Wzory CV dla ${WZORY.length} zawodów`, text: 'Gotowe przykłady, od kasjera i operatora wózka widłowego po księgową i programistę. Kandydat widzi, co wpisać.' },
  { title: 'Wszystko po polsku', text: 'Interfejs, szablony i poradniki są po polsku i dostosowane do polskiego rynku pracy.' },
]

const STEPS: { n: string; title: string; text: string }[] = [
  { n: '1', title: 'Udostępniasz link', text: 'W mailu do kandydatów, na swojej stronie, w wiadomości albo na ulotce. Do linku dopisujemy Twój znacznik.' },
  { n: '2', title: 'Kandydat robi CV', text: 'W kilka minut, bez rejestracji, z telefonu lub komputera. Szkic zapisuje się w przeglądarce, a konto założy dopiero, gdy będzie chciał go zachować.' },
  { n: '3', title: 'Pobiera gotowy plik', text: 'Pobiera CV w PDF i wysyła je dalej. Wersja bez znaku wodnego kosztuje jednorazowo od 15 zł.' },
]

const CARD: React.CSSProperties = { background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 14, padding: '20px 22px' }

export default function DlaPartnerowPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a3060', padding: '0 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none' }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <Link href="/" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Strona główna</Link>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: '0 auto', padding: '56px 24px 88px' }}>
        {/* Hero */}
        <section style={{ marginBottom: 56 }}>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.12, margin: '0 0 16px', textWrap: 'balance' }}>
            CVPro dla agencji pracy, biur karier i szkół
          </h1>
          <p style={{ color: '#9ab4d8', fontSize: 17, lineHeight: 1.65, margin: '0 0 28px', maxWidth: 620 }}>
            Pomóż swoim kandydatom i uczniom przygotować czytelne CV w kilka minut. Bez zakładania konta, bez subskrypcji i bez wysyłania ich po poradniki po całym internecie.
          </p>
          <a href={MAIL_HREF} style={{ display: 'inline-block', background: '#4477ff', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 10 }}>
            Napisz do nas →
          </a>
        </section>

        {/* Benefits */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', margin: '0 0 8px' }}>Co dostają Twoi kandydaci</h2>
          <p style={{ color: '#7a94bb', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>Narzędzie jest proste na tyle, żeby nie trzeba było nikogo szkolić.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={CARD}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{b.title}</div>
                <div style={{ color: '#9ab4d8', fontSize: 14, lineHeight: 1.6 }}>{b.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', margin: '0 0 24px' }}>Jak to wygląda w praktyce</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ ...CARD, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ background: '#4477ff22', color: '#7aa2ff', fontWeight: 800, fontSize: 16, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ color: '#9ab4d8', fontSize: 14, lineHeight: 1.6 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Link */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Twój własny link</h2>
          <p style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.65, margin: '0 0 16px', maxWidth: 640 }}>
            Dostaniesz od nas link ze swoim znacznikiem. Dzięki niemu widzimy, ile osób trafiło do kreatora od Ciebie, więc możesz sprawdzić, czy to się sprawdza.
          </p>
          <div style={{ background: '#0b1830', border: '1px dashed #2d5499', borderRadius: 12, padding: '14px 18px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 14, color: '#8fb6ff', overflowWrap: 'anywhere' }}>
            {`${BASE}/kreator?ref=nazwa-twojej-firmy`}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'rgba(68,119,255,0.07)', border: '1px solid rgba(68,119,255,0.25)', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em', margin: '0 0 10px' }}>Chcesz polecać CVPro?</h2>
          <p style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.65, margin: '0 auto 22px', maxWidth: 520 }}>
            Napisz kilka zdań o tym, kim jesteś i ilu kandydatów obsługujesz. Odpowiadamy do 24 godzin roboczych i ustalamy, jak najlepiej to zrobić.
          </p>
          <a href={MAIL_HREF} style={{ display: 'inline-block', background: '#4477ff', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 10 }}>
            {MAIL}
          </a>
        </section>
      </main>
    </div>
  )
}
