import Stripe from 'stripe'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const PLAN_LABELS: Record<string, string> = {
  basic: 'Podstawowy',
  pro: 'Pro',
  premium: 'Premium',
}

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { user_id, plan } = session.metadata!

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update plan
    await supabase
      .from('profiles')
      .upsert({ id: user_id, plan }, { onConflict: 'id' })

    const planLabel = PLAN_LABELS[plan] ?? plan

    // Insert notification
    await supabase.from('notifications').insert({
      user_id,
      type: 'payment_success',
      title: `Plan ${planLabel} aktywowany`,
      message: `Twoja płatność zakończyła się pomyślnie. Plan ${planLabel} jest teraz aktywny na Twoim koncie.`,
    })

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { data: { user: authUser } } = await supabase.auth.admin.getUserById(user_id)
        if (authUser?.email) {
          const resend = new Resend(process.env.RESEND_API_KEY)
          await resend.emails.send({
            from: process.env.RESEND_FROM ?? 'CVPro.pl <onboarding@resend.dev>',
            to: authUser.email,
            subject: `CVPro.pl — Plan ${planLabel} aktywowany ✓`,
            html: `
              <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
                <div style="font-size: 22px; font-weight: 800; color: #4477ff; margin-bottom: 24px;">CVPro.pl</div>
                <h1 style="font-size: 20px; color: #111; margin: 0 0 12px;">Plan ${planLabel} aktywowany ✓</h1>
                <p style="color: #555; line-height: 1.6; margin: 0 0 16px;">Twoja płatność zakończyła się pomyślnie. Plan <strong>${planLabel}</strong> jest teraz aktywny na Twoim koncie.</p>
                <a href="https://cvpro.pl/dashboard" style="display: inline-block; background: #4477ff; color: #ffffff; text-decoration: none; font-weight: 700; padding: 12px 24px; border-radius: 8px; margin: 8px 0 24px;">Przejdź do panelu →</a>
                <p style="color: #999; font-size: 13px; margin: 0;">Pozdrawiamy,<br>Zespół CVPro.pl</p>
              </div>
            `,
          })
        }
      } catch (emailError) {
        // Email failure must not break the webhook response
        console.error('Resend email error:', emailError)
      }
    }
  }

  return NextResponse.json({ received: true })
}
