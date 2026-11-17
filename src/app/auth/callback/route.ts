import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { REF_COOKIE, sanitizeRef } from '@/lib/attribution'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Znacznik kanału: cookie z tej przeglądarki (także logowanie Google) albo metadane z formularza
      // rejestracji (e-mail potwierdzony w innej przeglądarce). Pierwszy kontakt wygrywa.
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const ref = sanitizeRef(decodeURIComponent(cookieStore.get(REF_COOKIE)?.value ?? '')) || sanitizeRef(user?.user_metadata?.signup_ref)
        if (user && ref) {
          await supabase.from('profiles').update({ signup_ref: ref }).eq('id', user.id).is('signup_ref', null)
        }
      } catch { /* statystyka, nie może zepsuć logowania */ }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
    console.error('auth callback: exchangeCodeForSession failed', error.message)
  } else {
    // Supabase redirects here without a code when the provider step failed
    // (e.g. error=server_error, "Unable to exchange external code"). Keep it in the logs.
    console.error('auth callback: no code', searchParams.get('error'), searchParams.get('error_code'), searchParams.get('error_description'))
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth`)
}
