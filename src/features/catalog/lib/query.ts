import { z } from 'zod'

import {
  type Availability,
  availabilitySchema,
  type ProductCategory,
  productCategorySchema,
} from '@/services/catalog'

/**
 * Estado do catálogo vive na URL. Este módulo é a única tradução entre
 * URLSearchParams e o objeto tipado usado pelos filtros.
 */

export const sortOrderSchema = z.enum([
  'relevancia',
  'preco-asc',
  'preco-desc',
  'autonomia-desc',
  'velocidade-desc',
])
export type SortOrder = z.infer<typeof sortOrderSchema>

export const SORT_LABELS: Record<SortOrder, string> = {
  relevancia: 'Relevância',
  'preco-asc': 'Menor preço',
  'preco-desc': 'Maior preço',
  'autonomia-desc': 'Maior autonomia',
  'velocidade-desc': 'Maior velocidade',
}

export interface CatalogQuery {
  categoria: ProductCategory[]
  disponibilidade: Availability[]
  destaque: boolean
  ordem: SortOrder
}

export const DEFAULT_QUERY: CatalogQuery = {
  categoria: [],
  disponibilidade: [],
  destaque: false,
  ordem: 'relevancia',
}

export const PARAM = {
  categoria: 'categoria',
  disponibilidade: 'disponibilidade',
  destaque: 'destaque',
  ordem: 'ordem',
} as const

function parseList<T>(raw: string | null, schema: z.ZodType<T>): T[] {
  if (!raw) return []
  const seen = new Set<T>()
  for (const part of raw.split(',')) {
    const result = schema.safeParse(part.trim())
    if (result.success) seen.add(result.data)
  }
  return [...seen]
}

/** Valores inválidos são ignorados, nunca derrubam a página. */
export function parseCatalogQuery(params: URLSearchParams): CatalogQuery {
  const ordem = sortOrderSchema.safeParse(params.get(PARAM.ordem))
  return {
    categoria: parseList(params.get(PARAM.categoria), productCategorySchema),
    disponibilidade: parseList(params.get(PARAM.disponibilidade), availabilitySchema),
    destaque: params.get(PARAM.destaque) === '1',
    ordem: ordem.success ? ordem.data : DEFAULT_QUERY.ordem,
  }
}

/** Só grava o que difere do padrão, pra URL ficar limpa e compartilhável. */
export function serializeCatalogQuery(query: CatalogQuery): URLSearchParams {
  const params = new URLSearchParams()
  if (query.categoria.length) params.set(PARAM.categoria, query.categoria.join(','))
  if (query.disponibilidade.length)
    params.set(PARAM.disponibilidade, query.disponibilidade.join(','))
  if (query.destaque) params.set(PARAM.destaque, '1')
  if (query.ordem !== DEFAULT_QUERY.ordem) params.set(PARAM.ordem, query.ordem)
  return params
}

export function countActiveFilters(query: CatalogQuery): number {
  return query.categoria.length + query.disponibilidade.length + (query.destaque ? 1 : 0)
}

export function hasActiveFilters(query: CatalogQuery): boolean {
  return countActiveFilters(query) > 0
}
