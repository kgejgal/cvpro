import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NotificationBell from '@/components/NotificationBell'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const { data: cvs } = await supabase.from('cvs').select('id, title, template, updated_at, is_public, view_count').eq('user_id', user.id).order('updated_at', { ascending: false })

  const plan = profile?.plan ?? 'free'

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  async function deleteCV(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('cvs').delete().eq('id', id).eq('user_id', user.id)
    redirect('/dashboard')
  }

  async function cloneCV(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: original } = await supabase.from('cvs').select('*').eq('id', id).eq('user_id', user.id).single()
    if (!original) return
    const { data: newCv } = await supabase.from('cvs').insert({
      user_id: user.id,
      title: `${original.title || 'Moje CV'} (kopia)`,
      data: original.data,
      template: original.template,
      color: original.color,
      is_public: false,
    }).select().single()
    if (newCv) redirect(`/dashboard/cv/${newCv.id}`)
    redirect('/dashboard')
  }

  const PLAN_LIMITS: Record<string, number> = { free: 1, basic: 1, pro: 3, premium: Infinity }
  const limit = PLAN_LIMITS[plan] ?? 1
  const canCreate = (cvs?.length ?? 0) < limit

  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a3060' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 56, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Powrót</Link>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none', letterSpacing: -0.3 }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
            <NotificationBell userId={user.id} />
            <Link href="/dashboard/profil" style={{ fontSize: 13, color: '#7a94bb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(68,119,255,0.15)', color: '#4477ff', fontWeight: 700, textTransform: 'capitalize' }}>{plan}</span>
              <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
            </Link>
            <form action={signOut}>
              <button style={{ background: 'none', border: 'none', color: '#4a6a99', cursor: 'pointer', fontSize: 13 }}>Wyloguj</button>
            </form>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px' }}>Moje CV</h1>
            <p style={{ color: '#7a94bb', fontSize: 14, margin: 0 }}>Twoje zapisane dokumenty</p>
          </div>
          <Link href="/dashboard/aplikacje" style={{ background: 'rgba(68,119,255,0.12)', border: '1px solid rgba(68,119,255,0.25)', color: '#7a94bb', textDecoration: 'none', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 6 }}>
            📋 Tracker aplikacji
          </Link>
        </div>

        {cvs && cvs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#162d50', borderRadius: 12, border: '1px solid #1e3f75', overflow: 'hidden' }}>
            {cvs.map((cv, i) => (
              <div
                key={cv.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: i < cvs.length - 1 ? '1px solid #1a3060' : 'none',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{cv.title || 'Bez tytułu'}</div>
                  <div style={{ fontSize: 12, color: '#4a6a99', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {cv.template && <span style={{ textTransform: 'capitalize' }}>{cv.template}</span>}
                    <span>{new Date(cv.updated_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    {cv.is_public && (cv.view_count ?? 0) > 0 && (
                      <span style={{ color: '#4477ff', fontWeight: 600 }}>👁 {cv.view_count} {cv.view_count === 1 ? 'wyświetlenie' : cv.view_count < 5 ? 'wyświetlenia' : 'wyświetleń'}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link
                    href={`/dashboard/cv/${cv.id}`}
                    style={{ background: '#4477ff', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, padding: '7px 18px', borderRadius: 8 }}
                  >
                    Otwórz
                  </Link>
                  <form action={cloneCV}>
                    <input type="hidden" name="id" value={cv.id} />
                    <button
                      type="submit"
                      style={{ background: 'none', border: '1px solid #1e3f75', color: '#7a94bb', fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 8, cursor: 'pointer' }}
                    >
                      Duplikuj
                    </button>
                  </form>
                  <form action={deleteCV}>
                    <input type="hidden" name="id" value={cv.id} />
                    <button
                      type="submit"
                      style={{ background: 'none', border: '1px solid #8b2a2a', color: '#e55', fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 8, cursor: 'pointer' }}
                    >
                      Usuń
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Nie masz jeszcze żadnego CV</h2>
            <p style={{ color: '#7a94bb', fontSize: 14, marginBottom: 24 }}>Stwórz swoje pierwsze profesjonalne CV w kilka minut.</p>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          {canCreate ? (
            <Link
              href="/dashboard/cv/new"
              style={{ display: 'inline-block', background: '#4477ff', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '10px 24px', borderRadius: 8 }}
            >
              + Nowe CV
            </Link>
          ) : (
            <Link
              href="/cennik"
              style={{ display: 'inline-block', background: '#1e3f75', color: '#7a94bb', textDecoration: 'none', fontSize: 14, fontWeight: 600, padding: '10px 24px', borderRadius: 8 }}
            >
              🔒 Upgrade — więcej CV
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
