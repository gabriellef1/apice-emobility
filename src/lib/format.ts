const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** Preço armazenado em centavos (inteiro). */
export function formatPriceBRL(cents: number): string {
  return brl.format(cents / 100)
}

export function formatNumber(value: number): string {
  return number.format(value)
}

export function formatUnit(value: number, unit: string): string {
  return `${formatNumber(value)} ${unit}`
}
