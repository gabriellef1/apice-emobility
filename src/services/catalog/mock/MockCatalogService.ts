import { type CatalogService } from '../CatalogService'
import { type Product, productSchema } from '../types'
import { products } from './products'

/** Simula a latência de rede pra UI já lidar com estados de carregamento. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class MockCatalogService implements CatalogService {
  private readonly items: Product[]
  private readonly latencyMs: number

  constructor(source: readonly Product[] = products, latencyMs = 0) {
    this.items = source.map((p) => productSchema.parse(p))
    this.latencyMs = latencyMs
  }

  async list(): Promise<Product[]> {
    await delay(this.latencyMs)
    return this.items
      .filter((p) => p.active)
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
  }

  async getBySlug(slug: string): Promise<Product | null> {
    await delay(this.latencyMs)
    return this.items.find((p) => p.active && p.slug === slug) ?? null
  }
}
