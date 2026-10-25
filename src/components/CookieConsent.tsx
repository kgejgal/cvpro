'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { setClarityConsent } from '@/lib/analytics'

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const KEY = 'cvpro-cookie-consent'

function applyConsent(granted: boolean) {
  window.gtag?.('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  })
  setClarityConsent(granted)
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (stored === null) {
      // No choice yet: Clarity stays in no-consent mode until the visitor decides.
      setClarityConsent(false)
      setVisible(true)
      return
    }
    // Google already defaults to denied (layout.tsx), so only Clarity needs the explicit "denied".
    if (stored === 'granted') applyConsent(true)
    else setClarityConsent(false)
  }, [])

  function decide(granted: boolean) {
    localStorage.setItem(KEY, granted ? 'granted' : 'denied')
    applyConsent(granted)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div role="dialog" aria-label="Zgoda na pliki cookie" className="cookie-banner" style={{ position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 300, maxWidth: 560, margin: '0 auto', background: '#122040', border: '1px solid rgba(56,100,200,0.35)', borderRadius: 14, padding: '16px 18px', boxShadow: '0 12px 48px rgba(0,0,0,0.5)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <style>{`.cookie-banner .cookie-short { display: none; }
      @media (max-width: 600px) {
        .cookie-banner .cookie-short { display: inline; }
        .cookie-banner { bottom: 8px !important; left: 8px !important; right: 8px !important; padding: 10px 12px !important; gap: 8px !important; border-radius: 12px !important; flex-wrap: nowrap !important; }
        .cookie-banner p { font-size: 11px !important; line-height: 1.4 !important; flex: 1 1 auto !important; }
        .cookie-banner .cookie-long { display: none; }
        .cookie-banner button { padding: 7px 10px !important; font-size: 12px !important; }
      }`}</style>
      <p style={{ margin: 0, fontSize: 13, color: '#9ab4d8', lineHeight: 1.55, flex: '1 1 260px' }}>
        <span className="cookie-long">Używamy plików cookie do pomiaru skuteczności reklam oraz Microsoft Clarity (nagrania sesji i mapy kliknięć), aby ulepszać serwis. Szczegóły w{' '}</span>
        <span className="cookie-short">Cookies do pomiaru reklam i nagrań sesji (Microsoft Clarity). </span>
        <Link href="/polityka-prywatnosci" style={{ color: '#7aafff' }}>Polityka prywatności</Link>.
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={() => decide(false)} style={{ background: 'none', border: '1px solid rgba(56,100,200,0.35)', color: '#7a94bb', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Odrzuć
        </button>
        <button onClick={() => decide(true)} style={{ background: '#4477FF', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Akceptuję
        </button>
      </div>
    </div>
  )
}
