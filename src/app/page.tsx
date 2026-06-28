import Link from 'next/link'
import HomeNav from '@/components/HomeNav'
import { createClient } from '@/lib/supabase/server'

const D = {
  bg: '#0d1c35', card: '#162d50', surf: '#122040',
  border: 'rgba(56,100,200,0.18)',
  primary: '#4477FF', sec: '#38BDF8', ok: '#10B981',
  text: '#E2EEFF', muted: '#8ba3c4', dim: '#4a6080',
}

const PLANS = [
  {
    name: 'Podstawowy', price: '15', popular: false, priceId: 'basic',
    cta: 'Wybierz Podstawowy',
    features: ['Eksport PDF bez znaku wodnego', '1 profesjonalne CV', '4 szablony', 'Klauzula RODO'],
  },
  {
    name: 'Pro', price: '29', popular: true, priceId: 'pro',
    cta: 'Wypróbuj Pro',
    features: ['3 wersje CV', '8 szablonów', 'Eksport PDF', 'Analiza ATS', 'Wsparcie priorytetowe'],
  },
  {
    name: 'Premium', price: '39', popular: false, priceId: 'premium',
    cta: 'Wypróbuj Premium',
    features: ['Nieograniczone wersje', 'Wszystkie 16 szablonów', 'Eksport PDF', 'Analiza ATS', 'List motywacyjny', '30 dni edycji'],
  },
]

const FAQS = [
  { q: 'Czy CV jest naprawdę po polsku?', a: 'Tak — całe CV powstaje w naturalnym, profesjonalnym języku polskim, zgodnym ze standardami polskiego rynku pracy.' },
  { q: 'Czy płacę raz, czy to abonament?', a: 'Płatność jednorazowa — bez abonamentu, bez ukrytych opłat. Kupujesz raz i korzystasz bez ograniczeń czasowych.' },
  { q: 'Czy CV przejdzie przez systemy ATS?', a: 'Tak. Szablony są zoptymalizowane pod systemy ATS. W planach Pro i Premium otrzymujesz szczegółową analizę ATS z konkretnymi wskazówkami.' },
  { q: 'W jakich formatach pobiorę CV?', a: 'Możesz pobrać CV w formacie PDF — gotowe do wysłania rekruterowi.' },
  { q: 'Co z moimi danymi?', a: 'Twoje dane są bezpieczne. Stosujemy szyfrowanie i spełniamy wszystkie wymogi RODO.' },
  { q: 'Czy mogę edytować CV po wygenerowaniu?', a: 'Tak — edytor działa w czasie rzeczywistym, zmiany zapisują się automatycznie.' },
]

const CHIPS = [
  '🔄 Zmiana branży', '✈️ Praca za granicą', '🎓 Świeży absolwent',
  '⏸️ Luka w CV', '🏠 Praca zdalna', '📈 Awans wewnętrzny',
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let plan = 'free'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
    plan = profile?.plan ?? 'free'
  }

  return (
    <div style={{ minHeight: '100vh', background: D.bg, color: D.text, fontFamily: "'DM Sans', var(--font-onest), sans-serif", overflowX: 'hidden' }}>

      <HomeNav user={user ? { email: user.email ?? '' } : null} plan={plan} />

      <main>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 5% 80px', textAlign: 'center' }}>
        {/* Blobs */}
        <div style={{ position: 'absolute', top: '-10%', left: '15%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(68,119,255,0.1) 0%, transparent 68%)', borderRadius: '50%', pointerEvents: 'none', animation: 'blob1 7s ease-in-out infinite', willChange: 'transform' }} />
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(112,85,255,0.08) 0%, transparent 68%)', borderRadius: '50%', pointerEvents: 'none', animation: 'blob2 9s ease-in-out infinite', willChange: 'transform' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '40%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 68%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 20, background: 'rgba(68,119,255,0.1)', border: '1px solid rgba(68,119,255,0.28)', fontSize: 12, color: D.primary, fontWeight: 700, marginBottom: 28, letterSpacing: '0.06em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: D.primary, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            PROFESJONALNE CV W KILKA MINUT
          </div>

          <h1 style={{
            fontFamily: 'var(--font-onest), sans-serif',
            fontSize: 'clamp(38px, 6vw, 60px)', fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-0.05em', margin: '0 0 24px', paddingBottom: 4,
            background: 'linear-gradient(135deg, #E2EEFF 25%, #8899FF 70%, #C084FC)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Profesjonalne CV<br />w języku polskim
          </h1>

          <p style={{ fontSize: 17, color: D.muted, lineHeight: 1.75, maxWidth: 500, margin: '0 auto 42px' }}>
            Opisz siebie własnymi słowami. Otrzymasz profesjonalne CV zoptymalizowane pod polskie standardy i systemy ATS.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            {user ? (
              <Link href="/dashboard" style={{
                background: `linear-gradient(135deg,${D.primary},#7055FF)`, color: '#fff',
                textDecoration: 'none', fontSize: 16, fontWeight: 700, padding: '14px 32px', borderRadius: 12,
                boxShadow: '0 4px 22px rgba(68,119,255,0.42)',
              }}>
                Moje CV →
              </Link>
            ) : (
              <Link href="/auth/signup" style={{
                background: `linear-gradient(135deg,${D.primary},#7055FF)`, color: '#fff',
                textDecoration: 'none', fontSize: 16, fontWeight: 700, padding: '14px 32px', borderRadius: 12,
                boxShadow: '0 4px 22px rgba(68,119,255,0.42)',
              }}>
                Stwórz swoje CV →
              </Link>
            )}
            <a href="#jak-to-dziala" style={{
              background: 'rgba(12,28,52,0.9)', color: D.muted, textDecoration: 'none',
              fontSize: 16, fontWeight: 600, padding: '14px 28px', borderRadius: 12,
              border: `1px solid ${D.border}`,
            }}>
              Jak to działa
            </a>
          </div>

          <div style={{ display: 'flex', gap: 36, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['🇵🇱', 'Polski rynek'], ['⚡', 'Gotowe szybko'], ['📄', 'PDF gotowy'], ['🔒', 'Zgodność RODO']].map(([e, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{e}</div>
                <div style={{ fontSize: 11, color: D.muted, fontWeight: 600, letterSpacing: '0.05em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="jak-to-dziala" style={{ padding: '80px 5%', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 12px' }}>Jak to działa?</h2>
          <p style={{ color: D.muted, fontSize: 15, margin: 0 }}>Trzy proste kroki do profesjonalnego CV</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { n: '01', icon: '📝', title: 'Podaj swoje dane', desc: 'Wypełnij formularz krok po kroku. Dodaj wskazówki i wybierz opcje opisujące Twoją sytuację.' },
            { n: '02', icon: '✍️', title: 'Tworzymy CV',    desc: 'Na podstawie Twoich danych powstaje profesjonalne CV po polsku, zoptymalizowane pod ATS.' },
            { n: '03', icon: '🚀', title: 'Pobierz i aplikuj', desc: 'Wybierz motyw kolorystyczny, pobierz PDF i zacznij aplikować na wymarzone stanowiska.' },
          ].map(({ n, icon, title, desc }) => (
            <div key={n} style={{ padding: 28, background: D.card, borderRadius: 16, border: `1px solid ${D.border}` }}>
              <div style={{ fontSize: 34, marginBottom: 14 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8ab4ff', marginBottom: 8, letterSpacing: '0.1em' }}>KROK {n}</div>
              <h3 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>{title}</h3>
              <p style={{ color: D.muted, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key feature */}
      <section style={{ padding: '80px 5%', background: 'rgba(9,18,36,0.6)', borderTop: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}` }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8ab4ff', letterSpacing: '0.1em', marginBottom: 14 }}>✨ KLUCZOWA FUNKCJA</div>
            <h2 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 18px', lineHeight: 1.15 }}>
              Powiedz nam co jest<br />ważne dla Ciebie
            </h2>
            <p style={{ color: D.muted, fontSize: 15, lineHeight: 1.72, margin: '0 0 26px' }}>
              Masz wyjątkową sytuację? Wpisz to własnymi słowami albo wybierz gotową opcję. Treść CV zostanie dopasowana do Twoich potrzeb i okoliczności.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CHIPS.map(c => (
                <div key={c} style={{ padding: '7px 13px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: 'rgba(68,119,255,0.1)', border: '1px solid rgba(68,119,255,0.22)', color: D.sec }}>
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: D.card, borderRadius: 16, border: `1px solid ${D.border}`, padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: D.muted, marginBottom: 10, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Twoje instrukcje</div>
            <div style={{ padding: 12, background: 'rgba(9,22,42,0.85)', borderRadius: 8, border: `1px solid ${D.border}`, fontSize: 13, color: D.muted, lineHeight: 1.65, minHeight: 75 }}>
              &ldquo;Zmieniam branżę z bankowości do IT. Chcę żeby CV podkreśliło moje umiejętności analityczne i zdolność szybkiego uczenia się technologii...&rdquo;
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['🔄 Zmiana branży', '🎓 Świeży absolwent', '🏠 Praca zdalna'].map(l => (
                <div key={l} style={{ padding: '5px 11px', borderRadius: 16, fontSize: 13, background: '#2255ee', color: '#fff', fontWeight: 600 }}>{l}</div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '10px 13px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, fontSize: 12, color: '#34D399', lineHeight: 1.5, border: '1px solid rgba(16,185,129,0.2)' }}>
              ✅ CV zostanie dostosowane pod zmianę branży, nowe wykształcenie i pracę zdalną
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section style={{ padding: '80px 5%', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 12px' }}>Dlaczego CVPro.pl?</h2>
          <p style={{ color: D.muted, fontSize: 15, margin: 0 }}>Wszystko, czego potrzebujesz do skutecznego CV</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: '🇵🇱', title: '100% po polsku',     desc: 'CV w naturalnym, profesjonalnym języku polskim, zgodnym ze standardami polskiego rynku pracy.' },
            { icon: '🎯', title: 'Zgodne z ATS',        desc: 'Szablony zoptymalizowane pod systemy rekrutacyjne ATS. W planach Pro i Premium — analiza z wskazówkami.' },
            { icon: '⚡', title: 'Gotowe w kilka minut', desc: 'Wypełnij formularz, wybierz szablon i kolorystykę, pobierz gotowe CV w formacie PDF.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ padding: 28, background: D.card, borderRadius: 16, border: `1px solid ${D.border}` }}>
              <div style={{ fontSize: 34, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>{title}</h3>
              <p style={{ color: D.muted, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section style={{ padding: '0 5% 80px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h3 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
            Widzisz różnicę?
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* BEFORE */}
          <div style={{ background: '#1a0d0d', border: '1px solid #3a1515', borderRadius: 16, padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 14, left: 14, background: '#cc2222', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 8, letterSpacing: '0.06em' }}>PRZED</div>
            <div style={{ position: 'absolute', top: 14, right: 14, background: '#3a1515', color: '#e55', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 8 }}>ATS: 24%</div>
            <div style={{ marginTop: 36, fontFamily: 'Georgia, serif', color: '#c0a0a0', fontSize: 13, lineHeight: 1.8 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#e0c0c0' }}>Jan Kowalski</div>
              <div>email: jan@gmail.com tel: 123456789</div>
              <div style={{ marginTop: 10, fontWeight: 700 }}>Doświadczenie:</div>
              <div>- pracowałem w firmie XYZ przez jakiś czas</div>
              <div>- potem w ABC robiłem różne rzeczy</div>
              <div style={{ marginTop: 10, fontWeight: 700 }}>Umiejętności:</div>
              <div>- Excel, Word, PowerPoint, inne</div>
              <div style={{ marginTop: 10, color: '#e09090', fontSize: 12 }}>* Brak sekcji, brak formatowania, trudne do odczytania przez ATS</div>
            </div>
          </div>
          {/* AFTER */}
          <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 16, padding: 24, position: 'relative', boxShadow: '0 8px 32px rgba(68,119,255,0.12)' }}>
            <div style={{ position: 'absolute', top: 14, left: 14, background: '#1a7a40', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 8, letterSpacing: '0.06em' }}>PO</div>
            <div style={{ position: 'absolute', top: 14, right: 14, background: '#0d2a1a', color: '#3db36a', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 8 }}>ATS: 91%</div>
            <div style={{ marginTop: 36 }}>
              <div style={{ borderLeft: `3px solid ${D.primary}`, paddingLeft: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: D.text }}>Jan Kowalski</div>
                <div style={{ fontSize: 12, color: '#8ab4ff', fontWeight: 600 }}>Senior Project Manager</div>
                <div style={{ fontSize: 11, color: D.muted, marginTop: 3 }}>jan.kowalski@email.com · +48 123 456 789 · Warszawa</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Doświadczenie</div>
              <div style={{ fontSize: 12, color: D.muted, lineHeight: 1.6, marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: D.text }}>XYZ Sp. z o.o.</span> · 2021–2024<br />
                • Zarządzał zespołem 12 osób, dostarczył 8 projektów na czas<br />
                • Zredukował koszty operacyjne o 23% dzięki optymalizacji procesów
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Umiejętności</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['Zarządzanie projektami', 'Scrum / Agile', 'MS Project', 'Excel', 'Negocjacje'].map(s => (
                  <span key={s} style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: 'rgba(68,119,255,0.1)', color: '#8ab4ff', border: `1px solid ${D.border}` }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ padding: '28px 5%', background: 'rgba(68,119,255,0.04)', borderTop: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            { n: '2 100+', label: 'użytkowników' },
            { n: '4.9 / 5', label: 'średnia ocena' },
            { n: '100%', label: 'jednorazowa płatność' },
            { n: '0 zł', label: 'ukrytych opłat' },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 26, fontWeight: 900, color: D.primary, letterSpacing: '-0.04em' }}>{n}</div>
              <div style={{ fontSize: 12, color: D.muted, marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ padding: '80px 5%', background: 'rgba(9,18,36,0.5)', borderBottom: `1px solid ${D.border}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8ab4ff', letterSpacing: '0.1em', marginBottom: 12 }}>DLACZEGO MY?</div>
            <h2 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 14px' }}>CVPro.pl vs. konkurencja</h2>
            <p style={{ color: D.muted, fontSize: 15, margin: 0 }}>Inne kreatory CV mają pułapki. My nie.</p>
          </div>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${D.border}` }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: D.surf }}>
              <div style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Funkcja</div>
              {[
                { name: 'CVPro.pl', highlight: true },
                { name: 'InterviewMe', highlight: false },
                { name: 'CV Maker', highlight: false },
              ].map(({ name, highlight }) => (
                <div key={name} style={{ padding: '14px 20px', textAlign: 'center', fontSize: 13, fontWeight: 800, color: highlight ? D.primary : D.muted }}>
                  {name}
                  {highlight && <div style={{ fontSize: 10, color: '#3db36a', fontWeight: 600, marginTop: 2 }}>← TY TUTAJ</div>}
                </div>
              ))}
            </div>

            {/* Rows */}
            {[
              { feature: 'Jednorazowa płatność (nie abonament)', cvpro: '✓', im: '✗', cvm: '✗' },
              { feature: 'Płatność BLIK', cvpro: '✓', im: '✗', cvm: '✗' },
              { feature: 'Brak auto-odnowienia', cvpro: '✓', im: '✗', cvm: '✗' },
              { feature: 'Pełne CV po polsku', cvpro: '✓', im: '✓', cvm: '~' },
              { feature: 'Szablony', cvpro: '11', im: '20+', cvm: '20+' },
              { feature: 'Analiza ATS', cvpro: '✓ Pro', im: '✓', cvm: '✗' },
              { feature: 'Generator listu motywacyjnego', cvpro: '✓ Premium', im: '✓', cvm: '✗' },
              { feature: 'Cena miesięczna', cvpro: '0 – 39 zł raz', im: 'od ~200 zł/mies.', cvm: 'od ~250 zł/mies.' },
              { feature: 'Skargi do UOKiK / negatywne opinie', cvpro: '✗ brak', im: '⚠ tak', cvm: '⚠ tak' },
            ].map(({ feature, cvpro, im, cvm }, i) => (
              <div
                key={feature}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: i % 2 === 0 ? D.card : 'rgba(22,45,80,0.5)', borderTop: `1px solid ${D.border}` }}
              >
                <div style={{ padding: '13px 20px', fontSize: 13, color: D.muted }}>{feature}</div>
                <div style={{ padding: '13px 20px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: cvpro.startsWith('✓') || cvpro === '✗ brak' ? '#3db36a' : D.text }}>{cvpro}</div>
                <div style={{ padding: '13px 20px', textAlign: 'center', fontSize: 13, color: im.startsWith('✗') || im.startsWith('⚠') ? '#e55' : D.muted }}>{im}</div>
                <div style={{ padding: '13px 20px', textAlign: 'center', fontSize: 13, color: cvm.startsWith('✗') || cvm.startsWith('⚠') ? '#e55' : D.muted }}>{cvm}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/auth/signup" style={{ background: `linear-gradient(135deg,${D.primary},#7055FF)`, color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 700, padding: '13px 32px', borderRadius: 12, boxShadow: '0 4px 22px rgba(68,119,255,0.38)', display: 'inline-block' }}>
              Wypróbuj CVPro.pl za darmo →
            </Link>
            <div style={{ marginTop: 12, fontSize: 12, color: D.dim }}>Bez karty kredytowej. Bez pułapek. Płacisz tylko za PDF.</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 5%', maxWidth: 1020, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8ab4ff', letterSpacing: '0.1em', marginBottom: 12 }}>OPINIE UŻYTKOWNIKÓW</div>
          <h2 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>Co mówią nasi użytkownicy?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            {
              name: 'Karolina W.', role: 'Specjalista ds. HR, Kraków',
              text: 'Znalazłam pracę w 2 tygodnie od wysłania pierwszego CV z CVPro.pl. Szablon był profesjonalny i przeszedł przez ATS bez problemów.',
            },
            {
              name: 'Michał K.', role: 'Junior Developer, Warszawa',
              text: 'Miałem strach przed pisaniem CV po polsku — tutaj formularz prowadzi Cię krok po kroku. Cena jednorazowa to strzał w dziesiątkę.',
            },
            {
              name: 'Agnieszka R.', role: 'Zmiana branży: finanse → marketing',
              text: 'Opcja "Zmiana branży" dosłownie opisała moją sytuację. CV wyglądało tak profesjonalnie, że rekruterka zapytała, kto mi je robiło.',
            },
          ].map(({ name, role, text }) => (
            <div key={name} style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ color: D.primary, fontSize: 18, letterSpacing: 2, marginBottom: 16 }}>★★★★★</div>
              <p style={{ fontSize: 14, color: D.muted, lineHeight: 1.75, margin: '0 0 20px', fontStyle: 'italic' }}>&ldquo;{text}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg,${D.primary},#7055FF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: D.text }}>{name}</div>
                  <div style={{ fontSize: 11, color: D.dim }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="cennik" style={{ padding: '80px 5%', background: 'rgba(9,18,36,0.6)', borderTop: `1px solid ${D.border}` }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 12px' }}>Cennik</h2>
            <p style={{ color: D.muted, fontSize: 15, margin: 0 }}>Jednorazowa płatność. Bez subskrypcji. Bez niespodzianek.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {PLANS.map(({ name, price, features, popular, priceId, cta }) => (
              <div
                key={name}
                style={{
                  padding: 28, borderRadius: 18, position: 'relative',
                  background: popular ? 'linear-gradient(160deg,rgba(68,119,255,0.08),rgba(112,85,255,0.07))' : D.card,
                  border: `${popular ? 2 : 1}px solid ${popular ? 'rgba(68,119,255,0.45)' : D.border}`,
                  transform: popular ? 'scale(1.035)' : 'none',
                  boxShadow: popular ? '0 10px 50px rgba(68,119,255,0.14)' : 'none',
                }}
              >
                {popular && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#4477FF,#7055FF)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 10, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    Najpopularniejszy
                  </div>
                )}
                <div style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 22 }}>
                  <span style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 44, fontWeight: 900, letterSpacing: '-0.05em', color: popular ? D.primary : D.text }}>{price}</span>
                  <span style={{ color: D.muted, fontSize: 16 }}>zł</span>
                </div>
                <div style={{ borderTop: `1px solid ${D.border}`, paddingTop: 18, marginBottom: 22 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 9, fontSize: 13, color: D.muted }}>
                      <span style={{ color: D.ok, flexShrink: 0 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <Link
                  href={`/auth/signup?plan=${priceId}`}
                  style={{
                    display: 'block', textAlign: 'center', padding: '11px', borderRadius: 10,
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    background: popular ? 'linear-gradient(135deg,#4477FF,#7055FF)' : 'rgba(12,28,52,0.9)',
                    color: popular ? '#fff' : D.muted,
                    border: `1px solid ${popular ? 'transparent' : D.border}`,
                    boxShadow: popular ? '0 4px 18px rgba(68,119,255,0.38)' : 'none',
                  }}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: 13, color: D.dim }}>
            <span>✅ Płatność jednorazowa — bez abonamentu</span>
            <span>🔒 Bezpieczne płatności (Stripe)</span>
            <span>🇵🇱 Dane zgodne z RODO</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '80px 5%', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 12px' }}>Częste pytania</h2>
          <p style={{ color: D.muted, fontSize: 15, margin: 0 }}>Wszystko, co musisz wiedzieć przed startem</p>
        </div>
        {FAQS.map(({ q, a }) => (
          <details key={q} style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
            <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 15, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
              {q}
              <span style={{ color: D.primary, fontSize: 18, flexShrink: 0, marginLeft: 12 }}>+</span>
            </summary>
            <div style={{ padding: '0 20px 18px', fontSize: 14, color: D.muted, lineHeight: 1.7 }}>{a}</div>
          </details>
        ))}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${D.border}`, padding: '32px 5%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-onest), sans-serif', fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 14 }}>
          <span style={{ color: D.primary }}>CV</span>
          <span style={{ color: D.text }}>Pro</span>
          <span style={{ color: D.muted, fontSize: 13, fontWeight: 500 }}>.pl</span>
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', fontSize: 12, color: D.dim, flexWrap: 'wrap', marginBottom: 14 }}>
          <Link href="/wzory-cv" style={{ color: 'inherit', textDecoration: 'none' }}>Wzory CV</Link>
          <Link href="/polityka-prywatnosci" style={{ color: 'inherit', textDecoration: 'none' }}>Polityka prywatności</Link>
          <Link href="/regulamin" style={{ color: 'inherit', textDecoration: 'none' }}>Regulamin</Link>
          <Link href="/polityka-prywatnosci" style={{ color: 'inherit', textDecoration: 'none' }}>RODO</Link>
          <Link href="/kontakt" style={{ color: 'inherit', textDecoration: 'none' }}>Kontakt</Link>
        </div>
        <div style={{ fontSize: 11, color: D.dim }}>© {new Date().getFullYear()} CVPro.pl · Wszelkie prawa zastrzeżone</div>
      </footer>
      </main>
    </div>
  )
}
