import Link from 'next/link'

export default function PolitykaPrywatnosci() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif', padding: '60px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#4477ff', textDecoration: 'none', fontSize: 13, display: 'inline-block', marginBottom: 32 }}>← Strona główna</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Polityka prywatności</h1>
        <p style={{ color: '#7a94bb', marginBottom: 32 }}>Ostatnia aktualizacja: 2025-01-01</p>
        <div style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: 28, lineHeight: 1.8, color: '#c2d6f0', fontSize: 14 }}>
          <h2>1. Administrator danych</h2>
          <p>Administratorem danych osobowych jest CVPro.pl. Kontakt: <a href="mailto:kontakt@cvpro.pl" style={{ color: '#4477ff' }}>kontakt@cvpro.pl</a></p>
          <h2>2. Zakres przetwarzanych danych</h2>
          <p>Przetwarzamy dane podane podczas rejestracji (email) oraz dane wprowadzone do formularza CV (imię, nazwisko, doświadczenie zawodowe, itp.).</p>
          <h2>3. Cel przetwarzania</h2>
          <p>Dane służą wyłącznie do świadczenia usługi generowania CV. Nie udostępniamy danych osobowych osobom trzecim, z wyjątkiem podmiotów technicznych (Supabase — hosting danych, Stripe — płatności).</p>
          <h2>4. Prawa użytkownika</h2>
          <p>Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia oraz przenoszenia. Aby usunąć konto i dane, napisz na: kontakt@cvpro.pl</p>
          <h2>5. Bezpieczeństwo</h2>
          <p>Dane są szyfrowane i przechowywane zgodnie ze standardami RODO. Używamy bezpiecznych połączeń HTTPS oraz uwierzytelniania dwustopniowego na poziomie infrastruktury.</p>
          <h2>6. Pliki cookie</h2>
          <p>Używamy plików cookie wyłącznie do utrzymania sesji użytkownika (logowanie). Nie używamy cookies reklamowych ani śledzących.</p>
        </div>
      </div>
    </div>
  )
}
