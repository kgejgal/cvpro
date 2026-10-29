'use client'

import { useRef, useState } from 'react'
import type { CVData } from '@/lib/cv/types'
import { MAX_IMPORT_BYTES, withoutEmpty } from '@/lib/cv/import-shared'
import { track } from '@/lib/analytics'

interface Props {
  data: CVData
  onChange: (patch: Partial<CVData>) => void
}

const ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

// Lets people start from an old CV: the file is read on the server (it is not stored) and the
// data lands in the form, where it can be checked and corrected before anything is saved.
export default function CVImport({ data, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const hasContent = data.experience.length > 0 || data.education.length > 0 || !!data.summary.trim()

  function pick() {
    if (busy) return
    if (hasContent && !window.confirm('Dane z pliku zastąpią odpowiadające im sekcje w formularzu. Kontynuować?')) return
    inputRef.current?.click()
  }

  async function onFile(file: File | undefined) {
    if (inputRef.current) inputRef.current.value = '' // lets the same file be chosen again
    if (!file) return
    setNote(null)
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setNote({ kind: 'error', text: 'Obsługujemy tylko pliki PDF i DOCX (nie starszy format DOC).' })
      return
    }
    if (file.size > MAX_IMPORT_BYTES) {
      setNote({ kind: 'error', text: 'Plik jest za duży. Maksymalny rozmiar to 4 MB.' })
      return
    }

    setBusy(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/cv/import', { method: 'POST', body })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.data) {
        track('cv_import_error', String(res.status))
        setNote({ kind: 'error', text: json.error || 'Nie udało się wczytać danych z pliku. Spróbuj ponownie.' })
        return
      }
      const patch = withoutEmpty(json.data as Partial<CVData>)
      onChange(patch)
      track('cv_import_success')
      const jobs = (patch.experience ?? []).length
      const schools = (patch.education ?? []).length
      setNote({
        kind: 'ok',
        text: `Wczytano dane z pliku (stanowiska: ${jobs}, szkoły: ${schools}). Sprawdź je w formularzu i popraw, jeśli coś się nie zgadza.`,
      })
    } catch {
      track('cv_import_error', 'network')
      setNote({ kind: 'error', text: 'Błąd połączenia. Sprawdź internet i spróbuj ponownie.' })
    } finally {
      setBusy(false)
    }
  }

  const button = (
    <button
      type="button"
      onClick={pick}
      disabled={busy}
      style={{
        background: hasContent ? 'none' : 'linear-gradient(135deg,#4477FF,#7C3AED)',
        border: hasContent ? '1px solid #1e3f75' : 'none',
        color: hasContent ? '#a0b8e8' : '#fff',
        borderRadius: 8, padding: hasContent ? '7px 12px' : '10px 16px', fontSize: 13, fontWeight: 700,
        cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1,
      }}
    >
      {busy ? 'Wczytuję dane z pliku…' : hasContent ? '↥ Wczytaj dane z pliku' : '↥ Wczytaj CV z pliku (PDF lub DOCX)'}
    </button>
  )

  return (
    <div style={{ margin: '14px 0 6px' }}>
      <input ref={inputRef} type="file" accept={ACCEPT} onChange={e => void onFile(e.target.files?.[0])} style={{ display: 'none' }} aria-label="Plik z CV (PDF lub DOCX)" />
      {hasContent ? (
        <div>{button}</div>
      ) : (
        <div style={{ border: '1px dashed #2d5499', borderRadius: 10, padding: '14px 14px 16px', background: '#122040' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#e2eeff', marginBottom: 4 }}>Masz już swoje CV?</div>
          <div style={{ fontSize: 12.5, color: '#9ab4d8', lineHeight: 1.55, marginBottom: 12 }}>
            Wczytaj plik PDF lub DOCX (do 4 MB), a my uzupełnimy formularz Twoimi danymi. Plik nie jest zapisywany.
          </div>
          {button}
        </div>
      )}
      <div aria-live="polite">
        {note && (
          <div
            role={note.kind === 'error' ? 'alert' : 'status'}
            style={{
              marginTop: 10, fontSize: 12.5, lineHeight: 1.5, padding: '9px 12px', borderRadius: 8,
              background: note.kind === 'ok' ? '#0d2a1a' : '#2d1212',
              border: `1px solid ${note.kind === 'ok' ? '#2a5a40' : '#5a1a1a'}`,
              color: note.kind === 'ok' ? '#3db36a' : '#e88',
            }}
          >
            {note.text}
          </div>
        )}
      </div>
    </div>
  )
}
