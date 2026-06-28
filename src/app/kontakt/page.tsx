import Link from 'next/link'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export const metadata: Metadata = {
  title: 'Kontakt — CVPro.pl',
  description: 'Skontaktuj się z zespołem CVPro.pl. Odpowiadamy w ciągu 24 godzin roboczych.',
  alternates: { canonical: `${BASE}/kontakt` },
}

const FAQS = [
  { q: 'Jak długo mam dostęp do CV po zakupie?', a: 'Dostęp jest bezterminowy. Nie ma żadnych opłat cyklicznych — płacisz raz i masz dostęp na zawsze.' },
  { q: 'Czy mogę edytować CV po pobraniu?', a: 'Tak — edytor jest dostępny przez cały czas. Możesz wracać i aktualizować CV w dowolnym momencie.' },
  { q: 'Czy mogę uzyskać fakturę VAT?', a: 'Tak. Napisz do nas na kontakt@cvpro.pl podając dane do faktury, a wystawimy ją w ciągu 24 godzin.' },
  { q: 'Co zrobić jeśli mam problem z płatnością?', a: 'Napisz do nas na kontakt@cvpro.pl z opisem problemu. Sprawdzimy transakcję i pomożemy w ciągu kilku godzin.' },
  { q: 'Czy oferujecie zwroty?', a: 'Tak — jeśli z jakiegoś powodu jesteś niezadowolony, napisz do nas w ciągu 7 dni od zakupu. Rozpatrujemy każdą sprawę indywidualnie.' },
]

export default function KontaktPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a3060', padding: '0 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none' }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <Link href="/" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Strona główna</Link>
        </div>
      </header>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '56px 24px 80px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: -0.5 }}>Kontakt</h1>
        <p style={{ color: '#7a94bb', fontSize: 16, lineHeight: 1.65, margin: '0 0 40px' }}>
          Masz pytanie? Napisz do nas. Odpowiadamy szybko.
        </p>

        {/* Contact card */}
        <div style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 14, padding: '28px 32px', marginBottom: 48, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#7a94bb', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Email</div>
            <a href="mailto:kontakt@cvpro.pl" style={{ color: '#4477ff', fontSize: 18, fontWeight: 700, textDecoration: 'none' }}>kontakt@cvpro.pl</a>
          </div>
          <div style={{ borderLeft: '1px solid #1e3f75', paddingLeft: 32 }}>
            <div style={{ fontSize: 13, color: '#7a94bb', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Czas odpowiedzi</div>
            <div style={{ color: '#34D399', fontSize: 16, fontWeight: 700 }}>Do 24h roboczych</div>
          </div>
        </div>

        {/* Trust signals */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 56 }}>
          {[
            ['🔒', 'Płatność przez Stripe', 'Bezpieczne transakcje kartą i BLIK'],
            ['📄', 'Faktura VAT', 'Na życzenie w ciągu 24h'],
            ['↩️', 'Polityka zwrotów', '7 dni na zgłoszenie'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#e2eeff' }}>{title}</div>
              <div style={{ fontSize: 13, color: '#7a94bb' }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px' }}>Najczęstsze pytania</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map((faq, i) => (
            <details key={i} style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 10, overflow: 'hidden' }}>
              <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 15, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                {faq.q}
                <span style={{ color: '#4477ff', fontSize: 18, flexShrink: 0, marginLeft: 12 }}>+</span>
              </summary>
              <div style={{ padding: '0 20px 16px', color: '#9ab4d8', fontSize: 14, lineHeight: 1.65 }}>{faq.a}</div>
            </details>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '24px', background: 'rgba(68,119,255,0.06)', border: '1px solid rgba(68,119,255,0.2)', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ color: '#7a94bb', fontSize: 14, margin: '0 0 16px' }}>Nie znalazłeś odpowiedzi? Napisz bezpośrednio.</p>
          <a href="mailto:kontakt@cvpro.pl" style={{ background: '#4477ff', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 10, display: 'inline-block' }}>
            Napisz do nas →
          </a>
        </div>
      </main>
    </div>
  )
}
