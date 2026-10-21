'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

// Rendered by the dashboard only after the server has confirmed with Stripe that this
// checkout session is paid and belongs to the signed-in user. The storage guard keeps a
// refresh (or re-opening the success URL) from counting the same purchase twice.
export default function PurchaseSuccessTracker({ sessionId }: { sessionId: string }) {
  useEffect(() => {
    const key = `cvpro_purchase_tracked_${sessionId}`
    try {
      if (localStorage.getItem(key)) return
      localStorage.setItem(key, '1')
    } catch { /* storage unavailable — worst case the event is sent again on refresh */ }
    track('purchase_success')
  }, [sessionId])

  return null
}
