import { NextResponse, type NextRequest } from 'next/server'
import { createElement } from 'react'
// react-dom/server is disallowed in route files by Next's bundler; the edge build works in Node too
import { renderToStaticMarkup } from 'react-dom/server.edge'
import { existsSync } from 'fs'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { EMPTY_CV, type CVData } from '@/lib/cv/types'
import { PRINT_CSS, WATERMARK_HTML } from '@/lib/cv/print-css'

import Classic from '@/components/cv/CVPreview/templates/Classic'
import Modern from '@/components/cv/CVPreview/templates/Modern'
import Warsaw from '@/components/cv/CVPreview/templates/Warsaw'
import Elegant from '@/components/cv/CVPreview/templates/Elegant'
import Bold from '@/components/cv/CVPreview/templates/Bold'
import Academic from '@/components/cv/CVPreview/templates/Academic'
import Luxury from '@/components/cv/CVPreview/templates/Luxury'
import Minimal from '@/components/cv/CVPreview/templates/Minimal'
import Professional from '@/components/cv/CVPreview/templates/Professional'
import Creative from '@/components/cv/CVPreview/templates/Creative'
import Startup from '@/components/cv/CVPreview/templates/Startup'
import Timeline from '@/components/cv/CVPreview/templates/Timeline'
import Technical from '@/components/cv/CVPreview/templates/Technical'
import Compact from '@/components/cv/CVPreview/templates/Compact'
import Executive from '@/components/cv/CVPreview/templates/Executive'
import Nordic from '@/components/cv/CVPreview/templates/Nordic'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const TEMPLATES: Record<string, React.ComponentType<{ data: CVData }>> = {
  classic: Classic, modern: Modern, warsaw: Warsaw, elegant: Elegant,
  bold: Bold, academic: Academic, luxury: Luxury, minimal: Minimal,
  professional: Professional, creative: Creative, startup: Startup,
  timeline: Timeline, technical: Technical, compact: Compact,
  executive: Executive, nordic: Nordic,
}

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Onest:wght@400;600;700;800;900&family=Poppins:wght@400;600;700&family=DM+Sans:wght@400;500;700&family=Lato:wght@400;700;900&family=Playfair+Display:wght@400;600;700&display=swap&subset=latin-ext'

async function getBrowser() {
  const { chromium: pw } = await import('playwright-core')
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import('@sparticuz/chromium')).default
    return pw.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  }
  // Local dev: use an installed browser
  const localPaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ]
  const executablePath = localPaths.find(p => existsSync(p))
  return pw.launch({ executablePath, headless: true })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ok } = rateLimit(`pdf:${user.id}`, 10, 60_000)
  if (!ok) return NextResponse.json({ error: 'Zbyt wiele pobrań. Spróbuj za chwilę.' }, { status: 429 })

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const { cvId } = body as { cvId?: string }
  if (!cvId) return NextResponse.json({ error: 'Missing cvId' }, { status: 400 })

  const { data: cv } = await supabase.from('cvs').select('data, user_id').eq('id', cvId).single()
  if (!cv || cv.user_id !== user.id) {
    return NextResponse.json({ error: 'CV nie znalezione' }, { status: 404 })
  }

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const plan = profile?.plan ?? 'free'

  const data: CVData = { ...EMPTY_CV, ...(cv.data as CVData) }
  const Template = TEMPLATES[data.template] ?? Classic
  const markup = renderToStaticMarkup(createElement(Template, { data }))

  const html = `<!DOCTYPE html>
<html lang="${data.language === 'en' ? 'en' : 'pl'}">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>
:root {
  --font-onest: 'Onest', sans-serif;
  --font-poppins: 'Poppins', sans-serif;
  --font-dm-sans: 'DM Sans', sans-serif;
  --font-lato: 'Lato', sans-serif;
  --font-playfair: 'Playfair Display', serif;
}
${PRINT_CSS}
</style>
</head>
<body>${markup}${plan === 'free' ? WATERMARK_HTML : ''}</body>
</html>`

  let browser
  try {
    browser = await getBrowser()
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } })
    await page.setContent(html, { waitUntil: 'networkidle', timeout: 30_000 })
    await page.evaluate(() => document.fonts.ready)
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    })
    const safeName = (data.lastName || data.firstName || 'cvpro')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9-]/g, '') || 'cvpro'
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CV-${safeName}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Nie udało się wygenerować PDF. Spróbuj ponownie.' }, { status: 500 })
  } finally {
    await browser?.close().catch(() => {})
  }
}
