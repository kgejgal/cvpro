'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import type { CVData } from '@/lib/cv/types'
import { EMPTY_CV } from '@/lib/cv/types'
import { loadGuestDraft, saveGuestDraft } from '@/lib/cv/guest-draft'
import { track } from '@/lib/analytics'
import CVForm from '@/components/cv/CVForm'
import CVPreview from '@/components/cv/CVPreview'

const noopSubscribe = () => () => {}

// The saved draft lives in localStorage, so the editor only mounts in the browser: the server
// and the first client render both show the same empty shell, and the editor then starts from the draft.
export default function GuestEditor() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
  if (!mounted) return <div style={{ height: '100vh', background: '#0d1c35' }} />
  return <Editor />
}

function Editor() {
  const [data, setData] = useState<CVData>(() => ({ ...EMPTY_CV, ...loadGuestDraft() }))
  const [showSignup, setShowSignup] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const startedTracked = useRef(false)

  useEffect(() => { track('guest_editor_opened') }, [])

  function handleChange(patch: Partial<CVData>) {
    const next = { ...data, ...patch }
    setData(next)
    if (!startedTracked.current) { startedTracked.current = true; track('guest_cv_started') }
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveGuestDraft(next), 600)
  }

  // Persist right before leaving for signup/login so nothing typed in the last moments is lost.
  function persistNow() {
    clearTimeout(saveTimer.current)
    saveGuestDraft(data)
  }

  function openSignup() {
    track('guest_download_click')
    persistNow()
    setShowSignup(true)
  }

  return (
    <div className="editor-root" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0d1c35', color: '#e2eeff' }}>
      <div className="no-print" style={{ background: '#122040', borderBottom: '1px solid #1e3f75', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: 17, textDecoration: 'none', letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#4477FF' }}>CV</span><span style={{ color: '#e2eeff' }}>Pro</span><span style={{ color: '#6b84aa', fontSize: 12, fontWeight: 500 }}>.pl</span>
        </Link>
        <div style={{ width: 1, height: 20, background: '#1e3f75', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: '#7a94bb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Bez rejestracji. Konto założysz dopiero przy pobieraniu.
        </div>
        <button
          onClick={openSignup}
          style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 12px rgba(68,119,255,0.4)', whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          Pobierz CV →
        </button>
      </div>

      <div className="editor-grid" style={{ flex: 1 }}>
        <div className="no-print editor-form-panel" style={{ borderRight: '1px solid #1e3f75', overflowY: 'auto', background: '#162d50' }}>
          <CVForm data={data} onChange={handleChange} plan="free" />
        </div>
        <div className="editor-preview-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <CVPreview data={data} plan="free" onChange={handleChange} onDownloadPDF={openSignup} />
        </div>
      </div>

      {showSignup && (
        <div className="no-print" role="dialog" aria-label="Załóż konto, aby pobrać CV" onClick={() => setShowSignup(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,22,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#122040', border: '1px solid #1e3f75', borderRadius: 16, padding: '30px 28px', maxWidth: 420, width: '100%', boxShadow: '0 20px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#e2eeff', marginBottom: 8 }}>Twoje CV jest gotowe do zapisania</div>
            <p style={{ fontSize: 14, color: '#9ab4d8', lineHeight: 1.6, margin: '0 0 20px' }}>
              Załóż darmowe konto (zajmuje chwilę), a Twoje CV trafi na nie automatycznie. PDF bez znaku wodnego kosztuje jednorazowo 15 zł, bez subskrypcji.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/auth/signup" onClick={() => track('guest_signup_click')} style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none', boxShadow: '0 4px 20px rgba(68,119,255,0.35)' }}>
                Załóż darmowe konto →
              </Link>
              <Link href="/auth/login" onClick={() => track('guest_login_click')} style={{ border: '1px solid #1e3f75', color: '#9ab4d8', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                Mam już konto
              </Link>
              <button onClick={() => setShowSignup(false)} style={{ background: 'none', border: 'none', color: '#6b84aa', fontSize: 12, cursor: 'pointer', padding: 4 }}>
                Wróć do edycji
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#4a6a99', lineHeight: 1.5, margin: '14px 0 0', textAlign: 'center' }}>
              Szkic jest zapisany tylko w tej przeglądarce. Potwierdź adres e-mail w tej samej przeglądarce, żeby CV trafiło na konto.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
