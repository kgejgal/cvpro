'use client'

import { useEffect } from 'react'
import { tag } from '@/lib/analytics'
import { captureRef, REF_KEY } from '@/lib/attribution'

export { REF_KEY }

// Zapamiętujemy pierwszy znacznik kanału (?ref=… albo utm_source/medium/campaign) w tej przeglądarce
// i dopisujemy go jako tag sesji w Clarity. Przy rejestracji trafia na konto (profiles.signup_ref).
// Czytamy adres bezpośrednio z window.location (bez useSearchParams), żeby nie wyłączać
// statycznego renderowania stron.
export default function PartnerRefCapture() {
  useEffect(() => {
    const ref = captureRef()
    if (ref) tag('ref', ref)
  }, [])

  return null
}
