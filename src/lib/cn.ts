type ClassValue = string | false | null | undefined | 0

/** Junta classes ignorando valores falsy. Suficiente pro projeto, sem dependência. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
