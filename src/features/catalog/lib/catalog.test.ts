import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/test/factories'

import { filterProducts, sortProducts } from './apply'
import { buildFacets } from './facets'
import { DEFAULT_QUERY } from './query'

const products = [
  makeProduct({
    id: 'a',
    category: 'scooter',
    availability: 'in_stock',
    featured: true,
    price: 300,
    sort_order: 1,
    specifications: { range_km: 50 },
  }),
  makeProduct({
    id: 'b',
    category: 'trail',
    availability: 'pre_order',
    featured: false,
    price: 100,
    sort_order: 2,
    specifications: { range_km: 90 },
  }),
  makeProduct({
    id: 'c',
    category: 'sport',
    availability: 'sold_out',
    featured: false,
    price: null,
    price_on_request: true,
    sort_order: 3,
    specifications: {},
  }),
  makeProduct({
    id: 'd',
    category: 'scooter',
    availability: 'in_stock',
    featured: true,
    price: 200,
    sort_order: 4,
    specifications: { range_km: 70 },
  }),
]

describe('buildFacets', () => {
  it('conta categorias e disponibilidades presentes, na ordem canônica', () => {
    const facets = buildFacets(products)
    expect(facets.categoria).toEqual([
      { value: 'scooter', label: 'Scooter', count: 2 },
      { value: 'trail', label: 'Trail', count: 1 },
      { value: 'sport', label: 'Esportiva', count: 1 },
    ])
    expect(facets.disponibilidade.map((o) => o.value)).toEqual([
      'in_stock',
      'pre_order',
      'sold_out',
    ])
    expect(facets.destaque).toBe(2)
  })

  it('esconde faceta sem escolha real', () => {
    const only = [makeProduct({ category: 'scooter' }), makeProduct({ category: 'scooter' })]
    const facets = buildFacets(only)
    expect(facets.categoria).toEqual([])
    expect(facets.disponibilidade).toEqual([])
    expect(facets.destaque).toBeNull()
  })

  it('esconde destaque quando todos são destaque', () => {
    const all = [
      makeProduct({ featured: true }),
      makeProduct({ featured: true, category: 'trail' }),
    ]
    expect(buildFacets(all).destaque).toBeNull()
  })
})

describe('filterProducts', () => {
  it('sem filtros devolve tudo', () => {
    expect(filterProducts(products, DEFAULT_QUERY)).toHaveLength(4)
  })

  it('combina categoria, disponibilidade e destaque com E', () => {
    const result = filterProducts(products, {
      ...DEFAULT_QUERY,
      categoria: ['scooter'],
      disponibilidade: ['in_stock'],
      destaque: true,
    })
    expect(result.map((p) => p.id)).toEqual(['a', 'd'])
  })

  it('dentro da mesma faceta é OU', () => {
    const result = filterProducts(products, { ...DEFAULT_QUERY, categoria: ['trail', 'sport'] })
    expect(result.map((p) => p.id)).toEqual(['b', 'c'])
  })
})

describe('sortProducts', () => {
  it('relevância usa sort_order', () => {
    expect(sortProducts(products.slice().reverse(), 'relevancia').map((p) => p.id)).toEqual([
      'a',
      'b',
      'c',
      'd',
    ])
  })

  it('preço crescente e decrescente deixam "sob consulta" por último', () => {
    expect(sortProducts(products, 'preco-asc').map((p) => p.id)).toEqual(['b', 'd', 'a', 'c'])
    expect(sortProducts(products, 'preco-desc').map((p) => p.id)).toEqual(['a', 'd', 'b', 'c'])
  })

  it('autonomia decrescente deixa quem não tem spec por último', () => {
    expect(sortProducts(products, 'autonomia-desc').map((p) => p.id)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('não muta a lista original', () => {
    const copy = products.slice()
    sortProducts(copy, 'preco-asc')
    expect(copy.map((p) => p.id)).toEqual(['a', 'b', 'c', 'd'])
  })
})
