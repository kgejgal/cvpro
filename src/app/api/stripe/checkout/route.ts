import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

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

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    // 'p24' is not yet activated on the Stripe account (dashboard.stripe.com/account/payments/settings) —
    // including it makes Stripe reject session creation entirely, so *every* checkout fails, not just P24 ones.
    // Re-add it once verified active in Stripe. Card + BLIK are confirmed working.
    payment_method_types: ['card', 'blik'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    customer_email: user.email,
    metadata: { user_id: user.id, plan: plan },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cennik`,
    locale: 'pl',
    // Art. 38 pkt 13 ustawy o prawach konsumenta — consent to immediate delivery
    // of digital content and acknowledgment of losing the 14-day withdrawal right
    custom_text: {
      submit: {
        message: 'Kupując, wyrażasz zgodę na natychmiastowe dostarczenie treści cyfrowych i przyjmujesz do wiadomości utratę 14-dniowego prawa odstąpienia od umowy (art. 38 pkt 13 ustawy o prawach konsumenta). Regulamin: cvpro.pl/regulamin',
      },
    },
  }

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create({
      ...sessionParams,
      // Requires the Terms of Service URL configured in Stripe Dashboard → Public details
      consent_collection: { terms_of_service: 'required' },
    })
  } catch {
    // ToS URL not set in Stripe settings — ship the consent text alone
    session = await stripe.checkout.sessions.create(sessionParams)
  }

  return NextResponse.json({ url: session.url })
}
