import { z } from 'zod'

/**
 * Captura a origem da visita (UTMs e referrer) na primeira página vista e guarda
 * na sessão. Não entra no texto do WhatsApp; vai junto do lead na Fase 3.
 */
export const STORAGE_KEY = 'apice.attribution'

export const attributionSchema = z.object({
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
  landing_path: z.string().max(500),
  captured_at: z.iso.datetime(),
})
export type Attribution = z.infer<typeof attributionSchema>

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const

export function buildAttribution(
  search: string,
  pathname: string,
  referrer: string,
  now: Date = new Date(),
): Attribution {
  const params = new URLSearchParams(search)
  const attribution: Attribution = { landing_path: pathname, captured_at: now.toISOString() }
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim()
    if (value) attribution[key] = value.slice(0, 100)
  }
  if (referrer) attribution.referrer = referrer.slice(0, 500)
  return attribution
}

/** Só grava se ainda não houver registro na sessão: a primeira origem é a que vale. */
export function captureAttribution(storage: Storage, location: Location, referrer: string) {
  if (storage.getItem(STORAGE_KEY)) return
  const attribution = buildAttribution(location.search, location.pathname, referrer)
  storage.setItem(STORAGE_KEY, JSON.stringify(attribution))
}

export function readAttribution(storage: Storage): Attribution | null {
  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = attributionSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
