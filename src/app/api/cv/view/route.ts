import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { cv_id } = await req.json()
  if (!cv_id) return NextResponse.json({ error: 'missing cv_id' }, { status: 400 })

  const supabase = await createClient()
  await supabase.rpc('increment_cv_views', { cv_id })

  return NextResponse.json({ ok: true })
}
