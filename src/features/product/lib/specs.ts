import { formatNumber } from '@/lib/format'
import { type Product, type Specifications } from '@/services/catalog'

export interface SpecItem {
  key: keyof Specifications
  label: string
  value: string
}

type NumericSpecKey = Exclude<keyof Specifications, 'battery_type' | 'colors'>

interface SpecDef {
  key: NumericSpecKey
  label: string
  /** Versão curta pro card, onde o rótulo não pode quebrar linha. */
  short?: string
  format: (value: number) => string
}

export function formatPower(watts: number): string {
  return watts >= 1000 ? `${formatNumber(watts / 1000)} kW` : `${formatNumber(watts)} W`
}

/** Ordem de exibição das specs numéricas. Card usa as 3 primeiras disponíveis. */
export const SPEC_DEFS: readonly SpecDef[] = [
  { key: 'range_km', label: 'Autonomia', format: (v) => `${formatNumber(v)} km` },
  {
    key: 'top_speed_kmh',
    label: 'Velocidade máxima',
    short: 'Velocidade',
    format: (v) => `${formatNumber(v)} km/h`,
  },
  { key: 'motor_power_w', label: 'Potência', format: formatPower },
  { key: 'charge_time_h', label: 'Tempo de carga', format: (v) => `${formatNumber(v)} h` },
  { key: 'weight_kg', label: 'Peso', format: (v) => `${formatNumber(v)} kg` },
  { key: 'max_load_kg', label: 'Carga máx.', format: (v) => `${formatNumber(v)} kg` },
]

function batterySpec(specs: Specifications): SpecItem | null {
  const parts: string[] = []
  if (specs.battery_v && specs.battery_ah) parts.push(`${specs.battery_v}V ${specs.battery_ah}Ah`)
  else if (specs.battery_v) parts.push(`${specs.battery_v}V`)
  if (specs.battery_type) parts.push(specs.battery_type)
  if (!parts.length) return null
  return { key: 'battery_type', label: 'Bateria', value: parts.join(' · ') }
}

/** Todas as specs presentes, na ordem de exibição da página de produto. */
export function listSpecs(product: Product): SpecItem[] {
  const specs = product.specifications
  const items: SpecItem[] = []
  for (const def of SPEC_DEFS) {
    const value = specs[def.key]
    if (value !== undefined)
      items.push({ key: def.key, label: def.label, value: def.format(value) })
    if (def.key === 'motor_power_w') {
      const battery = batterySpec(specs)
      if (battery) items.push(battery)
    }
  }
  return items
}

/** As 3 specs de decisão rápida pro card (autonomia, velocidade, potência). */
export function primarySpecs(product: Product, limit = 3): SpecItem[] {
  const specs = product.specifications
  const items: SpecItem[] = []
  for (const def of SPEC_DEFS.slice(0, 3)) {
    const value = specs[def.key]
    if (value !== undefined)
      items.push({ key: def.key, label: def.short ?? def.label, value: def.format(value) })
  }
  return items.slice(0, limit)
}
