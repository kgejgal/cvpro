import type { CVData } from '@/lib/cv/types'

// Vercel functions reject request bodies above 4.5 MB, so the practical limit is a bit lower.
export const MAX_IMPORT_BYTES = 4 * 1024 * 1024

// What the editor applies: a field or section the file did not contain is left out, so it never
// wipes what is already in the form, while everything the file does contain replaces it.
export function withoutEmpty(patch: Partial<CVData>): Partial<CVData> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(patch)) {
    if (Array.isArray(value) ? value.length : value) out[key] = value
  }
  return out as Partial<CVData>
}
