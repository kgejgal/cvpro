import Link from 'next/link'

export default function Regulamin() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif', padding: '60px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#4477ff', textDecoration: 'none', fontSize: 13, display: 'inline-block', marginBottom: 32 }}>← Strona główna</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Regulamin serwisu</h1>
        <p style={{ color: '#7a94bb', marginBottom: 32 }}>Ostatnia aktualizacja: 2025-01-01</p>
        <div style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: 28, lineHeight: 1.8, color: '#c2d6f0', fontSize: 14 }}>
          <h2>1. Postanowienia ogólne</h2>
          <p>Serwis CVPro.pl dostarcza narzędzie do tworzenia i pobierania profesjonalnych dokumentów CV. Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.</p>
          <h2>2. Rejestracja i konto</h2>
          <p>Korzystanie z edytora CV wymaga założenia darmowego konta. Użytkownik odpowiada za bezpieczeństwo swoich danych logowania.</p>
          <h2>3. Płatności</h2>
          <p>Płatności są jednorazowe i obsługiwane przez Stripe. Po zakupie użytkownik uzyskuje natychmiastowy dostęp do wybranego pakietu. Nie oferujemy subskrypcji.</p>
          <h2>4. Prawo do odstąpienia</h2>
          <p>Ze względu na cyfrowy charakter produktu, po pobraniu pliku PDF lub Word prawo do odstąpienia od umowy wygasa. W przypadku problemów technicznych prosimy o kontakt.</p>
          <h2>5. Własność intelektualna</h2>
          <p>Treści wpisane przez użytkownika do formularza CV pozostają własnością użytkownika. CVPro.pl nie rości sobie praw do tych treści.</p>
          <h2>6. Odpowiedzialność</h2>
          <p>CVPro.pl nie ponosi odpowiedzialności za decyzje rekrutacyjne pracodawców na podstawie CV wygenerowanych w serwisie.</p>
          <h2>7. Kontakt</h2>
          <p>Wszelkie pytania: <a href="mailto:kontakt@cvpro.pl" style={{ color: '#4477ff' }}>kontakt@cvpro.pl</a></p>
        </div>
      </div>
    </div>
  )
}
