'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { EMPTY_CV, type CVData } from '@/lib/cv/types'
import { MAX_IMPORT_BYTES, withoutEmpty } from '@/lib/cv/import-shared'
import { track } from '@/lib/analytics'
import InlineSpinner from '@/components/InlineSpinner'

const ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

// Shown on the empty dashboard so a jobseeker who already has a CV can upload it instead of
// retyping everything — the friction that makes half of new accounts leave before their first CV.
// The file is read on the server by the existing /api/cv/import route (never stored); on success
// a CV is created with the imported data and the user lands in the editor to review and download.
export default function DashboardImportCTA({ userId }: { userId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function pick() {
    if (busy) return
    track('dashboard_import_click')
    inputRef.current?.click()
  }

  async function onFile(file: File | undefined) {
    if (inputRef.current) inputRef.current.value = '' // lets the same file be chosen again
    if (!file) return
    setError(null)
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setError('Obsługujemy tylko pliki PDF i DOCX (nie starszy format DOC).')
      return
    }
    if (file.size > MAX_IMPORT_BYTES) {
      setError('Plik jest za duży. Maksymalny rozmiar to 4 MB.')
      return
    }

    setBusy(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/cv/import', { method: 'POST', body })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.data) {
        track('cv_import_error', `dashboard:${res.status}`)
        setError(json.error || 'Nie udało się wczytać danych z pliku. Spróbuj ponownie.')
        setBusy(false)
        return
      }

      const patch = withoutEmpty(json.data as Partial<CVData>)
      const data: CVData = { ...EMPTY_CV, ...patch }
      const name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim()

      const supabase = createClient()
      const { data: newCv, error: insertError } = await supabase
        .from('cvs')
        .insert({
          user_id: userId,
          data: data as never,
          title: name ? `CV — ${name}` : 'Moje CV',
          template: data.template,
          color: data.colorTheme,
          is_public: false,
        })
        .select()
        .single()

      if (insertError || !newCv) {
        track('cv_import_error', 'dashboard:save')
        setError('Wczytaliśmy dane, ale nie udało się zapisać CV. Spróbuj ponownie.')
        setBusy(false)
        return
      }

      track('cv_import_success', 'dashboard')
      router.push(`/dashboard/cv/${newCv.id}`)
    } catch {
      track('cv_import_error', 'dashboard:network')
      setError('Błąd połączenia. Sprawdź internet i spróbuj ponownie.')
      setBusy(false)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={e => void onFile(e.target.files?.[0])}
        style={{ display: 'none' }}
        aria-label="Plik z CV (PDF lub DOCX)"
      />

      {/* Primary path: upload an existing CV */}
      <div style={{ border: '1px dashed #2d5499', borderRadius: 14, padding: '22px 22px 24px', background: 'linear-gradient(135deg,#122040,#16294d)', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>↥</span>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#e2eeff' }}>Masz już CV?</div>
        </div>
        <div style={{ fontSize: 13.5, color: '#9ab4d8', lineHeight: 1.6, marginBottom: 16 }}>
          Wgraj plik PDF lub DOCX (do 4 MB), a my uzupełnimy formularz Twoimi danymi w kilka sekund.
          Potem sprawdzisz wszystko w edytorze i pobierzesz gotowe CV. Plik nie jest zapisywany.
        </div>
        <button
          type="button"
          onClick={pick}
          disabled={busy}
          style={{
            background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none',
            borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700,
            cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.85 : 1,
            boxShadow: '0 4px 20px rgba(68,119,255,0.35)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
          }}
        >
          {busy ? <><InlineSpinner /> Wczytuję dane z pliku…</> : '↥ Wczytaj CV z pliku (PDF lub DOCX)'}
        </button>

        {busy && (
          <div style={{ marginTop: 12, fontSize: 12.5, color: '#9ab4d8', lineHeight: 1.5 }}>
            To potrwa kilka sekund — analizujemy Twój plik i uzupełniamy formularz. Nie zamykaj tej strony.
          </div>
        )}
      </div>

      {error && (
        <div role="alert" style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5, padding: '10px 14px', borderRadius: 10, background: '#2d1212', border: '1px solid #5a1a1a', color: '#e88' }}>
          {error}
        </div>
      )}
    </div>
  )
}
