import { describe, expect, it } from 'vitest'

import { productSchema } from '../types'
import { MockCatalogService } from './MockCatalogService'
import { products } from './products'

describe('mock de produtos', () => {
  it('todos os registros passam pelo schema', () => {
    for (const product of products) {
      const result = productSchema.safeParse(product)
      expect(result.success, `${product.slug}: ${JSON.stringify(result.error?.issues)}`).toBe(true)
    }
  })

  it('slugs e ids são únicos', () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length)
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length)
  })

  it('tem pelo menos um inativo pra provar o isolamento', () => {
    expect(products.some((p) => !p.active)).toBe(true)
  })
})

describe('MockCatalogService', () => {
  const service = new MockCatalogService()

  it('lista só produtos ativos, em sort_order', async () => {
    const list = await service.list()
    expect(list.every((p) => p.active)).toBe(true)
    expect(list.length).toBe(products.filter((p) => p.active).length)
    const orders = list.map((p) => p.sort_order)
    expect(orders).toEqual(orders.slice().sort((a, b) => a - b))
  })

  it('não devolve produto inativo por slug', async () => {
    const inactive = products.find((p) => !p.active)
    expect(inactive).toBeDefined()
    expect(await service.getBySlug(inactive?.slug ?? '')).toBeNull()
  })

  it('devolve null pra slug desconhecido', async () => {
    expect(await service.getBySlug('nao-existe')).toBeNull()
  })

  it('rejeita fonte inválida na construção', () => {
    const broken = { ...products[0], price: 100, price_on_request: true }
    expect(() => new MockCatalogService([broken as never])).toThrow()
  })
})
