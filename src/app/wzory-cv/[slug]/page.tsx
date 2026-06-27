import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWzor, WZORY } from '@/lib/wzory-cv'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const wzor = getWzor(slug)
  if (!wzor) return {}
  const url = `${BASE}/wzory-cv/${slug}`
  return {
    title: `${wzor.titleGen} — CVPro.pl`,
    description: wzor.intro,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: wzor.titleGen,
      description: wzor.intro,
      locale: 'pl_PL',
      siteName: 'CVPro.pl',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: wzor.titleGen,
      description: wzor.intro,
    },
  }
}

export function generateStaticParams() {
  return WZORY.map(w => ({ slug: w.slug }))
}

export default async function WzorSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const wzor = getWzor(slug)
  if (!wzor) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a3060', padding: '0 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none' }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <Link href="/wzory-cv" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Wzory CV</Link>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{wzor.icon}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px', letterSpacing: -0.5 }}>{wzor.titleGen}</h1>
          <p style={{ color: '#9ab4d8', fontSize: 16, lineHeight: 1.7, maxWidth: 620, margin: 0 }}>{wzor.intro}</p>
        </div>

        {/* Co powinno zawierać */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#e2eeff' }}>Co powinno zawierać?</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {wzor.shouldContain.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#4477ff', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Przykład CV */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#e2eeff' }}>Przykład CV</h2>
          <div style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: '28px 32px' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>{wzor.example.name}</div>
              <div style={{ color: '#4477ff', fontWeight: 600, fontSize: 15 }}>{wzor.example.position}</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#4a6a99', marginBottom: 8 }}>Podsumowanie</div>
              <p style={{ color: '#9ab4d8', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{wzor.example.summary}</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#4a6a99', marginBottom: 12 }}>Doświadczenie</div>
              {wzor.example.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{exp.position}</span>
                      <span style={{ color: '#7a94bb', fontSize: 14 }}> · {exp.company}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#4a6a99', flexShrink: 0, marginLeft: 12 }}>{exp.dates}</span>
                  </div>
                  <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ color: '#9ab4d8', fontSize: 13, lineHeight: 1.6, marginBottom: 2 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#4a6a99', marginBottom: 10 }}>Umiejętności</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {wzor.example.skills.map((s, i) => (
                  <span key={i} style={{ background: '#4477ff18', border: '1px solid #4477ff33', color: '#7aafff', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Wskazówki */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#e2eeff' }}>Wskazówki</h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, counterReset: 'tips' }}>
            {wzor.tips.map((tip, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ background: '#4477ff22', color: '#4477ff', fontWeight: 800, fontSize: 13, minWidth: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.55, paddingTop: 3 }}>{tip}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#e2eeff' }}>Często zadawane pytania</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {wzor.faqs.map((faq, i) => (
              <details
                key={i}
                style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 10, overflow: 'hidden' }}
              >
                <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', userSelect: 'none' }}>
                  {faq.q}
                  <span style={{ color: '#4477ff', fontSize: 18, flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <div style={{ padding: '0 20px 16px', color: '#9ab4d8', fontSize: 14, lineHeight: 1.65 }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: '#4477ff12', border: '1px solid #4477ff30', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Stwórz swoje {wzor.titleGen}</h3>
          <p style={{ color: '#9ab4d8', fontSize: 14, margin: '0 0 24px' }}>Użyj tego wzoru jako punktu startowego i dostosuj CV do swoich potrzeb.</p>
          <Link
            href="/dashboard/cv/new"
            style={{ background: '#4477ff', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 10, display: 'inline-block' }}
          >
            Stwórz CV →
          </Link>
        </div>
      </main>
    </div>
  )
}
