import Link from 'next/link'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export const metadata: Metadata = {
  title: 'Polityka prywatności',
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
        <p style={{ color: '#7a94bb', marginBottom: 32 }}>Ostatnia aktualizacja: 2026-10-29</p>
        <div style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: 28, lineHeight: 1.8, color: '#c2d6f0', fontSize: 14 }}>

          <h2 style={S.h2}>1. Administrator danych</h2>
          <p style={S.p}>Administratorem danych osobowych jest CVPro.pl. Kontakt w sprawach ochrony danych: <a href="mailto:kontakt@cvpro.pl" style={S.a}>kontakt@cvpro.pl</a></p>

          <h2 style={S.h2}>2. Zakres przetwarzanych danych</h2>
          <p style={S.p}>Przetwarzamy: (a) dane podane podczas rejestracji — adres e-mail; (b) dane wprowadzone do formularza CV — imię, nazwisko, doświadczenie zawodowe, wykształcenie, umiejętności i inne informacje podane dobrowolnie przez Użytkownika, w tym dane z pliku CV, który Użytkownik sam wczyta do formularza (plik jest przetwarzany tymczasowo i nie jest zapisywany w Serwisie); (c) dane techniczne — adres IP, informacje o sesji, logi dostępu; (d) wyłącznie po wyrażeniu zgody w banerze plików cookie — dane o korzystaniu z Serwisu zbierane przez narzędzie Microsoft Clarity: odwiedzane podstrony, kliknięcia, ruchy myszy i przewijanie (mapy kliknięć, nagrania sesji), informacje o urządzeniu, przeglądarce i systemie oraz kraj wyznaczony na podstawie adresu IP. Treść formularza i podglądu CV oraz pola kreatora są maskowane, więc wpisywane w nich dane nie trafiają do nagrań.</p>

          <h2 style={S.h2}>3. Podstawa prawna przetwarzania (art. 6 RODO)</h2>
          <p style={S.p}>Dane przetwarzamy na podstawie:</p>
          <p style={S.p}>a) art. 6 ust. 1 lit. b RODO — wykonanie umowy o świadczenie usług drogą elektroniczną (obsługa konta, generowanie CV);</p>
          <p style={S.p}>b) art. 6 ust. 1 lit. c RODO — wypełnienie obowiązków prawnych (wystawianie faktur VAT, obowiązki podatkowe);</p>
          <p style={S.p}>c) art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes Administratora (bezpieczeństwo systemu, zapobieganie nadużyciom);</p>
          <p style={S.p}>d) art. 6 ust. 1 lit. a RODO oraz art. 173 ustawy Prawo telekomunikacyjne — zgoda Użytkownika wyrażona w banerze plików cookie (analityka Microsoft Clarity i pomiar skuteczności reklam). Zgodę możesz wycofać w dowolnym momencie, co nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej wycofaniem.</p>

          <h2 style={S.h2}>4. Cel przetwarzania</h2>
          <p style={S.p}>Dane służą wyłącznie do: świadczenia usługi generowania CV (w tym wczytania danych ze starego CV wskazanego przez Użytkownika), obsługi płatności, wystawiania faktur VAT, komunikacji z Użytkownikiem oraz zapewnienia bezpieczeństwa Serwisu. Za zgodą Użytkownika dane służą także do analizy sposobu korzystania z Serwisu (mapy kliknięć i nagrania sesji w narzędziu Microsoft Clarity) w celu ulepszania jego działania oraz do pomiaru skuteczności reklam.</p>

          <h2 style={S.h2}>5. Podprzetwarzający — przekazywanie danych</h2>
          <p style={S.p}>Dane mogą być przekazywane wyłącznie następującym podmiotom przetwarzającym, z którymi zawarliśmy umowy powierzenia przetwarzania danych (Data Processing Agreement):</p>
          <p style={S.p}>• <strong>Supabase Inc.</strong> — hosting bazy danych i uwierzytelnianie użytkowników (serwery w regionie EU);</p>
          <p style={S.p}>• <strong>Stripe Inc.</strong> — obsługa płatności elektronicznych;</p>
          <p style={S.p}>• <strong>Anthropic, PBC</strong> (USA) — odczytanie i uporządkowanie danych z pliku CV wczytywanego przez Użytkownika oraz realizacja funkcji Serwisu, w których analizowana jest treść CV (podpowiedzi do opisów i umiejętności, analiza ATS, listy motywacyjne). Przekazanie danych do USA odbywa się z zastosowaniem odpowiednich zabezpieczeń przewidzianych w RODO.</p>
          <p style={S.p}>Wyłącznie po wyrażeniu zgody w banerze plików cookie dane analityczne trafiają także do: <strong>Microsoft Ireland Operations Limited</strong> (Microsoft Clarity — analityka, mapy kliknięć i nagrania sesji) oraz <strong>Google Ireland Limited</strong> (Google Ads — pomiar skuteczności reklam). Microsoft przetwarza dane w usłudze Microsoft Azure i działa jako administrator danych zbieranych przez Clarity; może je przekazywać do Microsoft Corporation w USA na podstawie standardowych klauzul umownych. Szczegóły: <a href="https://www.microsoft.com/privacy/privacystatement" style={S.a} target="_blank" rel="noopener noreferrer">Oświadczenie o ochronie prywatności Microsoft</a>.</p>
          <p style={S.p}>Nie udostępniamy danych innym podmiotom trzecim ani nie wykorzystujemy ich w celach marketingowych bez zgody Użytkownika.</p>

          <h2 style={S.h2}>6. Okres przechowywania danych</h2>
          <p style={S.p}>• Dane konta: przez czas trwania umowy oraz 12 miesięcy po jej rozwiązaniu (na potrzeby ewentualnych reklamacji);</p>
          <p style={S.p}>• Dane płatności: przez 5 lat od daty transakcji (wymogi przepisów podatkowych);</p>
          <p style={S.p}>• Dane CV: do momentu usunięcia przez Użytkownika lub usunięcia konta;</p>
          <p style={S.p}>• Plik wczytywany w celu uzupełnienia formularza: nie jest zapisywany w Serwisie — jego treść jest przetwarzana tymczasowo, a wczytane dane trafiają do formularza CV i podlegają zasadom przechowywania danych CV;</p>
          <p style={S.p}>• Dane z Microsoft Clarity (tylko po zgodzie): nagrania sesji — 30 dni od nagrania, a wybrane nagrania oraz mapy kliknięć — do 9 miesięcy, zgodnie z okresami określonymi przez Microsoft.</p>

          <h2 style={S.h2}>7. Prawa Użytkownika</h2>
          <p style={S.p}>Przysługuje Ci prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 21 RODO). Aby skorzystać z tych praw, napisz na: <a href="mailto:kontakt@cvpro.pl" style={S.a}>kontakt@cvpro.pl</a> z tytułem „Wniosek RODO". Odpowiemy w ciągu 30 dni.</p>
          <p style={S.p}>Masz również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO, <a href="https://uodo.gov.pl" style={S.a} target="_blank" rel="noopener noreferrer">uodo.gov.pl</a>).</p>

          <h2 style={S.h2}>8. Bezpieczeństwo danych</h2>
          <p style={S.p}>Stosujemy następujące środki ochrony: szyfrowanie transmisji danych (TLS 1.3), szyfrowanie danych w spoczynku (AES-256), uwierzytelnianie dwuskładnikowe na poziomie infrastruktury, regularne kopie zapasowe oraz monitoring bezpieczeństwa.</p>

          <h2 style={S.h2}>9. Naruszenie ochrony danych</h2>
          <p style={S.p}>W przypadku wykrycia naruszenia ochrony danych osobowych poinformujemy Użytkownika bez zbędnej zwłoki, nie później niż w ciągu 72 godzin od stwierdzenia naruszenia, jeśli może ono powodować wysokie ryzyko dla jego praw i wolności.</p>

          <h2 style={S.h2}>10. Pliki cookie</h2>
          <p style={S.p}>Niezbędne pliki cookie służą do utrzymania sesji zalogowanego Użytkownika, a Twój wybór w banerze zapamiętujemy w pamięci przeglądarki; nie wymagają one zgody.</p>
          <p style={S.p}>Opcjonalne pliki cookie ustawiamy wyłącznie po wyrażeniu zgody w banerze:</p>
          <p style={S.p}>• <strong>Microsoft Clarity</strong> (analityka, mapy kliknięć, nagrania sesji) — pliki własne <strong>_clck</strong> i <strong>_clsk</strong> oraz pliki podmiotu trzeciego (Microsoft) <strong>CLID</strong>, <strong>ANONCHK</strong>, <strong>MR</strong>, <strong>MUID</strong> i <strong>SM</strong>. Okresy ważności określa Microsoft w <a href="https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies" style={S.a} target="_blank" rel="noopener noreferrer">dokumentacji plików cookie Clarity</a>;</p>
          <p style={S.p}>• <strong>Google Ads</strong> — pomiar skuteczności reklam.</p>
          <p style={S.p}>Do czasu dokonania wyboru oraz po odrzuceniu zgody nie ustawiamy opcjonalnych plików cookie. Clarity działa wówczas w ograniczonym trybie bez plików cookie: każde wyświetlenie strony jest liczone osobno, bez łączenia wizyt w jedną sesję.</p>
          <p style={S.p}>Zgodę możesz wycofać w dowolnym momencie, usuwając dane tej strony (pliki cookie i pamięć lokalną) w ustawieniach przeglądarki — przy następnej wizycie baner pojawi się ponownie.</p>

          <h2 style={S.h2}>11. Zautomatyzowane podejmowanie decyzji</h2>
          <p style={S.p}>Nie stosujemy zautomatyzowanego podejmowania decyzji ani profilowania w rozumieniu art. 22 RODO, które wywoływałoby istotne skutki prawne dla Użytkownika.</p>

          <h2 style={S.h2}>12. Zmiany polityki prywatności</h2>
          <p style={S.p}>O istotnych zmianach niniejszej polityki Użytkownicy zostaną poinformowani drogą e-mail z co najmniej 14-dniowym wyprzedzeniem.</p>

        </div>
      </div>
    </div>
  )
}
