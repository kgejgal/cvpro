'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@/lib/analytics'

// Plan chosen on /cennik before signing up is stashed in localStorage, because the
// signup flow goes through an e-mail confirmation and loses any URL state.
export const INTENT_KEY = 'cvpro_intent_plan'

const PLAN_NAME: Record<string, string> = { basic: 'Podstawowy', pro: 'Pro', premium: 'Premium' }
const PLAN_PRICE: Record<string, string> = { basic: '15', pro: '29', premium: '39' }

export default function ResumePurchaseBanner({ plan }: { plan: string }) {
  const router = useRouter()
  const [intent, setIntent] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    try {
      // Already paying — the intent is stale.
      if (plan !== 'free') { localStorage.removeItem(INTENT_KEY); return }
      const stored = localStorage.getItem(INTENT_KEY)
      if (stored && PLAN_NAME[stored]) setIntent(stored)
    } catch { /* localStorage unavailable (private mode) — banner just stays hidden */ }
  }, [plan])

  if (!intent) return null

  function dismiss() {
    try { localStorage.removeItem(INTENT_KEY) } catch {}
    setIntent(null)
  }

  async function resume() {
    setBusy(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: intent }),
      })
      const { url } = await res.json()
      if (url) { try { localStorage.removeItem(INTENT_KEY) } catch {}; track('checkout_started'); window.location.href = url; return }
      router.push('/cennik')
    } catch {
      router.push('/cennik')
    }
    setBusy(false)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      background: 'linear-gradient(135deg, rgba(68,119,255,0.14), rgba(124,58,237,0.14))',
      border: '1px solid rgba(68,119,255,0.45)', borderRadius: 12,
      padding: '14px 18px', marginBottom: 22,
    }}>
      <span style={{ fontSize: 20, lineHeight: 1 }}>🛒</span>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#e2eeff' }}>
          Dokończ zakup planu {PLAN_NAME[intent]}
        </div>
        <div style={{ fontSize: 12.5, color: '#9ab4d8', marginTop: 2 }}>
          Jednorazowo {PLAN_PRICE[intent]} zł — bez subskrypcji, dostęp bezterminowy.
        </div>
      </div>
      <button
        onClick={resume}
        disabled={busy}
        style={{
          background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none',
          borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 700,
          cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1, whiteSpace: 'nowrap',
        }}
      >
        {busy ? 'Ładowanie…' : 'Dokończ zakup →'}
      </button>
      <button
        onClick={dismiss}
        aria-label="Zamknij"
        style={{ background: 'none', border: 'none', color: '#5f7ba6', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}
      >
        ×
      </button>
    </div>
  )
}
