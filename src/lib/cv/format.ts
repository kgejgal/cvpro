const PRESENT = new Set(['present', 'obecnie'])

// Both ends of a date range, trimmed, with "present"/"obecnie" shown in the CV's own language.
export function dateParts(start?: string, end?: string, presentLabel?: string): [string, string] {
  const from = (start ?? '').trim()
  let to = (end ?? '').trim()
  if (presentLabel && PRESENT.has(to.toLowerCase())) to = presentLabel
  return [from, to]
}

// One date range for every template and the DOCX export: a single spaced en dash, and no
// dangling dash ("2018 – ") when one of the dates is empty.
export function dateRange(start?: string, end?: string, presentLabel?: string, separator = ' – '): string {
  return dateParts(start, end, presentLabel).filter(Boolean).join(separator)
}
