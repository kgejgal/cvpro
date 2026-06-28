import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const rateLimitMap = new Map<string, number>()
const COOLDOWN_MS = 60_000
const PLAN_ORDER: Record<string, number> = { free: 0, basic: 1, pro: 2, premium: 3 }

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const plan = profile?.plan ?? 'free'
  if ((PLAN_ORDER[plan] ?? 0) < PLAN_ORDER['basic']) {
    return NextResponse.json({ error: 'Wymagany plan Basic lub wyższy.' }, { status: 403 })
  }

  const last = rateLimitMap.get(user.id)
  if (last && Date.now() - last < COOLDOWN_MS) {
    return NextResponse.json({ error: 'Poczekaj chwilę przed kolejnym żądaniem' }, { status: 429 })
  }
  rateLimitMap.set(user.id, Date.now())

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { position, company, description } = body as { position?: string; company?: string; description?: string }
  if (!position) return NextResponse.json({ bullets: [] })

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Napisz 3 osiągnięcia do CV dla stanowiska: "${position}"${company ? ` w firmie ${company}` : ''}.${description ? `\nOpis zadań: ${description}` : ''}

Wymagania:
- Każde osiągnięcie zaczyna się od mocnego czasownika (np. Wdrożyłem, Zoptymalizowałem, Stworzyłem)
- Zawiera konkretne liczby lub procenty gdy to możliwe
- Maksymalnie 15 słów każde
- Po polsku
- Nie używaj słów "AI", "sztuczna inteligencja"

Zwróć TYLKO listę JSON, np.:
["Wdrożyłem system X, zwiększając wydajność o 30%", "Zarządzałem zespołem 5 osób...", "Zoptymalizowałem procesy..."]`,
    }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    const bullets: string[] = match ? JSON.parse(match[0]) : []
    return NextResponse.json({ bullets: bullets.slice(0, 3) })
  } catch {
    return NextResponse.json({ bullets: [] })
  }
}
