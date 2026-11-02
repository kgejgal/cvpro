import { NextResponse } from 'next/server'

// Shared handling for a failed Anthropic call in an API route.
//
// Why this exists: the single ANTHROPIC_API_KEY was invalid in production for
// weeks (Jun–Oct 2026) and every AI feature failed silently because the routes
// either threw an unhandled 500 or logged their own ad-hoc string. These helpers
// emit ONE standardised, greppable marker so an outage is visible in the Vercel
// runtime logs within minutes — grep for "AI_API_ERROR", and `auth=true` means
// the API key itself is bad (401/403), not a transient blip.
//
// Detection is structural (duck-typed) rather than `instanceof Anthropic.APIError`
// so it still works if more than one copy of the SDK ends up in the bundle.

export function logAiError(route: string, err: unknown): { status: number; isAuth: boolean } {
  const e = err as { status?: number; error?: { type?: string } }
  const status = typeof e?.status === 'number' ? e.status : 0
  const type = e?.error?.type ?? ''
  const msg = err instanceof Error ? err.message : String(err)
  const isAuth =
    status === 401 || status === 403 ||
    type === 'authentication_error' || type === 'permission_error' ||
    /invalid x-api-key|authentication_error|invalid_api_key/i.test(msg)
  console.error(`[AI_API_ERROR] route=${route} status=${status} auth=${isAuth} msg=${msg}`)
  return { status, isAuth }
}

// Standard JSON error response (plus the marker log) for routes that just need
// to tell the user the feature is temporarily unavailable, in Polish.
export function aiErrorResponse(route: string, err: unknown): NextResponse {
  const { isAuth } = logAiError(route, err)
  return NextResponse.json(
    { error: 'Funkcja chwilowo niedostępna. Spróbuj ponownie za chwilę.' },
    { status: isAuth ? 503 : 502 },
  )
}
