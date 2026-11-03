import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import NotificationBell from '@/components/NotificationBell'
import ResumePurchaseBanner from '@/components/ResumePurchaseBanner'
import PurchaseSuccessTracker from '@/components/PurchaseSuccessTracker'
import DashboardImportCTA from '@/components/DashboardImportCTA'
import PendingButton from '@/components/PendingButton'

// `?success=1` alone is forgeable, so the purchase is only trusted when Stripe itself says
// this checkout session is paid and was created for the signed-in user. Returns the paid
// session id plus the plan it was for, so the dashboard can upgrade the buyer directly.
async function confirmedCheckoutSession(sessionId: string | string[] | undefined, userId: string): Promise<{ id: string; plan: string | null } | null> {
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) return null
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === 'paid' && session.metadata?.user_id === userId) {
      return { id: session.id, plan: session.metadata?.plan ?? null }
    }
    return null
  } catch {
    return null
  }
}

const PLAN_RANK: Record<string, number> = { free: 0, basic: 1, pro: 2, premium: 3 }

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const paid = await confirmedCheckoutSession((await searchParams).session_id, user.id)

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const { data: cvs } = await supabase.from('cvs').select('id, title, template, updated_at, is_public, view_count').eq('user_id', user.id).order('updated_at', { ascending: false })

  let plan = profile?.plan ?? 'free'

  // If Stripe has confirmed this checkout as paid but the webhook hasn't upgraded the plan
  // yet — or never does, as it silently failed to for weeks in Aug 2026 — upgrade the buyer
  // here from the paid session so they are never stuck on their old plan after paying. Uses
  // the service role because users (correctly) cannot change their own plan.
  if (paid?.plan && (PLAN_RANK[paid.plan] ?? 0) > (PLAN_RANK[plan] ?? 0) && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY)
    await admin.from('profiles').upsert({ id: user.id, plan: paid.plan }, { onConflict: 'id' })
    plan = paid.plan
  }

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
    // Refresh the list in place instead of redirect('/dashboard'), which re-renders the whole
    // page (re-auth + refetch profile + refetch every CV) just to drop one row.
    revalidatePath('/dashboard')
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
      {/* On a phone the header row runs out of width and clips "Wyloguj", so below 520px
          the email is hidden (plan badge + bell + Wyloguj stay) and the gutters tighten. */}
      <style>{`
        @keyframes dashrise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .dash-rise { animation: dashrise .5s cubic-bezier(.22,.61,.36,1) both; }
        .dash-rise-2 { animation-delay: .06s; }
        .dash-rise-3 { animation-delay: .12s; }
        .dash-rise-4 { animation-delay: .18s; }
        @media (prefers-reduced-motion: reduce) { .dash-rise { animation: none; } }
        @media (max-width: 560px) {
          /* The rigid 1fr auto 1fr grid forces the right cluster into a narrow track where the
             plan badge and "Wyloguj" collide. On phones switch to flex: drop the redundant
             back-link and email, keep logo left and push the actions to the right edge. */
          .dash-head { display: flex !important; grid-template-columns: none !important; padding-left: 14px !important; padding-right: 14px !important; gap: 10px !important; }
          .dash-back { display: none !important; }
          .dash-email { display: none !important; }
          .dash-actions { margin-left: auto; }
        }
      `}</style>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a3060' }}>
        <div className="dash-head" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 56, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          <Link href="/" className="dash-back" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Powrót</Link>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none', letterSpacing: -0.3 }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <div className="dash-actions" style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', minWidth: 0 }}>
            <NotificationBell userId={user.id} />
            <Link href="/dashboard/profil" style={{ fontSize: 13, color: '#7a94bb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(68,119,255,0.15)', color: '#4477ff', fontWeight: 700, textTransform: 'capitalize', flexShrink: 0 }}>{plan}</span>
              <span className="dash-email" style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
            </Link>
            <form action={signOut}>
              <PendingButton pendingText="Wylogowuję…" style={{ background: 'none', border: 'none', color: '#4a6a99', fontSize: 13 }}>Wyloguj</PendingButton>
            </form>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
        {paid && <PurchaseSuccessTracker sessionId={paid.id} />}
        <ResumePurchaseBanner plan={plan} />

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
                    <PendingButton
                      pendingText="Duplikuję…"
                      style={{ background: 'none', border: '1px solid #1e3f75', color: '#7a94bb', fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 8 }}
                    >
                      Duplikuj
                    </PendingButton>
                  </form>
                  <form action={deleteCV}>
                    <input type="hidden" name="id" value={cv.id} />
                    <PendingButton
                      pendingText="Usuwam…"
                      style={{ background: 'none', border: '1px solid #8b2a2a', color: '#e55', fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 8 }}
                    >
                      Usuń
                    </PendingButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
            {/* Refined document-upload icon in a soft brand surface (replaces the 📄 emoji). */}
            <div className="dash-rise" style={{ width: 72, height: 72, margin: '0 auto 24px', borderRadius: 20, background: 'radial-gradient(120% 120% at 30% 18%, rgba(68,119,255,0.22), rgba(68,119,255,0.05))', border: '1px solid rgba(68,119,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8fb6ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
                <path d="M13 3v6h6" />
                <path d="M12 18.5V13" />
                <path d="M9.5 15.5 12 13l2.5 2.5" />
              </svg>
            </div>
            <h2 className="dash-rise dash-rise-2" style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 10px', textWrap: 'balance' }}>
              Stwórz swoje pierwsze CV
            </h2>
            <p className="dash-rise dash-rise-2" style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.6, margin: '0 auto 28px', maxWidth: 360 }}>
              Masz już CV? Wczytaj je i masz gotowe w kilka sekund. Wolisz zacząć od zera — też dobrze.
            </p>

            {/* Primary path: upload an existing CV (the activation lever) */}
            <div className="dash-rise dash-rise-3">
              <DashboardImportCTA userId={user.id} />
            </div>

            {/* Secondary path: start from a blank form */}
            <div className="dash-rise dash-rise-4" style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0 16px', color: '#466089', fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#1a3060' }} />
              <span>albo</span>
              <div style={{ flex: 1, height: 1, background: '#1a3060' }} />
            </div>
            <Link
              href="/dashboard/cv/new"
              className="dash-rise dash-rise-4"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#9ab4d8', textDecoration: 'none', fontSize: 14, fontWeight: 600, padding: '11px 22px', borderRadius: 11, border: '1px solid #223c6b' }}
            >
              Zacznij od pustego formularza <span style={{ color: '#6f8dc0' }}>→</span>
            </Link>
          </div>
        )}

        {cvs && cvs.length > 0 && (
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
        )}
      </main>
    </div>
  )
}
