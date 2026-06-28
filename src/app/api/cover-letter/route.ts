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
  if ((PLAN_ORDER[plan] ?? 0) < PLAN_ORDER['premium']) {
    return NextResponse.json({ error: 'Plan Premium wymagany' }, { status: 403 })
  }

  const last = rateLimitMap.get(userId)
  if (last && Date.now() - last < COOLDOWN_MS) {
    return NextResponse.json({ error: 'Poczekaj chwilę przed kolejnym żądaniem' }, { status: 429 })
  }
  rateLimitMap.set(userId, Date.now())

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { cv, jobAd, tone } = body as { cv: CVData; jobAd?: string; tone?: string }

  const lang = cv.language === 'en' ? 'angielski' : 'polski'
  const toneDesc = tone === 'formal' ? 'formalny, korporacyjny' : tone === 'creative' ? 'kreatywny, wyrazisty' : 'profesjonalny, ale przyjazny'

  const recentExp = cv.experience.slice(0, 2).map(e =>
    `${e.position} w ${e.company} (${e.startDate}–${e.endDate === 'present' ? 'obecnie' : e.endDate}): ${e.bullets.slice(0, 2).join('. ')}`
  ).join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Napisz list motywacyjny dla kandydata.

DANE KANDYDATA:
Imię i nazwisko: ${cv.firstName} ${cv.lastName}
Stanowisko docelowe: ${cv.title}
Podsumowanie: ${cv.summary}
Ostatnie doświadczenie:
${recentExp}
Kluczowe umiejętności: ${cv.skills.slice(0, 8).join(', ')}
${jobAd ? `\nOGŁOSZENIE:\n${jobAd}` : ''}

WYMAGANIA:
- Język: ${lang}
- Ton: ${toneDesc}
- Długość: 3-4 akapity, maksymalnie 350 słów
- Nie używaj słów "AI", "sztuczna inteligencja"
- Zacznij od mocnego, przykuwającego uwagę zdania
- Odnieś się do konkretnych osiągnięć kandydata
- Zakończ wyraźnym CTA${jobAd ? '\n- Nawiąż do wymagań z ogłoszenia' : ''}

Zwróć TYLKO treść listu, bez nagłówka, bez pozdrowień "Z poważaniem" itp. — sam tekst akapitów.`,
    }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
  return NextResponse.json({ letter: text })
}
