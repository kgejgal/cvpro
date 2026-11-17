// Znacznik kanału pierwszego kontaktu (first touch): ?ref=partner albo utm_source/medium/campaign.
// Trafia do profiles.signup_ref (kolumna text, limit 40 znaków), więc składamy go w jeden krótki
// napis: "ref", albo "źródło|medium|kampania". Żadnych danych osobowych ani treści CV.

export const REF_KEY = 'cvpro_ref'
export const REF_COOKIE = 'cvpro_ref'
export const REF_MAX = 40

const clean = (v: string | null | undefined, max: number) =>
  (v ?? '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, max)

// Zwraca znacznik z adresu strony albo '' gdy go nie ma.
export function refFromSearch(search: string): string {
  const q = new URLSearchParams(search)
  const ref = clean(q.get('ref'), REF_MAX)
  if (ref) return ref
  const source = clean(q.get('utm_source'), 16)
  if (!source) return ''
  const medium = clean(q.get('utm_medium'), 10)
  const campaign = clean(q.get('utm_campaign'), 12)
  return [source, medium, campaign].filter(Boolean).join('|').slice(0, REF_MAX)
}

// Pozwala tylko znaki, które sami produkujemy (litery, cyfry, _ - |), do 40 znaków.
export function sanitizeRef(v: unknown): string {
  return typeof v === 'string' ? v.toLowerCase().replace(/[^a-z0-9_|-]/g, '').slice(0, REF_MAX) : ''
}

export function readStoredRef(): string {
  try { return sanitizeRef(localStorage.getItem(REF_KEY)) } catch { return '' }
}

// Pierwszy kontakt wygrywa: zapisuje znacznik z adresu tylko gdy nic jeszcze nie zapamiętano.
// Dodatkowo cookie (90 dni, tylko ten serwis), bo logowanie przez Google wraca przez serwer,
// który nie widzi localStorage.
export function captureRef(): string {
  let ref = readStoredRef()
  if (!ref) {
    ref = refFromSearch(window.location.search)
    if (ref) {
      try { localStorage.setItem(REF_KEY, ref) } catch { /* tryb prywatny */ }
    }
  }
  if (ref) {
    try {
      document.cookie = `${REF_COOKIE}=${encodeURIComponent(ref)}; max-age=${90 * 86400}; path=/; SameSite=Lax; Secure`
    } catch { /* ignoruj */ }
  }
  return ref
}
