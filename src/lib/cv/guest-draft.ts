// Szkic CV tworzony w kreatorze bez konta (/kreator). Trzymany tylko w localStorage tej
// przeglądarki, aż użytkownik założy konto - wtedy edytor w panelu przejmuje szkic i zapisuje go
// jako pierwsze CV na koncie.
import type { CVData } from '@/lib/cv/types'

export const GUEST_DRAFT_KEY = 'cvpro_guest_draft'

export function hasContent(d: Partial<CVData> | null | undefined): boolean {
  if (!d) return false
  return Boolean(
    d.firstName || d.lastName || d.title || d.summary ||
    (d.experience && d.experience.length) ||
    (d.education && d.education.length) ||
    (d.skills && d.skills.length),
  )
}

export function loadGuestDraft(): CVData | null {
  try {
    const raw = localStorage.getItem(GUEST_DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CVData
    return hasContent(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveGuestDraft(data: CVData): void {
  try {
    localStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify(data))
  } catch {
    // Najczęściej przekroczony limit localStorage przez duże zdjęcie - zapisz szkic bez zdjęcia.
    try { localStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify({ ...data, photo: '' })) } catch { /* brak miejsca - trudno */ }
  }
}

export function clearGuestDraft(): void {
  try { localStorage.removeItem(GUEST_DRAFT_KEY) } catch { /* ignoruj */ }
}
