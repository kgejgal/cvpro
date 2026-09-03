import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const BulletsSchema = z.object({ bullets: z.array(z.string()) })

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

  let message
  try {
    message = await anthropic.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 1024,
      output_config: { format: zodOutputFormat(BulletsSchema) },
      messages: [{
        role: 'user',
        content: `Napisz 3 osiągnięcia do CV dla stanowiska: "${position}"${company ? ` w firmie ${company}` : ''}.${description ? `\nOpis zadań: ${description}` : ''}

Wymagania:
- Każde osiągnięcie zaczyna się od mocnego czasownika (np. Wdrożyłem, Zoptymalizowałem, Stworzyłem)
- Zawiera konkretne liczby lub procenty gdy to możliwe
- Maksymalnie 15 słów każde
- Po polsku
- Nie używaj słów "AI", "sztuczna inteligencja"`,
      }],
    })
  } catch (err) {
    console.error('suggest-bullets: Anthropic call failed', err)
    return NextResponse.json({ error: 'Nie udało się wygenerować sugestii. Spróbuj ponownie.' }, { status: 502 })
  }

  if (!message.parsed_output) {
    return NextResponse.json({ error: 'Nie udało się wygenerować sugestii. Spróbuj ponownie.' }, { status: 502 })
  }
  return NextResponse.json({ bullets: message.parsed_output.bullets.slice(0, 3) })
}
