// Generuje kody QR dla partnerów (agencje pracy, biura karier, szkoły).
//
//   npm run partner-qr -- uew-biuro-karier
//   npm run partner-qr -- uew-biuro-karier agencja-xyz
//   npm run partner-qr -- uew-biuro-karier --path /dla-partnerow
//
// Każdy partner dostaje własny znacznik ?ref=..., który strona zapisuje (PartnerRefCapture)
// i dopisuje jako tag sesji w Clarity. Pliki trafiają do partner-qr/ (SVG do druku, PNG do
// wklejenia w dokument). Kod jest zwykły czarno-biały, bo takie skanują się najpewniej.
import QRCode from 'qrcode'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'
const OUT_DIR = 'partner-qr'
const REF_RE = /^[a-z0-9_-]{1,40}$/ // ten sam zestaw znaków, który przepuszcza PartnerRefCapture

const args = process.argv.slice(2)
let path = '/kreator'
const refs = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--path') path = args[++i] ?? path
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

await mkdir(OUT_DIR, { recursive: true })

for (const ref of refs) {
  if (!REF_RE.test(ref)) {
    console.error(`Pominięto "${ref}": dozwolone są małe litery a-z, cyfry, "-" i "_" (maks. 40 znaków).`)
    process.exitCode = 1
    continue
  }
  const url = `${BASE}${path}?ref=${ref}`
  // Poziom korekcji M: odporny na zagniecenia i słaby druk, a kod zostaje prosty do skanowania.
  const opts = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#000000', light: '#ffffff' } }
  await writeFile(join(OUT_DIR, `${ref}.svg`), await QRCode.toString(url, { ...opts, type: 'svg' }))
  await QRCode.toFile(join(OUT_DIR, `${ref}.png`), url, { ...opts, width: 1024 })
  console.log(`${ref}\n  ${url}\n  ${join(OUT_DIR, `${ref}.svg`)}\n  ${join(OUT_DIR, `${ref}.png`)}`)
}
