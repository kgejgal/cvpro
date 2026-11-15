'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadGuestDraft } from '@/lib/cv/guest-draft'

// Użytkownik, który zaczął CV w /kreator bez konta, po rejestracji ląduje w panelu. Jeśli czeka
// na niego szkic (a konto nie ma jeszcze żadnego CV), przenosimy go od razu do edytora.
export default function GuestDraftRedirect({ enabled }: { enabled: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (enabled && loadGuestDraft()) router.replace('/dashboard/cv/new')
  }, [enabled, router])
  return null
}
