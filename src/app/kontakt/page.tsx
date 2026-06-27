import Link from 'next/link'

export default function KontaktPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif', padding: '60px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#4477ff', textDecoration: 'none', fontSize: 13, display: 'inline-block', marginBottom: 32 }}>← Strona główna</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Kontakt</h1>
        <div style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: 28 }}>
          <p style={{ color: '#7a94bb', lineHeight: 1.7, marginBottom: 20 }}>Masz pytania? Napisz do nas.</p>
          <p style={{ margin: '0 0 12px' }}><strong>Email:</strong> <a href="mailto:kontakt@cvpro.pl" style={{ color: '#4477ff' }}>kontakt@cvpro.pl</a></p>
          <p style={{ margin: 0, color: '#7a94bb', fontSize: 13 }}>Odpowiadamy w ciągu 24 godzin roboczych.</p>
        </div>
      </div>
    </div>
  )
}
