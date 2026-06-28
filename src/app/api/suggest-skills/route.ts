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

  const { title, experience } = body as { title?: string; experience?: { position: string; company: string }[] }
  if (!title) return NextResponse.json({ skills: [] })

  const expText = (experience || [])
    .slice(0, 3)
    .map((e) => `${e.position} w ${e.company}`)
    .join(', ')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: `Podaj 12 kluczowych umiejętności do CV dla osoby na stanowisko: "${title}".${expText ? ` Doświadczenie: ${expText}.` : ''}
Zwróć TYLKO listę JSON bez żadnego opisu, np.:
["Umiejętność 1", "Umiejętność 2", ...]
Umiejętności powinny być po polsku, konkretne i wartościowe dla rekrutera.`,
    }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    const skills: string[] = match ? JSON.parse(match[0]) : []
    return NextResponse.json({ skills: skills.slice(0, 12) })
  } catch {
    return NextResponse.json({ skills: [] })
  }
}
