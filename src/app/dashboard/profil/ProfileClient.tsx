'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ProfileClient({ email }: { email: string }) {
  const router = useRouter()

  // Password change
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null)

  // Account deletion
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function changePassword() {
    if (pw.length < 6) { setPwMsg({ text: 'Hasło musi mieć co najmniej 6 znaków.', ok: false }); return }
    if (pw !== pw2) { setPwMsg({ text: 'Hasła nie są zgodne.', ok: false }); return }
    setPwLoading(true); setPwMsg(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pw })
    setPwLoading(false)
    if (error) { setPwMsg({ text: error.message, ok: false }) }
    else { setPwMsg({ text: 'Hasło zostało zmienione.', ok: true }); setPw(''); setPw2(''); setShowPw(false) }
  }

  async function deleteAccount() {
    if (deleteConfirm !== 'USUŃ') return
    setDeleteLoading(true); setDeleteError(null)
    const res = await fetch('/api/account/delete', { method: 'POST' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setDeleteError(data.error ?? 'Wystąpił błąd. Spróbuj ponownie.')
      setDeleteLoading(false)
      return
    }
    // Sign out locally then redirect
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/?deleted=1')
  }

  return (
    <>
      {/* Password change */}
      <div style={{ background: '#122040', border: '1px solid #1e3f75', borderRadius: 16, padding: '24px 28px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#e2eeff', marginBottom: 18 }}>Ustawienia konta</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#4a6a99', marginBottom: 6 }}>Adres e-mail</div>
          <div style={{ fontSize: 14, color: '#7a94bb', padding: '10px 14px', background: '#0d1c35', borderRadius: 8, border: '1px solid #1e3f75' }}>{email}</div>
        </div>

        {!showPw ? (
          <button
            onClick={() => setShowPw(true)}
            style={{ background: 'none', border: '1px solid #1e3f75', color: '#7a94bb', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4477ff44'; e.currentTarget.style.color = '#e2eeff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3f75'; e.currentTarget.style.color = '#7a94bb' }}
          >
            Zmień hasło
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="password" placeholder="Nowe hasło (min. 6 znaków)" value={pw} onChange={e => setPw(e.target.value)}
              style={{ background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#e2eeff', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#4477ff' }} onBlur={e => { e.target.style.borderColor = '#1e3f75' }} />
            <input type="password" placeholder="Powtórz nowe hasło" value={pw2} onChange={e => setPw2(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') changePassword() }}
              style={{ background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#e2eeff', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#4477ff' }} onBlur={e => { e.target.style.borderColor = '#1e3f75' }} />
            {pwMsg && (
              <div style={{ fontSize: 13, color: pwMsg.ok ? '#3db36a' : '#e55', padding: '8px 12px', background: pwMsg.ok ? '#0d2a1a' : '#2a0d0d', borderRadius: 8, border: `1px solid ${pwMsg.ok ? '#2a5a40' : '#5a1a1a'}` }}>
                {pwMsg.ok ? '✓ ' : '⚠ '}{pwMsg.text}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={changePassword} disabled={pwLoading}
                style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: pwLoading ? 'wait' : 'pointer', opacity: pwLoading ? 0.7 : 1 }}>
                {pwLoading ? 'Zapisuję...' : 'Zapisz hasło'}
              </button>
              <button onClick={() => { setShowPw(false); setPw(''); setPw2(''); setPwMsg(null) }}
                style={{ background: 'none', border: '1px solid #1e3f75', color: '#7a94bb', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer' }}>
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div style={{ background: '#1a0d0d', border: '1px solid #3a1515', borderRadius: 16, padding: '24px 28px', marginTop: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#e55', marginBottom: 12 }}>Strefa zagrożenia</div>

        {!showDelete ? (
          <>
            <p style={{ fontSize: 13, color: '#7a4040', margin: '0 0 16px', lineHeight: 1.5 }}>
              Usunięcie konta jest nieodwracalne. Wszystkie Twoje CV i dane zostaną permanentnie usunięte.
            </p>
            <button
              onClick={() => setShowDelete(true)}
              style={{ background: 'none', border: '1px solid #5a1a1a', color: '#e55', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2a0d0d' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
            >
              Usuń konto
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#e55', margin: 0, lineHeight: 1.6 }}>
              Ta operacja <strong>nieodwracalnie</strong> usunie Twoje konto i wszystkie CV. Aby potwierdzić, wpisz <strong>USUŃ</strong> poniżej.
            </p>
            <input
              autoFocus
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Wpisz: USUŃ"
              style={{ background: '#0d0707', border: '1px solid #5a1a1a', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#e55', outline: 'none', letterSpacing: '0.05em' }}
              onFocus={e => { e.target.style.borderColor = '#e55' }}
              onBlur={e => { e.target.style.borderColor = '#5a1a1a' }}
            />
            {deleteError && (
              <div style={{ fontSize: 13, color: '#e55', padding: '8px 12px', background: '#2a0d0d', borderRadius: 8, border: '1px solid #5a1a1a' }}>
                ⚠ {deleteError}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={deleteAccount}
                disabled={deleteConfirm !== 'USUŃ' || deleteLoading}
                style={{ background: deleteConfirm === 'USUŃ' ? '#8b0000' : '#2a0d0d', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: deleteConfirm === 'USUŃ' && !deleteLoading ? 'pointer' : 'not-allowed', opacity: deleteLoading ? 0.7 : 1, transition: 'background 0.2s' }}
              >
                {deleteLoading ? 'Usuwam...' : 'Usuń moje konto na zawsze'}
              </button>
              <button
                onClick={() => { setShowDelete(false); setDeleteConfirm(''); setDeleteError(null) }}
                style={{ background: 'none', border: '1px solid #3a1515', color: '#7a4040', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer' }}
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
