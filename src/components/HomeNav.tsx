'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

const D = {
  primary: '#4477FF', text: '#E2EEFF', muted: '#8ba3c4', border: 'rgba(56,100,200,0.18)',
}

const PLAN_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  free:    { label: 'Free',    bg: 'rgba(100,116,139,0.2)', color: '#94a3b8' },
  basic:   { label: 'Basic',   bg: 'rgba(56,189,248,0.15)', color: '#38BDF8' },
  pro:     { label: 'Pro',     bg: 'rgba(68,119,255,0.2)',  color: '#4477FF' },
  premium: { label: 'Premium', bg: 'rgba(124,58,237,0.2)',  color: '#a78bfa' },
}

interface Props {
  user: { email: string } | null
  plan: string
}

export default function HomeNav({ user, plan }: Props) {
  const router = useRouter()
  const badge = PLAN_BADGE[plan] ?? PLAN_BADGE.free

  // Smooth scroll with sticky-nav offset
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const id = anchor.getAttribute('href')?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const offset = 70 // sticky nav height
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, height: 62,
      background: 'rgba(6,15,28,0.88)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${D.border}`,
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 5%',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-onest), sans-serif', fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', flexShrink: 0 }}>
        <span style={{ color: D.primary }}>CV</span>
        <span style={{ color: D.text }}>Pro</span>
        <span style={{ color: D.muted, fontSize: 13, fontWeight: 500 }}>.pl</span>
      </Link>

      {/* Center links — always centered via grid */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 13, color: D.muted }}>
        <a href="#jak-to-dziala" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = D.text)}
          onMouseLeave={e => (e.currentTarget.style.color = D.muted)}>
          Jak to działa
        </a>
        <a href="#cennik" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = D.text)}
          onMouseLeave={e => (e.currentTarget.style.color = D.muted)}>
          Cennik
        </a>
        <Link href="/wzory-cv" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = D.text)}
          onMouseLeave={e => (e.currentTarget.style.color = D.muted)}>
          Wzory CV
        </Link>
      </div>

      {/* Right side — auth-aware */}
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, justifySelf: 'end' }}>
          {/* Email */}
          <span style={{ fontSize: 12, color: D.muted, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </span>
          {/* Plan badge */}
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: badge.bg, color: badge.color, border: `1px solid ${badge.color}44`, letterSpacing: '0.04em' }}>
            {badge.label}
          </span>
          {/* Moje CV */}
          <Link href="/dashboard" style={{
            background: 'rgba(68,119,255,0.12)', color: D.text,
            textDecoration: 'none', fontSize: 13, fontWeight: 600,
            padding: '7px 16px', borderRadius: 9,
            border: `1px solid ${D.border}`,
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(68,119,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(68,119,255,0.12)')}>
            Moje CV
          </Link>
          {/* Wyloguj */}
          <button onClick={handleLogout} style={{
            background: 'none', border: `1px solid ${D.border}`, color: D.muted,
            fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 9,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(68,119,255,0.4)'; e.currentTarget.style.color = D.text }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = D.border; e.currentTarget.style.color = D.muted }}>
            Wyloguj
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, justifySelf: 'end' }}>
          <Link href="/auth/login" style={{ color: D.muted, textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = D.text)}
            onMouseLeave={e => (e.currentTarget.style.color = D.muted)}>
            Zaloguj się
          </Link>
          <Link href="/auth/signup" style={{
            background: `linear-gradient(135deg,${D.primary},#7055FF)`,
            color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700,
            padding: '8px 20px', borderRadius: 10,
            boxShadow: '0 4px 18px rgba(68,119,255,0.38)',
          }}>
            Stwórz CV →
          </Link>
        </div>
      )}
    </nav>
  )
}
