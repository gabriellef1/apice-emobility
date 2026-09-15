import { type Product } from './types'

/**
 * Contrato de leitura do catálogo público. A implementação mock (Fases 1-2)
 * e a do Supabase (Fase 3) devolvem só produtos com `active = true`.
 */
export interface CatalogService {
  list(): Promise<Product[]>
  getBySlug(slug: string): Promise<Product | null>
}
