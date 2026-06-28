'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const D = {
  bg: '#0d1c35', card: '#162d50', surf: '#122040',
  border: 'rgba(56,100,200,0.18)', borderHi: 'rgba(68,119,255,0.55)',
  primary: '#4477FF', text: '#E2EEFF', muted: '#6B84AA',
}

const PLANS = [
  {
    id: 'basic', name: 'Podstawowy', price: '15', highlight: false,
    features: ['1 wersja CV', '4 szablony', 'Export PDF', 'Bez znaku wodnego'],
  },
  {
    id: 'pro', name: 'Pro', price: '29', highlight: true,
    features: ['3 wersje CV', '8 szablonów', 'Export PDF', 'Analiza ATS', 'Priorytetowe wsparcie'],
  },
  {
    id: 'premium', name: 'Premium', price: '39', highlight: false,
    features: ['Nieograniczone wersje CV', 'Wszystkie 16 szablonów', 'Export PDF', 'Analiza ATS', 'List motywacyjny', 'Priorytetowe wsparcie'],
  },
]

export default function CenikPage() {
  const router = useRouter()

  async function buyPlan(planId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/signup'); return }

    const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: planId }) })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  return (
    <div style={{ minHeight: '100vh', background: D.bg, color: D.text, fontFamily: 'var(--font-onest), sans-serif', padding: '60px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Link href="/" style={{ color: D.primary, textDecoration: 'none', fontSize: 13, display: 'inline-block', marginBottom: 40 }}>← Strona główna</Link>
        <h1 style={{ fontSize: 40, fontWeight: 900, textAlign: 'center', marginBottom: 10, background: 'linear-gradient(135deg, #E2EEFF 25%, #8899FF 70%, #C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Wybierz swój plan
        </h1>
        <p style={{ textAlign: 'center', color: D.muted, marginBottom: 52, fontSize: 16 }}>Jednorazowa płatność · Bez subskrypcji · BLIK, karta, P24</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
          {PLANS.map(({ id, name, price, features, highlight }) => (
            <div
              key={id}
              style={{
                background: highlight ? D.surf : D.card,
                border: `1px solid ${highlight ? D.borderHi : D.border}`,
                borderRadius: 16,
                padding: '28px 24px',
                position: 'relative',
                transform: highlight ? 'scale(1.035)' : 'none',
                boxShadow: highlight ? '0 10px 50px rgba(68,119,255,0.18)' : 'none',
                transition: 'transform 0.2s',
              }}
            >
              {highlight && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg,#4477FF,#7C3AED)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  Najpopularniejszy
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 700, color: highlight ? '#8899ff' : D.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>{name}</div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: D.text }}>{price}</span>
                <span style={{ color: D.muted, fontSize: 15 }}> PLN</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: '#c2d6f0', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <span style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => buyPlan(id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  border: 'none',
                  background: highlight
                    ? 'linear-gradient(135deg, #4477FF, #7C3AED)'
                    : 'rgba(68,119,255,0.12)',
                  color: highlight ? '#fff' : D.primary,
                  boxShadow: highlight ? '0 4px 20px rgba(68,119,255,0.35)' : 'none',
                }}
              >
                Kup teraz
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 40 }}>
          {[
            { icon: '🔒', label: 'Płatności przez Stripe', sub: 'Szyfrowanie SSL · PCI DSS' },
            { icon: '↩️', label: '14-dniowy zwrot', sub: 'Jeśli plik nie pobrany' },
            { icon: '♾️', label: 'Dostęp bezterminowy', sub: 'Raz zapłacone, zawsze Twoje' },
          ].map(({ icon, label, sub }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(68,119,255,0.06)', border: '1px solid rgba(68,119,255,0.15)', borderRadius: 10, padding: '10px 18px' }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: D.text }}>{label}</div>
                <div style={{ fontSize: 11, color: D.muted }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#4a6a99', marginTop: 24, fontSize: 13 }}>Akceptujemy: BLIK · Karta · Przelewy24 · Apple Pay</p>
      </div>
    </div>
  )
}
