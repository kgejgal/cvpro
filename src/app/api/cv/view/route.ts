import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const { ok } = rateLimit(ip, 20, 60_000)
  if (!ok) return NextResponse.json({ error: 'Rate limit' }, { status: 429 })

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { cv_id } = body as { cv_id?: string }
  if (!cv_id) return NextResponse.json({ error: 'missing cv_id' }, { status: 400 })

  const supabase = await createClient()
  await supabase.rpc('increment_cv_views', { cv_id })

  return NextResponse.json({ ok: true })
}
