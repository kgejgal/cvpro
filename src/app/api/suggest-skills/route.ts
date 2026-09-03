import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SkillsSchema = z.object({ skills: z.array(z.string()) })

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

  const { title, experience } = body as { title?: string; experience?: { position: string; company: string }[] }
  if (!title) return NextResponse.json({ skills: [] })

  const expText = (experience || [])
    .slice(0, 3)
    .map((e) => `${e.position} w ${e.company}`)
    .join(', ')

  let message
  try {
    message = await anthropic.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 1024,
      output_config: { format: zodOutputFormat(SkillsSchema) },
      messages: [{
        role: 'user',
        content: `Podaj 12 kluczowych umiejętności do CV dla osoby na stanowisko: "${title}".${expText ? ` Doświadczenie: ${expText}.` : ''}
Umiejętności powinny być po polsku, konkretne i wartościowe dla rekrutera.`,
      }],
    })
  } catch (err) {
    console.error('suggest-skills: Anthropic call failed', err)
    return NextResponse.json({ error: 'Nie udało się wygenerować sugestii. Spróbuj ponownie.' }, { status: 502 })
  }

  if (!message.parsed_output) {
    return NextResponse.json({ error: 'Nie udało się wygenerować sugestii. Spróbuj ponownie.' }, { status: 502 })
  }
  return NextResponse.json({ skills: message.parsed_output.skills.slice(0, 12) })
}
