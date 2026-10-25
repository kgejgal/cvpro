// lib/analytics.ts
// Bezpieczne wrappery na Microsoft Clarity. Działają tylko w przeglądarce
// i nie wywalają aplikacji, gdy Clarity jest niezaładowane (np. brak NEXT_PUBLIC_CLARITY_ID).

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "cv_started"
  | "cv_completed"
  | "paywall_viewed"
  | "checkout_started"
  | "purchase_success"
  // Kliknięcia w zablokowane funkcje (dotąd martwe kliknięcia) i błędy wejścia do serwisu.
  | "template_locked_click"
  | "docx_locked_click"
  | "ats_locked_click"
  | "signup_error"
  | "login_error";

// Stub window.clarity powstaje dopiero w <Script strategy="afterInteractive">
// z ClarityConsent, czyli po hydracji. Efekty stron odpalają się wcześniej, więc
// przy twardym odświeżeniu (np. powrót ze Stripe) wywołanie mogłoby przepaść.
// Dlatego krótko czekamy na stub zamiast od razu odrzucać zdarzenie.
const READY_POLL_MS = 250;
const READY_MAX_TRIES = 20;

type ClarityFn = NonNullable<Window["clarity"]>;
type Queued = { consent: boolean; run: (clarity: ClarityFn) => void };

// Clarity chce dostać sygnał zgody zanim zobaczy cokolwiek innego, więc zdarzenia
// i tagi czekają, aż poleci pierwsze consentv2 (z CookieConsent). Zgoda zawsze
// wyprzedza resztę kolejki, niezależnie od kolejności wywołań w efektach Reacta.
let queue: Queued[] = [];
let consentSent = false;
let timer: ReturnType<typeof setInterval> | undefined;
let tries = 0;

function flush() {
  const clarity = typeof window === "undefined" ? undefined : window.clarity;
  if (!clarity) return;

  const consents = queue.filter((q) => q.consent);
  if (consents.length) {
    consents.forEach((q) => q.run(clarity));
    queue = queue.filter((q) => !q.consent);
    consentSent = true;
  }
  if (consentSent) {
    queue.forEach((q) => q.run(clarity));
    queue = [];
  }
}

function enqueue(item: Queued) {
  if (typeof window === "undefined") return;
  queue.push(item);
  flush();
  if (!queue.length) return;

  tries = 0;
  if (timer) return;
  timer = setInterval(() => {
    flush();
    // Clarity się nie załadowało (brak ID) albo nikt nie wysłał zgody — rezygnujemy.
    if (!queue.length || ++tries >= READY_MAX_TRIES) {
      clearInterval(timer);
      timer = undefined;
      queue = [];
    }
  }, READY_POLL_MS);
}

// Consent API v2: learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
// Wywołuje CookieConsent — jeden wybór użytkownika dla Google (gtag) i Clarity.
export function setClarityConsent(granted: boolean) {
  const state = granted ? "granted" : "denied";
  enqueue({
    consent: true,
    run: (clarity) =>
      clarity("consentv2", { ad_Storage: state, analytics_Storage: state }),
  });
}

// `detail` (np. id szablonu, plan) trafia do Clarity jako tag o nazwie zdarzenia,
// więc nagrania z danym zdarzeniem można filtrować też po szczegółach. Bez danych osobowych.
export function track(event: AnalyticsEvent, detail?: string) {
  enqueue({ consent: false, run: (clarity) => clarity("event", event) });
  if (detail) tag(event, detail);
}

// Tagi do filtrowania nagrań, np. plan lub źródło ruchu.
// NIE wrzucaj tu e-maila, imienia ani innych danych osobowych.
export function tag(key: string, value: string) {
  enqueue({ consent: false, run: (clarity) => clarity("set", key, value) });
}
