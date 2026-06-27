import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NotificationBell from '@/components/NotificationBell'
import ProfileClient from './ProfileClient'

const PLAN_META: Record<string, { label: string; color: string; bg: string; features: string[] }> = {
  free: {
    label: 'Free', color: '#94a3b8', bg: 'rgba(100,116,139,0.15)',
    features: ['1 CV', '2 szablony', 'Podgląd na żywo', 'PDF ze znakiem wodnym'],
  },
  basic: {
    label: 'Basic', color: '#38BDF8', bg: 'rgba(56,189,248,0.15)',
    features: ['1 CV', '4 szablony', 'PDF bez znaku wodnego', 'Klauzula RODO'],
  },
  pro: {
    label: 'Pro', color: '#4477FF', bg: 'rgba(68,119,255,0.15)',
    features: ['3 CV', '8 szablonów', 'PDF bez znaku wodnego', 'Analiza ATS', 'Wsparcie priorytetowe'],
  },
  premium: {
    label: 'Premium', color: '#a78bfa', bg: 'rgba(124,58,237,0.15)',
    features: ['Nieograniczone CV', 'Wszystkie 16 szablonów', 'PDF bez znaku wodnego', 'Analiza ATS', 'List motywacyjny', '30 dni edycji'],
  },
}

const PLAN_LIMITS: Record<string, number> = { free: 1, basic: 1, pro: 3, premium: Infinity }

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const { count } = await supabase.from('cvs').select('id', { count: 'exact', head: true }).eq('user_id', user.id)

  const plan = profile?.plan ?? 'free'
  const meta = PLAN_META[plan] ?? PLAN_META.free
  const cvLimit = PLAN_LIMITS[plan]
  const cvUsed = count ?? 0

  const initials = (user.email ?? 'U').substring(0, 2).toUpperCase()

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a3060' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 56, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Moje CV</Link>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none', letterSpacing: -0.3 }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
            <NotificationBell userId={user.id} />
            <form action={signOut}>
              <button style={{ background: 'none', border: 'none', color: '#4a6a99', cursor: 'pointer', fontSize: 13 }}>Wyloguj</button>
            </form>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 32px' }}>Moje konto</h1>

        {/* Avatar + identity */}
        <div style={{ background: '#122040', border: '1px solid #1e3f75', borderRadius: 16, padding: '28px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg,#4477FF,#7C3AED)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 20, background: meta.bg, border: `1px solid ${meta.color}44`, color: meta.color, fontSize: 12, fontWeight: 700 }}>
              {meta.label}
            </div>
          </div>
        </div>

        {/* Plan details */}
        <div style={{ background: '#122040', border: '1px solid #1e3f75', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e2eeff' }}>Twój plan</div>
            {plan !== 'premium' && (
              <Link href="/cennik" style={{ fontSize: 12, fontWeight: 700, color: '#4477ff', textDecoration: 'none', background: 'rgba(68,119,255,0.1)', padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(68,119,255,0.3)' }}>
                Ulepsz plan →
              </Link>
            )}
          </div>

          {/* CV usage bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: '#7a94bb' }}>Użyte CV</span>
              <span style={{ fontWeight: 600 }}>
                {cvUsed} / {cvLimit === Infinity ? '∞' : cvLimit}
              </span>
            </div>
            {cvLimit !== Infinity && (
              <div style={{ height: 6, background: '#0d1c35', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (cvUsed / cvLimit) * 100)}%`, background: cvUsed >= cvLimit ? '#e55' : 'linear-gradient(90deg,#4477FF,#7C3AED)', borderRadius: 3, transition: 'width 0.6s ease' }} />
              </div>
            )}
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {meta.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <span style={{ color: meta.color, fontSize: 14 }}>✓</span>
                <span style={{ color: '#a0b8e8' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Upgrade prompt */}
          {plan === 'free' && (
            <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(68,119,255,0.08)', border: '1px solid rgba(68,119,255,0.2)', borderRadius: 10, fontSize: 13, color: '#7a94bb', lineHeight: 1.5 }}>
              Kup plan Basic za <strong style={{ color: '#e2eeff' }}>15 PLN jednorazowo</strong> — bez abonamentu, bez pułapek. PDF bez znaku wodnego od razu.{' '}
              <Link href="/cennik" style={{ color: '#4477ff', textDecoration: 'none', fontWeight: 700 }}>Zobacz cennik →</Link>
            </div>
          )}
        </div>

        {/* Account settings — client component (change password) */}
        <ProfileClient email={user.email ?? ''} />

        {/* Danger zone */}
        <div style={{ background: '#1a0d0d', border: '1px solid #3a1515', borderRadius: 16, padding: '24px 28px', marginTop: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e55', marginBottom: 12 }}>Strefa zagrożenia</div>
          <p style={{ fontSize: 13, color: '#7a4040', margin: '0 0 16px', lineHeight: 1.5 }}>
            Usunięcie konta jest nieodwracalne. Wszystkie Twoje CV i dane zostaną permanentnie usunięte.
          </p>
          <form action={signOut}>
            <button
              type="submit"
              style={{ background: 'none', border: '1px solid #5a1a1a', color: '#e55', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 8, cursor: 'pointer' }}
            >
              Wyloguj z urządzenia
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
