export type Article = {
  slug: string
  icon: string
  title: string
  metaTitle: string
  description: string
  readingTime: string
  sections: { heading: string; body: string[]; bullets?: string[] }[]
  faqs: { q: string; a: string }[]
  related: { href: string; label: string }[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'ile-kosztuje-kreator-cv',
    icon: '💰',
    title: 'Ile naprawdę kosztuje kreator CV?',
    metaTitle: 'Ile kosztuje kreator CV? Ceny i ukryte opłaty (2026)',
    description: 'Sprawdź, ile realnie kosztuje stworzenie CV online — od darmowych narzędzi, przez pułapki subskrypcyjne, po uczciwą jednorazową płatność. Praktyczne porównanie modeli cenowych.',
    readingTime: '5 min',
    sections: [
      {
        heading: 'Trzy modele cenowe kreatorów CV',
        body: [
          'Kreatory CV w Polsce działają w jednym z trzech modeli: całkowicie darmowym, subskrypcyjnym oraz jednorazowej płatności. Każdy z nich oznacza coś innego dla Twojego portfela — i nie zawsze najtańsza cena na stronie głównej jest faktycznie najtańsza.',
          'Zanim wybierzesz narzędzie, warto rozumieć, za co naprawdę płacisz i czy po pobraniu gotowego CV nie czekają Cię kolejne, nieoczekiwane opłaty.',
        ],
      },
      {
        heading: 'Model darmowy — za co naprawdę płacisz?',
        body: [
          'Darmowe kreatory (np. proste generatory online czy szablony w narzędziach graficznych) pozwalają stworzyć CV bez opłat. Minusem bywa ograniczona liczba szablonów, znak wodny na dokumencie albo brak optymalizacji pod systemy ATS, których używają rekruterzy.',
          'Darmowe rozwiązanie jest dobre na szybko, ale jeśli zależy Ci na profesjonalnym wyglądzie i przejściu przez automatyczną selekcję, zwykle trzeba dopłacić za eksport bez znaku wodnego lub lepsze szablony.',
        ],
      },
      {
        heading: 'Model subskrypcyjny — gdzie kryje się pułapka',
        body: [
          'To najczęstsze źródło rozczarowań. Serwis reklamuje bardzo niską cenę startową — na przykład 5,95 zł za "14-dniowy dostęp" — ale w tle uruchamia automatycznie odnawianą subskrypcję. Po okresie próbnym z konta zaczyna znikać znacznie wyższa kwota, często 60–100 zł co miesiąc.',
          'Problem jest na tyle poważny, że w 2026 roku UOKiK nałożył na operatora jednego z największych polskich kreatorów CV karę ponad 760 000 zł — właśnie za niejasne informowanie o subskrypcji. Użytkownicy dowiadywali się o cyklicznych opłatach dopiero przy próbie pobrania gotowego dokumentu.',
          'Jeśli wybierasz taki serwis, koniecznie sprawdź regulamin i pamiętaj o anulowaniu subskrypcji — inaczej "tanie" CV może kosztować kilkaset złotych w skali roku.',
        ],
      },
      {
        heading: 'Model jednorazowy — płacisz raz i koniec',
        body: [
          'W modelu jednorazowym płacisz jedną, jawną kwotę za dostęp do narzędzia i pobranie CV. Nie ma automatycznych odnowień ani ukrytych opłat. Cena jest widoczna od początku, więc dokładnie wiesz, ile wydasz.',
          'W CVPro.pl plany zaczynają się od 15 zł jednorazowo, a pełny pakiet z analizą ATS i listem motywacyjnym to 39 zł — również raz. To rozwiązanie dla osób, które chcą uniknąć ryzyka cyklicznych opłat i mieć sprawę zamkniętą.',
        ],
      },
      {
        heading: 'Co realnie się opłaca?',
        body: [
          'Jeśli potrzebujesz CV raz na jakiś czas (a tak jest w większości przypadków), jednorazowa płatność wychodzi najtaniej i najbezpieczniej. Subskrypcja opłaca się tylko wtedy, gdy faktycznie korzystasz z narzędzia stale — i pamiętasz, żeby ją anulować.',
          'Najważniejsza zasada: zanim klikniesz "zapłać", sprawdź, czy cena jest jednorazowa, czy cykliczna. Ta jedna informacja decyduje o tym, ile naprawdę zapłacisz.',
        ],
      },
    ],
    faqs: [
      { q: 'Czy darmowy kreator CV wystarczy?', a: 'Na szybkie, proste CV — tak. Jeśli jednak zależy Ci na profesjonalnym szablonie bez znaku wodnego i optymalizacji pod ATS, zwykle trzeba dopłacić. Wtedy jednorazowa płatność jest najbezpieczniejsza.' },
      { q: 'Dlaczego niektóre kreatory CV są tak tanie na początku?', a: 'Niska cena startowa (np. 5,95 zł) to często okres próbny subskrypcji, która automatycznie odnawia się po kilku dniach na znacznie wyższą kwotę. Zawsze sprawdzaj, czy płatność jest jednorazowa.' },
      { q: 'Ile kosztuje CV w CVPro.pl?', a: 'Plany zaczynają się od 15 zł jednorazowo. Pełny pakiet z analizą ATS i listem motywacyjnym to 39 zł — bez subskrypcji i ukrytych opłat.' },
    ],
    related: [
      { href: '/kreator-cv-bez-subskrypcji', label: 'Kreator CV bez subskrypcji' },
      { href: '/cennik', label: 'Zobacz cennik CVPro.pl' },
      { href: '/poradnik/jak-napisac-cv', label: 'Jak napisać CV krok po kroku' },
    ],
  },
  {
    slug: 'jak-napisac-cv',
    icon: '📝',
    title: 'Jak napisać CV w 2026 — krok po kroku',
    metaTitle: 'Jak napisać CV w 2026 — praktyczny poradnik krok po kroku',
    description: 'Kompletny przewodnik, jak napisać skuteczne CV w 2026 roku: dane kontaktowe, podsumowanie zawodowe, doświadczenie z efektami, umiejętności, klauzula RODO i najczęstsze błędy.',
    readingTime: '7 min',
    sections: [
      {
        heading: 'Zacznij od struktury',
        body: [
          'Dobre CV to nie sztuka literacka, tylko czytelny dokument, który w kilka sekund pokazuje rekruterowi, że pasujesz do stanowiska. Trzymaj się sprawdzonej kolejności sekcji i jednej strony (maksymalnie dwóch przy bogatym doświadczeniu).',
        ],
        bullets: [
          'Dane kontaktowe',
          'Podsumowanie zawodowe (2–3 zdania)',
          'Doświadczenie zawodowe',
          'Umiejętności',
          'Wykształcenie',
          'Klauzula RODO',
        ],
      },
      {
        heading: 'Dane kontaktowe — bez zbędnych informacji',
        body: [
          'Podaj imię i nazwisko, numer telefonu, profesjonalny adres e-mail oraz miasto. W wielu branżach warto dodać link do LinkedIn lub portfolio. Nie podawaj adresu zamieszkania co do ulicy, stanu cywilnego ani daty urodzenia — to dane zbędne i nieaktualne standardy.',
        ],
      },
      {
        heading: 'Podsumowanie zawodowe — Twój nagłówek',
        body: [
          'To 2–3 zdania na górze CV, które streszczają, kim jesteś zawodowo i co wnosisz. Dopasuj je do konkretnej oferty: wymień stanowisko, lata doświadczenia i najmocniejszy atut. To pierwsza rzecz, którą czyta rekruter, więc niech będzie konkretna, nie ogólnikowa.',
        ],
      },
      {
        heading: 'Doświadczenie — pokazuj efekty, nie obowiązki',
        body: [
          'Najczęstszy błąd to lista obowiązków ("odpowiedzialny za..."). Zamiast tego opisuj osiągnięcia i ich efekt, najlepiej liczbami. Porównaj: "obsługa klientów" kontra "obsłużyłem ponad 40 klientów dziennie, utrzymując 95% pozytywnych ocen".',
          'Każde stanowisko opisz w 3–5 punktach zaczynających się od czasownika: zwiększyłem, wdrożyłem, skróciłem, zarządzałem. Zaczynaj od najnowszego doświadczenia.',
        ],
      },
      {
        heading: 'Umiejętności i wykształcenie',
        body: [
          'W sekcji umiejętności wymień te realnie istotne dla stanowiska — narzędzia, programy, języki obce z poziomem. Unikaj wrzucania wszystkiego; lepiej kilka mocnych, dopasowanych kompetencji niż długa, przypadkowa lista.',
          'Wykształcenie podaj zwięźle: kierunek, uczelnia, lata. Przy dłuższym stażu zawodowym ta sekcja może być krótka — liczy się doświadczenie.',
        ],
      },
      {
        heading: 'Klauzula RODO i format pliku',
        body: [
          'W Polsce CV powinno zawierać aktualną klauzulę o przetwarzaniu danych osobowych (RODO). Bez niej rekruter formalnie nie może przetwarzać Twojej aplikacji. Zapisuj i wysyłaj CV w formacie PDF — zachowuje układ i jest czytelny zarówno dla człowieka, jak i systemów ATS.',
        ],
      },
    ],
    faqs: [
      { q: 'Jak długie powinno być CV?', a: 'Najlepiej jedna strona. Dwie strony są dopuszczalne tylko przy wieloletnim, bogatym doświadczeniu — bez wypełniaczy.' },
      { q: 'Czy CV musi mieć zdjęcie?', a: 'Nie jest wymagane. W niektórych branżach (np. IT) bywa pomijane. Jeśli dodajesz zdjęcie, niech będzie profesjonalne.' },
      { q: 'Czy trzeba dopasowywać CV do każdej oferty?', a: 'Tak — to znacząco zwiększa szanse. Dopasuj podsumowanie i słowa kluczowe do treści ogłoszenia, zwłaszcza jeśli firma używa systemu ATS.' },
    ],
    related: [
      { href: '/poradnik/cv-pod-ats', label: 'Jak przejść przez system ATS' },
      { href: '/wzory-cv', label: 'Wzory CV dla różnych zawodów' },
      { href: '/kreator-cv-bez-subskrypcji', label: 'Stwórz CV bez subskrypcji' },
    ],
  },
  {
    slug: 'cv-pod-ats',
    icon: '🎯',
    title: 'Jak przejść przez system ATS',
    metaTitle: 'CV pod ATS — jak przejść przez system rekrutacyjny (2026)',
    description: 'Dowiedz się, czym jest system ATS i jak przygotować CV, które przejdzie automatyczną selekcję: słowa kluczowe, formatowanie, nazwy sekcji i format pliku.',
    readingTime: '6 min',
    sections: [
      {
        heading: 'Czym jest ATS i dlaczego ma znaczenie',
        body: [
          'ATS (Applicant Tracking System) to oprogramowanie, którego firmy używają do automatycznego zbierania i wstępnej selekcji CV. Zanim Twoje CV trafi do człowieka, często najpierw "czyta" je system — i jeśli nie potrafi go poprawnie odczytać, aplikacja może odpaść już na starcie.',
          'Dlatego CV musi być przyjazne nie tylko dla rekrutera, ale i dla maszyny. Dobra wiadomość: zasady są proste.',
        ],
      },
      {
        heading: 'Używaj słów kluczowych z ogłoszenia',
        body: [
          'ATS dopasowuje CV do oferty na podstawie słów kluczowych — nazw umiejętności, narzędzi i stanowisk. Przeczytaj ogłoszenie i użyj w CV dokładnie tych samych określeń (jeśli faktycznie je posiadasz). Jeśli firma szuka kogoś od "obsługi klienta" i "Excela", użyj tych właśnie słów, a nie synonimów.',
        ],
      },
      {
        heading: 'Stawiaj na proste formatowanie',
        body: [
          'Systemy ATS gubią się przy skomplikowanym układzie. Trzymaj się jednej, czytelnej kolumny tekstu, standardowych czcionek i wyraźnych nagłówków sekcji.',
        ],
        bullets: [
          'Unikaj tabel i wielokolumnowych układów — ATS może pomieszać kolejność',
          'Nie umieszczaj kluczowych informacji w grafikach ani ikonach — system ich nie odczyta',
          'Używaj standardowych nazw sekcji: "Doświadczenie", "Umiejętności", "Wykształcenie"',
          'Nie wstawiaj tekstu w nagłówku/stopce pliku — bywa pomijany',
        ],
      },
      {
        heading: 'Zapisz CV w odpowiednim formacie',
        body: [
          'Najbezpieczniejszy jest PDF wygenerowany z tekstu (nie skan i nie obraz). Zachowuje układ i jest poprawnie odczytywany przez większość nowoczesnych systemów ATS. Unikaj nietypowych formatów i plików graficznych.',
          'Jeśli nie masz pewności, czy Twoje CV jest dobrze sformatowane, skorzystaj z narzędzia, które analizuje dopasowanie do ATS i podpowiada poprawki.',
        ],
      },
    ],
    faqs: [
      { q: 'Skąd wiem, czy firma używa ATS?', a: 'Większe firmy i korporacje używają ATS niemal zawsze. Jeśli aplikujesz przez formularz online lub duży portal pracy, najprawdopodobniej Twoje CV przejdzie przez taki system.' },
      { q: 'Czy zdjęcie i grafiki psują CV pod ATS?', a: 'Mogą. ATS nie odczyta tekstu zawartego w grafice. Kluczowe informacje zawsze umieszczaj jako zwykły tekst, a nie w obrazku.' },
      { q: 'Jak sprawdzić dopasowanie CV do oferty?', a: 'CVPro.pl ma wbudowaną analizę ATS, która porównuje Twoje CV z treścią ogłoszenia i wskazuje brakujące słowa kluczowe oraz problemy z formatowaniem.' },
    ],
    related: [
      { href: '/poradnik/jak-napisac-cv', label: 'Jak napisać CV krok po kroku' },
      { href: '/wzory-cv', label: 'Wzory CV dla różnych zawodów' },
      { href: '/kreator-cv-bez-subskrypcji', label: 'Stwórz CV z analizą ATS' },
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}
