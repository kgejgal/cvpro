import Link from 'next/link'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export const metadata: Metadata = {
  title: 'Polityka prywatności — CVPro.pl',
  description: 'Polityka prywatności i ochrony danych osobowych serwisu CVPro.pl zgodna z RODO.',
  alternates: { canonical: `${BASE}/polityka-prywatnosci` },
}

const S = {
  h2: { fontSize: 17, fontWeight: 700, color: '#e2eeff', margin: '28px 0 8px' } as React.CSSProperties,
  p: { margin: '0 0 12px', lineHeight: 1.8 } as React.CSSProperties,
  a: { color: '#4477ff' } as React.CSSProperties,
}

export default function PolitykaPrywatnosci() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif', padding: '60px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#4477ff', textDecoration: 'none', fontSize: 13, display: 'inline-block', marginBottom: 32 }}>← Strona główna</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Polityka prywatności</h1>
        <p style={{ color: '#7a94bb', marginBottom: 32 }}>Ostatnia aktualizacja: 2026-06-28</p>
        <div style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: 28, lineHeight: 1.8, color: '#c2d6f0', fontSize: 14 }}>

          <h2 style={S.h2}>1. Administrator danych</h2>
          <p style={S.p}>Administratorem danych osobowych jest CVPro.pl. Kontakt w sprawach ochrony danych: <a href="mailto:kontakt@cvpro.pl" style={S.a}>kontakt@cvpro.pl</a></p>

          <h2 style={S.h2}>2. Zakres przetwarzanych danych</h2>
          <p style={S.p}>Przetwarzamy: (a) dane podane podczas rejestracji — adres e-mail; (b) dane wprowadzone do formularza CV — imię, nazwisko, doświadczenie zawodowe, wykształcenie, umiejętności i inne informacje podane dobrowolnie przez Użytkownika; (c) dane techniczne — adres IP, informacje o sesji, logi dostępu.</p>

          <h2 style={S.h2}>3. Podstawa prawna przetwarzania (art. 6 RODO)</h2>
          <p style={S.p}>Dane przetwarzamy na podstawie:</p>
          <p style={S.p}>a) art. 6 ust. 1 lit. b RODO — wykonanie umowy o świadczenie usług drogą elektroniczną (obsługa konta, generowanie CV);</p>
          <p style={S.p}>b) art. 6 ust. 1 lit. c RODO — wypełnienie obowiązków prawnych (wystawianie faktur VAT, obowiązki podatkowe);</p>
          <p style={S.p}>c) art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes Administratora (bezpieczeństwo systemu, zapobieganie nadużyciom).</p>

          <h2 style={S.h2}>4. Cel przetwarzania</h2>
          <p style={S.p}>Dane służą wyłącznie do: świadczenia usługi generowania CV, obsługi płatności, wystawiania faktur VAT, komunikacji z Użytkownikiem oraz zapewnienia bezpieczeństwa Serwisu.</p>

          <h2 style={S.h2}>5. Podprzetwarzający — przekazywanie danych</h2>
          <p style={S.p}>Dane mogą być przekazywane wyłącznie następującym podmiotom przetwarzającym, z którymi zawarliśmy umowy powierzenia przetwarzania danych (Data Processing Agreement):</p>
          <p style={S.p}>• <strong>Supabase Inc.</strong> — hosting bazy danych i uwierzytelnianie użytkowników (serwery w regionie EU);</p>
          <p style={S.p}>• <strong>Stripe Inc.</strong> — obsługa płatności elektronicznych.</p>
          <p style={S.p}>Nie udostępniamy danych innym podmiotom trzecim ani nie wykorzystujemy ich w celach marketingowych bez zgody Użytkownika.</p>

          <h2 style={S.h2}>6. Okres przechowywania danych</h2>
          <p style={S.p}>• Dane konta: przez czas trwania umowy oraz 12 miesięcy po jej rozwiązaniu (na potrzeby ewentualnych reklamacji);</p>
          <p style={S.p}>• Dane płatności: przez 5 lat od daty transakcji (wymogi przepisów podatkowych);</p>
          <p style={S.p}>• Dane CV: do momentu usunięcia przez Użytkownika lub usunięcia konta.</p>

          <h2 style={S.h2}>7. Prawa Użytkownika</h2>
          <p style={S.p}>Przysługuje Ci prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 21 RODO). Aby skorzystać z tych praw, napisz na: <a href="mailto:kontakt@cvpro.pl" style={S.a}>kontakt@cvpro.pl</a> z tytułem „Wniosek RODO". Odpowiemy w ciągu 30 dni.</p>
          <p style={S.p}>Masz również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO, <a href="https://uodo.gov.pl" style={S.a} target="_blank" rel="noopener noreferrer">uodo.gov.pl</a>).</p>

          <h2 style={S.h2}>8. Bezpieczeństwo danych</h2>
          <p style={S.p}>Stosujemy następujące środki ochrony: szyfrowanie transmisji danych (TLS 1.3), szyfrowanie danych w spoczynku (AES-256), uwierzytelnianie dwuskładnikowe na poziomie infrastruktury, regularne kopie zapasowe oraz monitoring bezpieczeństwa.</p>

          <h2 style={S.h2}>9. Naruszenie ochrony danych</h2>
          <p style={S.p}>W przypadku wykrycia naruszenia ochrony danych osobowych poinformujemy Użytkownika bez zbędnej zwłoki, nie później niż w ciągu 72 godzin od stwierdzenia naruszenia, jeśli może ono powodować wysokie ryzyko dla jego praw i wolności.</p>

          <h2 style={S.h2}>10. Pliki cookie</h2>
          <p style={S.p}>Używamy plików cookie wyłącznie do utrzymania sesji zalogowanego Użytkownika (cookie techniczne niezbędne). Nie stosujemy cookies reklamowych, śledzących ani analitycznych stron trzecich.</p>

          <h2 style={S.h2}>11. Zautomatyzowane podejmowanie decyzji</h2>
          <p style={S.p}>Nie stosujemy zautomatyzowanego podejmowania decyzji ani profilowania w rozumieniu art. 22 RODO, które wywoływałoby istotne skutki prawne dla Użytkownika.</p>

          <h2 style={S.h2}>12. Zmiany polityki prywatności</h2>
          <p style={S.p}>O istotnych zmianach niniejszej polityki Użytkownicy zostaną poinformowani drogą e-mail z co najmniej 14-dniowym wyprzedzeniem.</p>

        </div>
      </div>
    </div>
  )
}
