'use client'

import { useFormStatus } from 'react-dom'
import type { CSSProperties, ReactNode } from 'react'

// A submit button that reflects the form's pending state immediately on click, so a server
// action (delete, clone, sign out) gives instant feedback instead of looking frozen while the
// request is in flight — the round trip can be slow on mobile or a cold serverless function.
export default function PendingButton({
  children,
  pendingText,
  style,
}: {
  children: ReactNode
  pendingText: string
  style?: CSSProperties
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        ...style,
        opacity: pending ? 0.6 : (style?.opacity ?? 1),
        cursor: pending ? 'wait' : (style?.cursor ?? 'pointer'),
      }}
    >
      {pending ? pendingText : children}
    </button>
  )
}
