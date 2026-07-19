'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (stored === null) { setVisible(true); return }
    if (stored === 'granted') applyConsent(true)
  }, [])

  function decide(granted: boolean) {
    localStorage.setItem(KEY, granted ? 'granted' : 'denied')
    applyConsent(granted)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div role="dialog" aria-label="Zgoda na pliki cookie" style={{ position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 300, maxWidth: 560, margin: '0 auto', background: '#122040', border: '1px solid rgba(56,100,200,0.35)', borderRadius: 14, padding: '16px 18px', boxShadow: '0 12px 48px rgba(0,0,0,0.5)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <p style={{ margin: 0, fontSize: 13, color: '#9ab4d8', lineHeight: 1.55, flex: '1 1 260px' }}>
        Używamy plików cookie do pomiaru skuteczności reklam. Szczegóły w{' '}
        <Link href="/polityka-prywatnosci" style={{ color: '#7aafff' }}>polityce prywatności</Link>.
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
