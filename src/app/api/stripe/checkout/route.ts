import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const PRICE_MAP: Record<string, string> = {
    basic: process.env.STRIPE_PRICE_BASIC!,
    pro: process.env.STRIPE_PRICE_PRO!,
    premium: process.env.STRIPE_PRICE_PREMIUM!,
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ok } = rateLimit(user.id, 5, 600_000)
  if (!ok) return NextResponse.json({ error: 'Zbyt wiele prób. Spróbuj za 10 minut.' }, { status: 429 })

  let body: unknown
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { plan } = body as { plan?: string }
  const priceId = plan ? PRICE_MAP[plan] : undefined

  if (!plan || !priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'blik', 'p24'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    customer_email: user.email,
    metadata: { user_id: user.id, plan: plan },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cennik`,
    locale: 'pl',
  })

  return NextResponse.json({ url: session.url })
}
