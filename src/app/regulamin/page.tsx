import Link from 'next/link'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export const metadata: Metadata = {
  title: 'Regulamin serwisu — CVPro.pl',
  description: 'Regulamin korzystania z serwisu CVPro.pl. Jednorazowe płatności, brak subskrypcji.',
  alternates: { canonical: `${BASE}/regulamin` },
}

const S = {
  h2: { fontSize: 17, fontWeight: 700, color: '#e2eeff', margin: '28px 0 8px' } as React.CSSProperties,
  p: { margin: '0 0 12px', lineHeight: 1.8 } as React.CSSProperties,
  a: { color: '#4477ff' } as React.CSSProperties,
}

export default function Regulamin() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', color: '#e2eeff', fontFamily: 'var(--font-onest), sans-serif', padding: '60px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#4477ff', textDecoration: 'none', fontSize: 13, display: 'inline-block', marginBottom: 32 }}>← Strona główna</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Regulamin serwisu</h1>
        <p style={{ color: '#7a94bb', marginBottom: 32 }}>Ostatnia aktualizacja: 2026-06-28</p>
        <div style={{ background: '#0f2040', border: '1px solid #1e3f75', borderRadius: 12, padding: 28, lineHeight: 1.8, color: '#c2d6f0', fontSize: 14 }}>

          <h2 style={S.h2}>1. Postanowienia ogólne</h2>
          <p style={S.p}>Serwis CVPro.pl (dalej: „Serwis") dostarcza narzędzie online do tworzenia, edytowania i pobierania profesjonalnych dokumentów CV. Operatorem Serwisu jest CVPro.pl. Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu.</p>

          <h2 style={S.h2}>2. Rejestracja i konto użytkownika</h2>
          <p style={S.p}>Korzystanie z edytora CV wymaga założenia bezpłatnego konta przy użyciu adresu e-mail. Użytkownik ponosi odpowiedzialność za bezpieczeństwo danych logowania oraz za działania podjęte z jego konta. Jedno konto jest przeznaczone dla jednej osoby fizycznej.</p>

          <h2 style={S.h2}>3. Płatności</h2>
          <p style={S.p}>Opłaty w Serwisie mają charakter jednorazowy i są realizowane za pośrednictwem systemu Stripe (karta płatnicza, BLIK, Przelewy24). Serwis nie oferuje subskrypcji cyklicznych. Po zaksięgowaniu płatności Użytkownik uzyskuje natychmiastowy dostęp do wykupionego pakietu bez ograniczeń czasowych.</p>

          <h2 style={S.h2}>4. Prawo do odstąpienia od umowy</h2>
          <p style={S.p}>Zgodnie z art. 38 pkt 13 ustawy o prawach konsumenta, prawo do odstąpienia od umowy wygasa z chwilą pobrania pliku cyfrowego (PDF lub Word), jeśli Użytkownik wyraził uprzednią zgodę na rozpoczęcie świadczenia przed upływem terminu do odstąpienia. Jeżeli plik nie został pobrany, Użytkownik może odstąpić od umowy w terminie 14 dni od daty zakupu, przesyłając informację na adres <a href="mailto:kontakt@cvpro.pl" style={S.a}>kontakt@cvpro.pl</a>. Zwrot zostanie zrealizowany w ciągu 14 dni tą samą metodą płatności.</p>

          <h2 style={S.h2}>5. Reklamacje</h2>
          <p style={S.p}>Reklamacje dotyczące działania Serwisu należy kierować na adres <a href="mailto:kontakt@cvpro.pl" style={S.a}>kontakt@cvpro.pl</a>. Serwis rozpatruje reklamacje w ciągu 14 dni roboczych od ich otrzymania i informuje Użytkownika o wyniku drogą e-mail.</p>

          <h2 style={S.h2}>6. Własność intelektualna</h2>
          <p style={S.p}>Treści wprowadzone przez Użytkownika do formularza CV (dane osobowe, doświadczenie, umiejętności) pozostają wyłączną własnością Użytkownika. CVPro.pl nie nabywa żadnych praw do tych treści. Szablony wizualne CV, kod Serwisu oraz materiały marketingowe są własnością CVPro.pl i podlegają ochronie prawa autorskiego.</p>

          <h2 style={S.h2}>7. Zakaz niedozwolonych działań</h2>
          <p style={S.p}>Zabronione jest: (a) korzystanie z Serwisu w sposób niezgodny z prawem lub naruszający prawa osób trzecich; (b) próby uzyskania nieautoryzowanego dostępu do systemów Serwisu; (c) rozsyłanie spamu lub złośliwego oprogramowania za pośrednictwem Serwisu; (d) wprowadzanie treści niezgodnych z prawem, obraźliwych lub naruszających prawa innych osób.</p>

          <h2 style={S.h2}>8. Ograniczenie odpowiedzialności</h2>
          <p style={S.p}>CVPro.pl nie ponosi odpowiedzialności za decyzje rekrutacyjne pracodawców podjęte na podstawie CV wygenerowanych w Serwisie, ani za przerwy w dostępie do Serwisu spowodowane siłą wyższą lub pracami konserwacyjnymi. Odpowiedzialność Serwisu jest ograniczona do wartości uiszczonej przez Użytkownika opłaty.</p>

          <h2 style={S.h2}>9. Dostępność i zmiany Serwisu</h2>
          <p style={S.p}>CVPro.pl dąży do zapewnienia ciągłości działania Serwisu, jednak nie gwarantuje dostępności przez 100% czasu. Serwis zastrzega prawo do modyfikacji funkcjonalności, szablonów oraz cennika z zachowaniem 14-dniowego okresu powiadomienia dla istniejących Użytkowników.</p>

          <h2 style={S.h2}>10. Zmiany Regulaminu</h2>
          <p style={S.p}>CVPro.pl może zmieniać niniejszy Regulamin. O istotnych zmianach Użytkownicy zostaną poinformowani drogą e-mail z co najmniej 14-dniowym wyprzedzeniem. Dalsze korzystanie z Serwisu po wejściu zmian w życie oznacza ich akceptację.</p>

          <h2 style={S.h2}>11. Prawo właściwe i jurysdykcja</h2>
          <p style={S.p}>Niniejszy Regulamin podlega prawu polskiemu. Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby CVPro.pl. Użytkownik będący konsumentem może skorzystać z pozasądowych metod rozwiązywania sporów (platforma ODR: <a href="https://ec.europa.eu/consumers/odr" style={S.a} target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>).</p>

          <h2 style={S.h2}>12. Kontakt</h2>
          <p style={S.p}>Wszelkie pytania i zgłoszenia: <a href="mailto:kontakt@cvpro.pl" style={S.a}>kontakt@cvpro.pl</a></p>

        </div>
      </div>
    </div>
  )
}
