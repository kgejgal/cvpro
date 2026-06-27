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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Nieprawidłowy email lub hasło.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: D.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', fontFamily: 'var(--font-onest), sans-serif' }}>
      <Link href="/" style={{ fontWeight: 900, fontSize: 22, textDecoration: 'none', marginBottom: 32, letterSpacing: '-0.04em' }}>
        <span style={{ color: D.primary }}>CV</span><span style={{ color: D.text }}>Pro</span><span style={{ color: D.muted, fontSize: 14, fontWeight: 500 }}>.pl</span>
      </Link>

      <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: D.text, margin: '0 0 6px' }}>Zaloguj się</h1>
        <p style={{ color: D.muted, fontSize: 14, margin: '0 0 28px' }}>Wróć do swoich CV</p>

        {error && (
          <div style={{ background: '#2d1212', border: '1px solid #5a1a1a', color: '#e55', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="jan@przykład.pl"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = D.borderFocus)}
              onBlur={e => (e.target.style.borderColor = D.border)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 }}>Hasło</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
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
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: D.muted, marginTop: 24 }}>
          Nie masz konta?{' '}
          <Link href="/auth/signup" style={{ color: D.primary, textDecoration: 'none', fontWeight: 600 }}>Zarejestruj się</Link>
        </p>
      </div>
    </div>
  )
}
