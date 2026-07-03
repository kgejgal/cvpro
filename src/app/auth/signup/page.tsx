'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const D = {
  bg: '#0d1c35', card: '#162d50', surf: '#122040',
  border: 'rgba(56,100,200,0.18)', borderFocus: 'rgba(68,119,255,0.6)',
  primary: '#4477FF', text: '#E2EEFF', muted: '#6B84AA', dim: '#3A5070',
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: D.surf, border: `1px solid ${D.border}`,
  borderRadius: 10, padding: '11px 14px', fontSize: 14, color: D.text,
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  async function handleGoogle() {
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError('Rejestracja przez Google jest chwilowo niedostępna.')
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: D.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center', fontFamily: 'var(--font-onest), sans-serif' }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>📧</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: D.text, marginBottom: 10 }}>Sprawdź skrzynkę</h1>
        <p style={{ color: D.muted, maxWidth: 340, lineHeight: 1.6, fontSize: 15 }}>
          Wysłaliśmy link potwierdzający na <strong style={{ color: D.text }}>{email}</strong>. Kliknij go, aby aktywować konto.
        </p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: D.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', fontFamily: 'var(--font-onest), sans-serif' }}>
      <Link href="/" style={{ fontWeight: 900, fontSize: 22, textDecoration: 'none', marginBottom: 32, letterSpacing: '-0.04em' }}>
        <span style={{ color: D.primary }}>CV</span><span style={{ color: D.text }}>Pro</span><span style={{ color: D.muted, fontSize: 14, fontWeight: 500 }}>.pl</span>
      </Link>

      <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: D.text, margin: '0 0 6px' }}>Stwórz konto</h1>
        <p style={{ color: D.muted, fontSize: 14, margin: '0 0 28px' }}>Zacznij tworzyć profesjonalne CV</p>

        {error && (
          <div role="alert" style={{ background: '#2d1212', border: '1px solid #5a1a1a', color: '#e55', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 18 }}>
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          style={{ width: '100%', background: '#fff', color: '#1f1f1f', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Kontynuuj z Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: D.border }} />
          <span style={{ fontSize: 12, color: D.dim }}>lub</span>
          <div style={{ flex: 1, height: 1, background: D.border }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 }}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="jan@przykład.pl"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = D.borderFocus)}
              onBlur={e => (e.target.style.borderColor = D.border)}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 }}>Hasło</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Min. 6 znaków"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => (e.target.style.borderColor = D.borderFocus)}
                onBlur={e => (e.target.style.borderColor = D.border)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: D.dim, padding: 4, display: 'flex', alignItems: 'center' }}
                aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #4477FF, #7C3AED)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4, boxShadow: '0 4px 20px rgba(68,119,255,0.35)' }}
          >
            {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: D.muted, marginTop: 24 }}>
          Masz już konto?{' '}
          <Link href="/auth/login" style={{ color: D.primary, textDecoration: 'none', fontWeight: 600 }}>Zaloguj się</Link>
        </p>
        <p style={{ textAlign: 'center', fontSize: 12, color: D.dim, marginTop: 12, lineHeight: 1.5 }}>
          Rejestrując się, akceptujesz{' '}
          <Link href="/regulamin" style={{ color: D.muted, textDecoration: 'underline' }}>Regulamin</Link>{' '}i{' '}
          <Link href="/polityka-prywatnosci" style={{ color: D.muted, textDecoration: 'underline' }}>Politykę prywatności</Link>.
        </p>
      </div>
    </div>
  )
}
