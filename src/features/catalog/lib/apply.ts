import { type Product } from '@/services/catalog'

import { type CatalogQuery, type SortOrder } from './query'

export function filterProducts(products: readonly Product[], query: CatalogQuery): Product[] {
  return products.filter((p) => {
    if (query.categoria.length && !query.categoria.includes(p.category)) return false
    if (query.disponibilidade.length && !query.disponibilidade.includes(p.availability))
      return false
    if (query.destaque && !p.featured) return false
    return true
  })
}

type Pick = (p: Product) => number | null | undefined

/** Valores ausentes (sem preço, sem spec) vão sempre pro fim, em qualquer direção. */
function byNumber(pick: Pick, direction: 'asc' | 'desc') {
  return (a: Product, b: Product) => {
    const va = pick(a)
    const vb = pick(b)
    if (va == null || vb == null) {
      if (va == null && vb == null) return a.sort_order - b.sort_order
      return va == null ? 1 : -1
    }
    const diff = direction === 'asc' ? va - vb : vb - va
    return diff || a.sort_order - b.sort_order
  }
}

const comparators: Record<SortOrder, (a: Product, b: Product) => number> = {
  relevancia: (a, b) => a.sort_order - b.sort_order,
  'preco-asc': byNumber((p) => p.price, 'asc'),
  'preco-desc': byNumber((p) => p.price, 'desc'),
  'autonomia-desc': byNumber((p) => p.specifications.range_km, 'desc'),
  'velocidade-desc': byNumber((p) => p.specifications.top_speed_kmh, 'desc'),
}

export function sortProducts(products: readonly Product[], order: SortOrder): Product[] {
  return products.slice().sort(comparators[order])
}
