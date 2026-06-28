import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticle, ARTICLES } from '@/lib/poradnik'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  const url = `${BASE}/poradnik/${slug}`
  return {
    title: article.metaTitle,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.metaTitle,
      description: article.description,
      locale: 'pl_PL',
      siteName: 'CVPro.pl',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: article.metaTitle, description: article.description },
  }
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a3060', padding: '0 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: '#e2eeff', textDecoration: 'none' }}>
            <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 13 }}>.pl</span>
          </Link>
          <Link href="/poradnik" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 14 }}>← Poradnik</Link>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Hero */}
        <article>
          <div style={{ fontSize: 44, marginBottom: 14 }}>{article.icon}</div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{article.title}</h1>
          <div style={{ color: '#4a6a99', fontSize: 13, marginBottom: 28 }}>Czas czytania: {article.readingTime}</div>
          <p style={{ color: '#9ab4d8', fontSize: 17, lineHeight: 1.7, margin: '0 0 40px' }}>{article.description}</p>

          {/* Sections */}
          {article.sections.map((sec, i) => (
            <section key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>{sec.heading}</h2>
              {sec.body.map((p, j) => (
                <p key={j} style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.75, margin: '0 0 14px' }}>{p}</p>
              ))}
              {sec.bullets && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {sec.bullets.map((b, k) => (
                    <li key={k} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: '#4477ff', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ color: '#9ab4d8', fontSize: 15, lineHeight: 1.55 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {/* FAQ */}
        <section style={{ margin: '8px 0 44px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px' }}>Często zadawane pytania</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {article.faqs.map((faq, i) => (
              <details key={i} style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 10, overflow: 'hidden' }}>
                <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', userSelect: 'none' }}>
                  {faq.q}
                  <span style={{ color: '#4477ff', fontSize: 18, flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <div style={{ padding: '0 20px 16px', color: '#9ab4d8', fontSize: 14, lineHeight: 1.65 }}>{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', color: '#7a94bb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Zobacz też</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {article.related.map((r, i) => (
              <Link key={i} href={r.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 10, padding: '14px 18px', textDecoration: 'none', color: '#e2eeff', fontSize: 15, fontWeight: 600 }}>
                {r.label}
                <span style={{ color: '#4477ff', flexShrink: 0, marginLeft: 12 }}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: '#4477ff12', border: '1px solid #4477ff30', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Stwórz profesjonalne CV w kilka minut</h2>
          <p style={{ color: '#9ab4d8', fontSize: 14, margin: '0 0 24px' }}>16 szablonów, analiza ATS, jednorazowa płatność od 15 zł — bez subskrypcji.</p>
          <Link href="/auth/signup" style={{ background: '#4477ff', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '13px 32px', borderRadius: 10, display: 'inline-block' }}>
            Stwórz CV →
          </Link>
        </div>
      </main>
    </div>
  )
}
