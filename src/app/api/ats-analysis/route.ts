import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import type { CVData } from '@/lib/cv/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const rateLimitMap = new Map<string, number>()
const COOLDOWN_MS = 60_000
const PLAN_ORDER: Record<string, number> = { free: 0, basic: 1, pro: 2, premium: 3 }

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = user.id
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', userId).single()
  const plan = profile?.plan ?? 'free'
  if ((PLAN_ORDER[plan] ?? 0) < PLAN_ORDER['pro']) {
    return NextResponse.json({ error: 'Plan Pro wymagany' }, { status: 403 })
  }

  const last = rateLimitMap.get(userId)
  if (last && Date.now() - last < COOLDOWN_MS) {
    return NextResponse.json({ error: 'Poczekaj chwilę przed kolejnym żądaniem' }, { status: 429 })
  }
  rateLimitMap.set(userId, Date.now())

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { cv, jobAd } = body as { cv: CVData; jobAd?: string }

  const cvText = [
    `${cv.firstName} ${cv.lastName}`,
    cv.title,
    cv.summary,
    ...cv.experience.map(e => `${e.position} @ ${e.company}: ${e.bullets.join('. ')}`),
    ...cv.education.map(e => `${e.degree} ${e.field} — ${e.school}`),
    `Umiejętności: ${cv.skills.join(', ')}`,
    `Języki: ${cv.languages.map(l => `${l.name} ${l.level}`).join(', ')}`,
  ].filter(Boolean).join('\n')

  const jobAdSection = jobAd ? `\n\nOGŁOSZENIE O PRACĘ:\n${jobAd}` : ''

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Jesteś ekspertem od systemów ATS (Applicant Tracking Systems). Przeanalizuj poniższe CV i oceń jego skuteczność.${jobAdSection ? ' Uwzględnij dopasowanie do ogłoszenia.' : ''}

CV:
${cvText}${jobAdSection}

Zwróć TYLKO JSON w tym formacie (bez markdown, bez opisu):
{
  "score": <liczba 0-100>,
  "grade": "<A+|A|B+|B|C+|C|D>",
  "summary": "<jedno zdanie po polsku>",
  "strengths": ["<mocna strona 1>", "<mocna strona 2>", "<mocna strona 3>"],
  "improvements": [
    { "priority": "high", "tip": "<konkretna wskazówka po polsku>" },
    { "priority": "medium", "tip": "<konkretna wskazówka po polsku>" },
    { "priority": "low", "tip": "<konkretna wskazówka po polsku>" }
  ],
  "keywords": { "found": ["<słowo kluczowe>"], "missing": ["<brakujące słowo>"] }
}`,
    }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
  try {
    const match = raw.match(/\{[\s\S]*\}/)
    const result = match ? JSON.parse(match[0]) : { score: 0, grade: 'C', summary: '', strengths: [], improvements: [], keywords: { found: [], missing: [] } }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ score: 0, grade: 'C', summary: 'Błąd analizy', strengths: [], improvements: [], keywords: { found: [], missing: [] } })
  }
}
