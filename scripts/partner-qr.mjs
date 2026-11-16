// Generuje kody QR i ulotki dla partnerów (agencje pracy, biura karier, szkoły).
//
//   npm run partner-qr -- uew-biuro-karier
//   npm run partner-qr -- uew-biuro-karier agencja-xyz
//   npm run partner-qr -- uew-biuro-karier --path /dla-partnerow
//   npm run partner-qr -- uew-biuro-karier --flyer
//   npm run partner-qr -- uew-biuro-karier --flyer --partner "Biuro Karier UEW"
//
// Każdy partner dostaje własny znacznik ?ref=..., który strona zapisuje (PartnerRefCapture)
// i dopisuje jako tag sesji w Clarity. Pliki trafiają do partner-qr/: SVG do druku, PNG do
// wklejenia w dokument, a z --flyer jeszcze ulotka A4 (HTML, a gdy jest Chrome, także PDF).
// Kod jest zwykły czarno-biały, bo takie skanują się najpewniej.
//
// --partner dopisuje na ulotce "Polecane przez: ...". Używaj tego tylko za zgodą partnera.
import QRCode from 'qrcode'
import { mkdir, writeFile, access } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const run = promisify(execFile)

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'
const OUT_DIR = 'partner-qr'
const REF_RE = /^[a-z0-9_-]{1,40}$/ // ten sam zestaw znaków, który przepuszcza PartnerRefCapture
const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
]

const args = process.argv.slice(2)
let path = '/kreator'
let flyer = false
let partnerName = ''
const refs = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--path') path = args[++i] ?? path
  else if (args[i] === '--flyer') flyer = true
  else if (args[i] === '--partner') partnerName = args[++i] ?? ''
  else refs.push(args[i])
}

if (refs.length === 0) {
  console.error('Podaj co najmniej jeden znacznik partnera, np.: npm run partner-qr -- uew-biuro-karier')
  process.exit(1)
}
if (!path.startsWith('/')) {
  console.error(`--path musi zaczynać się od "/" (podano: ${path})`)
  process.exit(1)
}

const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function flyerHtml({ qrSvg, partner }) {
  const host = BASE.replace(/^https?:\/\//, '')
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>CVPro.pl - ulotka</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Onest:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: 210mm; height: 297mm; overflow: hidden;
    display: flex; flex-direction: column;
    font-family: 'Onest', system-ui, -apple-system, 'Segoe UI', sans-serif;
    color: #0d1c35; background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .display { font-family: 'Bricolage Grotesque', 'Onest', system-ui, sans-serif; }
  .top { padding: 16mm 18mm 0; }
  .logo { font-weight: 800; font-size: 22pt; letter-spacing: -0.01em; }
  .logo span { color: #4477ff; }
  .logo small { font-size: 14pt; color: #4477ff; }
  main { flex: 1; padding: 12mm 18mm 0; }
  h1 { font-weight: 800; font-size: 38pt; line-height: 1.06; letter-spacing: -0.02em; margin: 0 0 6mm; }
  h1 em { font-style: normal; color: #4477ff; }
  .lead { font-size: 14pt; line-height: 1.5; color: #3a4a66; margin: 0 0 9mm; max-width: 150mm; }
  .qrcard { display: flex; align-items: center; gap: 11mm; border: 2px solid #0d1c35; border-radius: 6mm; padding: 7mm; }
  .qrcard svg { width: 76mm; height: 76mm; flex-shrink: 0; }
  .scan-title { font-weight: 800; font-size: 19pt; line-height: 1.15; margin: 0 0 4mm; }
  .scan-text { font-size: 11.5pt; line-height: 1.5; color: #3a4a66; margin: 0 0 4mm; }
  .scan-url { font-weight: 700; font-size: 13pt; color: #4477ff; word-break: break-all; }
  ul { list-style: none; margin: 9mm 0 0; padding: 0; display: grid; gap: 4.5mm; }
  li { display: flex; gap: 4mm; align-items: flex-start; font-size: 12.5pt; line-height: 1.4; }
  li i { flex-shrink: 0; width: 6.5mm; height: 6.5mm; border-radius: 50%; background: #4477ff; color: #fff; font-style: normal; font-weight: 800; font-size: 10pt; display: flex; align-items: center; justify-content: center; margin-top: 0.4mm; }
  footer { background: #0d1c35; color: #fff; padding: 9mm 18mm; display: flex; justify-content: space-between; align-items: flex-end; gap: 8mm; }
  footer .site { font-weight: 800; font-size: 20pt; letter-spacing: -0.01em; }
  footer .site span { color: #7aa2ff; }
  footer .meta { text-align: right; font-size: 10.5pt; line-height: 1.5; color: #c9d7f2; }
  footer .partner { color: #fff; font-weight: 700; }
</style>
</head>
<body>
  <div class="top"><div class="logo display"><span>CV</span>Pro<small>.pl</small></div></div>
  <main>
    <h1 class="display">Potrzebujesz CV?<br><em>Zrób je w kilka minut.</em></h1>
    <p class="lead">Zeskanuj kod telefonem i zacznij od razu. Nie musisz zakładać konta ani niczego instalować.</p>

    <div class="qrcard">
      ${qrSvg}
      <div>
        <p class="scan-title display">Zeskanuj aparatem w telefonie</p>
        <p class="scan-text">Nie działa kod? Wpisz w przeglądarce:</p>
        <div class="scan-url">${esc(host)}${esc(path)}</div>
      </div>
    </div>

    <ul>
      <li><i>✓</i><span>Tworzenie i podgląd CV jest bezpłatny, bez zakładania konta.</span></li>
      <li><i>✓</i><span>Gotowe wzory CV dla wielu zawodów, więc wiesz, co wpisać.</span></li>
      <li><i>✓</i><span>Wersja bez znaku wodnego kosztuje jednorazowo od 15 zł (BLIK lub karta). Bez subskrypcji.</span></li>
    </ul>
  </main>
  <footer>
    <div class="site display"><span>CV</span>Pro.pl</div>
    <div class="meta">
      ${partner ? `<div class="partner">Polecane przez: ${esc(partner)}</div>` : ''}
      <div>${esc(host)} · kontakt@cvpro.pl</div>
    </div>
  </footer>
</body>
</html>
`
}

async function findChrome() {
  for (const p of CHROME_PATHS) {
    try { await access(p); return p } catch { /* następny */ }
  }
  return null
}

await mkdir(OUT_DIR, { recursive: true })
const chrome = flyer ? await findChrome() : null

for (const ref of refs) {
  if (!REF_RE.test(ref)) {
    console.error(`Pominięto "${ref}": dozwolone są małe litery a-z, cyfry, "-" i "_" (maks. 40 znaków).`)
    process.exitCode = 1
    continue
  }
  const url = `${BASE}${path}?ref=${ref}`
  // Poziom korekcji M: odporny na zagniecenia i słaby druk, a kod zostaje prosty do skanowania.
  const opts = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#000000', light: '#ffffff' } }
  const svg = await QRCode.toString(url, { ...opts, type: 'svg' })
  await writeFile(join(OUT_DIR, `${ref}.svg`), svg)
  await QRCode.toFile(join(OUT_DIR, `${ref}.png`), url, { ...opts, width: 1024 })
  console.log(`${ref}\n  ${url}\n  ${join(OUT_DIR, `${ref}.svg`)}\n  ${join(OUT_DIR, `${ref}.png`)}`)

  if (flyer) {
    const htmlPath = resolve(OUT_DIR, `${ref}-ulotka.html`)
    const pdfPath = resolve(OUT_DIR, `${ref}-ulotka.pdf`)
    await writeFile(htmlPath, flyerHtml({ qrSvg: svg, partner: partnerName.trim() }))
    console.log(`  ${join(OUT_DIR, `${ref}-ulotka.html`)}`)
    if (!chrome) {
      console.log('  (brak Chrome: otwórz plik HTML i wybierz Drukuj > Zapisz jako PDF, rozmiar A4, bez marginesów)')
      continue
    }
    try {
      // virtual-time-budget daje czas na pobranie czcionek, zanim Chrome zrobi PDF.
      await run(chrome, [
        '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
        '--virtual-time-budget=10000', `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href,
      ], { timeout: 60000 })
      console.log(`  ${join(OUT_DIR, `${ref}-ulotka.pdf`)}`)
    } catch (err) {
      console.error(`  Nie udało się zrobić PDF (${err.message.split('\n')[0]}). Użyj pliku HTML i Drukuj > Zapisz jako PDF.`)
    }
  }
}
