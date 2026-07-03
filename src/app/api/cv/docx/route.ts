import { NextResponse, type NextRequest } from 'next/server'
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { EMPTY_CV, PLAN_ORDER, type CVData } from '@/lib/cv/types'

export const dynamic = 'force-dynamic'

const RODO_PL = 'Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji (zgodnie z ustawą z dnia 10 maja 2018 roku o ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000) oraz zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO)).'

const LABELS = {
  pl: { summary: 'Podsumowanie zawodowe', experience: 'Doświadczenie zawodowe', education: 'Wykształcenie', skills: 'Umiejętności', languages: 'Języki obce', certifications: 'Certyfikaty', hobbies: 'Zainteresowania', present: 'obecnie' },
  en: { summary: 'Professional Summary', experience: 'Work Experience', education: 'Education', skills: 'Skills', languages: 'Languages', certifications: 'Certifications', hobbies: 'Interests', present: 'present' },
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2563EB' } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: '1F3A5F', font: 'Calibri' })],
  })
}

function body(text: string, opts: { bold?: boolean; italic?: boolean; size?: number; color?: string } = {}): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italic, size: opts.size ?? 21, color: opts.color ?? '333333', font: 'Calibri' })],
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ok } = rateLimit(`docx:${user.id}`, 10, 60_000)
  if (!ok) return NextResponse.json({ error: 'Zbyt wiele pobrań. Spróbuj za chwilę.' }, { status: 429 })

  let reqBody: unknown
  try { reqBody = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const { cvId } = reqBody as { cvId?: string }
  if (!cvId) return NextResponse.json({ error: 'Missing cvId' }, { status: 400 })

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const plan = profile?.plan ?? 'free'
  if ((PLAN_ORDER[plan] ?? 0) < PLAN_ORDER['basic']) {
    return NextResponse.json({ error: 'Eksport Word wymaga planu Podstawowego lub wyższego.' }, { status: 403 })
  }

  const { data: cv } = await supabase.from('cvs').select('data, user_id').eq('id', cvId).single()
  if (!cv || cv.user_id !== user.id) {
    return NextResponse.json({ error: 'CV nie znalezione' }, { status: 404 })
  }

  const data: CVData = { ...EMPTY_CV, ...(cv.data as CVData) }
  const t = LABELS[data.language === 'en' ? 'en' : 'pl']

  const contact = [data.email, data.phone, [data.city, data.country].filter(Boolean).join(', '), data.linkedin, data.github, data.website]
    .filter(Boolean).join('  ·  ')

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: `${data.firstName} ${data.lastName}`.trim(), bold: true, size: 40, color: '111111', font: 'Calibri' })],
    }),
  ]
  if (data.title) children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: data.title, size: 24, color: '2563EB', font: 'Calibri' })],
  }))
  if (contact) children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text: contact, size: 18, color: '666666', font: 'Calibri' })],
  }))

  if (data.summary) {
    children.push(sectionHeading(t.summary), body(data.summary))
  }

  if (data.experience.length) {
    children.push(sectionHeading(t.experience))
    for (const exp of data.experience) {
      children.push(new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: exp.position || '', bold: true, size: 22, color: '111111', font: 'Calibri' }),
          new TextRun({ text: exp.company ? `  —  ${exp.company}` : '', size: 22, color: '444444', font: 'Calibri' }),
          new TextRun({ text: `   ${[exp.startDate, exp.endDate || t.present].filter(Boolean).join(' – ')}`, size: 18, color: '888888', font: 'Calibri' }),
        ],
      }))
      for (const b of exp.bullets ?? []) {
        if (!b) continue
        children.push(new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [new TextRun({ text: b, size: 20, color: '333333', font: 'Calibri' })],
        }))
      }
    }
  }

  if (data.education.length) {
    children.push(sectionHeading(t.education))
    for (const edu of data.education) {
      children.push(new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({ text: [edu.degree, edu.field].filter(Boolean).join(', '), bold: true, size: 21, color: '111111', font: 'Calibri' }),
          new TextRun({ text: edu.school ? `  —  ${edu.school}` : '', size: 21, color: '444444', font: 'Calibri' }),
          new TextRun({ text: `   ${[edu.startDate, edu.endDate].filter(Boolean).join(' – ')}`, size: 18, color: '888888', font: 'Calibri' }),
        ],
      }))
    }
  }

  if (data.skills.length) {
    children.push(sectionHeading(t.skills), body(data.skills.filter(Boolean).join('  ·  ')))
  }

  if (data.languages.length) {
    children.push(sectionHeading(t.languages), body(data.languages.filter(l => l.name).map(l => `${l.name}${l.level ? ` — ${l.level}` : ''}`).join('  ·  ')))
  }

  if (data.certifications?.length) {
    children.push(sectionHeading(t.certifications))
    for (const c of data.certifications) {
      if (!c.name) continue
      children.push(body(`${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}`))
    }
  }

  if (data.hobbies?.length) {
    children.push(sectionHeading(t.hobbies), body(data.hobbies.filter(Boolean).join('  ·  ')))
  }

  if (data.language !== 'en') {
    children.push(new Paragraph({
      spacing: { before: 400 },
      children: [new TextRun({ text: RODO_PL, italics: true, size: 14, color: '999999', font: 'Calibri' })],
    }))
  }

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
      children,
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  const safeName = (data.lastName || data.firstName || 'cvpro')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '') || 'cvpro'

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="CV-${safeName}.docx"`,
      'Cache-Control': 'no-store',
    },
  })
}
