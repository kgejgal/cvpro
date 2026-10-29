import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import {
  IMPORT_PROMPT, ImportedCVSchema, ImportFileError, MAX_IMPORT_BYTES, MIN_TEXT_CHARS,
  detectKind, extractText, toCVPatch,
} from '@/lib/cv/import'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const fail = (error: string, status: number) => NextResponse.json({ error }, { status })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return fail('Zaloguj się, aby wczytać CV z pliku.', 401)

  const started = Date.now()

  // A handful of imports per hour per user; each one is a paid request.
  const { ok } = rateLimit(`import:${user.id}`, 5, 3_600_000)
  if (!ok) return fail('Wykorzystano limit wczytań pliku (5 na godzinę). Spróbuj za jakiś czas albo wypełnij formularz ręcznie.', 429)

  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > MAX_IMPORT_BYTES + 64 * 1024) return fail('Plik jest za duży. Maksymalny rozmiar to 4 MB.', 413)

  let file: FormDataEntryValue | null
  try { file = (await req.formData()).get('file') }
  catch { return fail('Nie udało się odebrać pliku. Spróbuj ponownie.', 400) }
  if (!(file instanceof File) || file.size === 0) return fail('Wybierz plik PDF lub DOCX.', 400)
  if (file.size > MAX_IMPORT_BYTES) return fail('Plik jest za duży. Maksymalny rozmiar to 4 MB.', 413)

  const bytes = new Uint8Array(await file.arrayBuffer())
  const kind = detectKind(bytes, file.name)
  if (!kind) return fail('Obsługujemy tylko pliki PDF i DOCX (nie starszy format DOC).', 415)

  let text: string
  try { text = await extractText(bytes, kind) }
  catch (err) {
    if (err instanceof ImportFileError) return fail('Ten plik ma zbyt wiele stron jak na CV (maksymalnie 12).', 422)
    console.error('cv import: reading the file failed', err)
    return fail('Nie udało się odczytać tego pliku. Może być uszkodzony lub zabezpieczony hasłem.', 422)
  }
  if (text.length < MIN_TEXT_CHARS) {
    return fail('W pliku nie ma tekstu do odczytu (to może być skan lub zdjęcie). Wgraj plik, w którym da się zaznaczać tekst, albo wypełnij formularz ręcznie.', 422)
  }

  let message
  try {
    message = await anthropic.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 8000,
      output_config: { format: zodOutputFormat(ImportedCVSchema) },
      messages: [{ role: 'user', content: IMPORT_PROMPT(text) }],
    })
  } catch (err) {
    console.error('cv import: Anthropic call failed', err)
    return fail('Nie udało się wczytać danych z pliku. Spróbuj ponownie za chwilę.', 502)
  }
  if (!message.parsed_output) return fail('Nie udało się wczytać danych z pliku. Spróbuj ponownie za chwilę.', 502)

  const data = toCVPatch(message.parsed_output)
  // Successes are logged too (sizes and timing only, never the file's content), so the runtime
  // logs show that imports work instead of only listing the failures.
  console.log(
    `cv import: ok kind=${kind} chars=${text.length} jobs=${data.experience?.length ?? 0} ` +
    `tokens_in=${message.usage.input_tokens} tokens_out=${message.usage.output_tokens} ms=${Date.now() - started}`,
  )
  return NextResponse.json({ data })
}
