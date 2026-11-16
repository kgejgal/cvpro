'use client'

import { useEffect } from 'react'
import { tag } from '@/lib/analytics'

const REF_KEY = 'cvpro_ref'

// Partnerzy (agencje pracy, biura karier, szkoły) dostają link z końcówką ?ref=nazwa. Zapamiętujemy
// pierwszy znacznik w tej przeglądarce i dopisujemy go jako tag sesji w Clarity, żeby było widać,
// ile osób przyszło od którego partnera. Czytamy adres bezpośrednio z window.location (bez
// useSearchParams), żeby nie wyłączać statycznego renderowania stron.
export default function PartnerRefCapture() {
  useEffect(() => {
    let ref = ''
    try {
      const raw = new URLSearchParams(window.location.search).get('ref') ?? ''
      const fromUrl = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40)
      const stored = localStorage.getItem(REF_KEY) ?? ''
      if (fromUrl && !stored) localStorage.setItem(REF_KEY, fromUrl)
      ref = stored || fromUrl
    } catch {
      // localStorage niedostępny (tryb prywatny) - znacznik z adresu wystarczy na tę sesję
      try {
        ref = (new URLSearchParams(window.location.search).get('ref') ?? '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40)
      } catch { /* ignoruj */ }
    }
    if (ref) tag('ref', ref)
  }, [])

  return null
}
