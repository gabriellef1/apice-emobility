import {
  type Availability,
  AVAILABILITY_LABELS,
  CATEGORY_LABELS,
  type Product,
  type ProductCategory,
} from '@/services/catalog'

export interface FacetOption<T extends string> {
  value: T
  label: string
  count: number
}

export interface Facets {
  categoria: FacetOption<ProductCategory>[]
  disponibilidade: FacetOption<Availability>[]
  /** Quantidade de destaques; `null` quando o filtro não faz sentido (0 ou todos). */
  destaque: number | null
}

export const CATEGORY_ORDER: ProductCategory[] = ['scooter', 'street', 'trail', 'sport']
const AVAILABILITY_ORDER: Availability[] = ['in_stock', 'pre_order', 'sold_out']

function countBy<T extends string>(
  products: readonly Product[],
  pick: (p: Product) => T,
  order: readonly T[],
  labels: Record<T, string>,
): FacetOption<T>[] {
  const counts = new Map<T, number>()
  for (const product of products) {
    const key = pick(product)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return order
    .filter((value) => counts.has(value))
    .map((value) => ({ value, label: labels[value], count: counts.get(value) ?? 0 }))
}

/**
 * Facetas derivadas do catálogo público completo (não do resultado filtrado,
 * senão a opção some assim que é marcada). Faceta com menos de 2 valores
 * distintos não é exibida: filtro sem escolha é ruído.
 */
export function buildFacets(products: readonly Product[]): Facets {
  const categoria = countBy(products, (p) => p.category, CATEGORY_ORDER, CATEGORY_LABELS)
  const disponibilidade = countBy(
    products,
    (p) => p.availability,
    AVAILABILITY_ORDER,
    AVAILABILITY_LABELS,
  )
  const featuredCount = products.filter((p) => p.featured).length
  const destaque = featuredCount > 0 && featuredCount < products.length ? featuredCount : null

  return {
    categoria: categoria.length >= 2 ? categoria : [],
    disponibilidade: disponibilidade.length >= 2 ? disponibilidade : [],
    destaque,
  }
}
