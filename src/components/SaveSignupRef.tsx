'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { REF_KEY } from '@/components/PartnerRefCapture'

const SAVED_KEY = 'cvpro_ref_saved'

// Zapisuje na koncie pierwszy znacznik kanału (?ref=...), z którym ta przeglądarka weszła na stronę,
// żeby dało się policzyć, ile rejestracji i zakupów przyniósł każdy kanał (grupa na Facebooku,
// partner, ulotka). Zapisuje tylko wtedy, gdy konto nie ma jeszcze znacznika (pierwszy kontakt wygrywa).
// To wyłącznie statystyka: brak kolumny (migracja jeszcze niezastosowana) lub błąd sieci są pomijane
// po cichu, a próba jest ponawiana najwyżej raz na sesję.
export default function SaveSignupRef({ userId }: { userId: string }) {
  useEffect(() => {
    let ref = ''
    try {
      ref = localStorage.getItem(REF_KEY) ?? ''
      if (!ref || sessionStorage.getItem(SAVED_KEY) === userId) return
      sessionStorage.setItem(SAVED_KEY, userId)
    } catch {
      return // storage niedostępny (tryb prywatny) - nie ma czego zapisywać
    }
    void createClient()
      .from('profiles')
      .update({ signup_ref: ref })
      .eq('id', userId)
      .is('signup_ref', null)
      .then(() => undefined)
  }, [userId])

  return null
}
