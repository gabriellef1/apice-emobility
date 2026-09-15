import { type CatalogService } from './CatalogService'
import { MockCatalogService } from './mock/MockCatalogService'

export type { CatalogService } from './CatalogService'
export * from './types'

/** Instância usada pela UI. A Fase 3 troca por SupabaseCatalogService aqui. */
export const catalogService: CatalogService = new MockCatalogService()
