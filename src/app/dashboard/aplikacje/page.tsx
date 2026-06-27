import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import KanbanBoard from './KanbanBoard'

export default async function AplikacjePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: apps }, { data: cvs }] = await Promise.all([
    supabase.from('profiles').select('plan').eq('id', user.id).single(),
    supabase.from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('cvs').select('id, title').eq('user_id', user.id).order('updated_at', { ascending: false }),
  ])

  const plan = profile?.plan ?? 'free'

  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a3060' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Moje CV</Link>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none', letterSpacing: -0.3 }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(68,119,255,0.15)', color: '#4477ff', fontWeight: 700, textTransform: 'capitalize' }}>{plan}</span>
            <span style={{ fontSize: 13, color: '#7a94bb', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <KanbanBoard
          initialApps={apps ?? []}
          cvs={(cvs ?? []).map(cv => ({ id: cv.id, title: cv.title || 'Bez tytułu' }))}
          plan={plan}
        />
      </main>
    </div>
  )
}
