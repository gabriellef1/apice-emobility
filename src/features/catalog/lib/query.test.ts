import { describe, expect, it } from 'vitest'

import {
  countActiveFilters,
  DEFAULT_QUERY,
  parseCatalogQuery,
  serializeCatalogQuery,
} from './query'

describe('parseCatalogQuery', () => {
  it('devolve o padrão quando a URL não tem parâmetros', () => {
    expect(parseCatalogQuery(new URLSearchParams())).toEqual(DEFAULT_QUERY)
  })

  it('lê listas separadas por vírgula e ignora valores inválidos', () => {
    const query = parseCatalogQuery(
      new URLSearchParams('categoria=scooter,invalida,trail&disponibilidade=in_stock,xyz'),
    )
    expect(query.categoria).toEqual(['scooter', 'trail'])
    expect(query.disponibilidade).toEqual(['in_stock'])
  })

  it('remove duplicatas e espaços', () => {
    const query = parseCatalogQuery(new URLSearchParams('categoria=scooter, scooter ,sport'))
    expect(query.categoria).toEqual(['scooter', 'sport'])
  })

  it('cai pra relevância quando a ordenação é desconhecida', () => {
    expect(parseCatalogQuery(new URLSearchParams('ordem=aleatoria')).ordem).toBe('relevancia')
    expect(parseCatalogQuery(new URLSearchParams('ordem=preco-asc')).ordem).toBe('preco-asc')
  })

  it('só aceita destaque=1', () => {
    expect(parseCatalogQuery(new URLSearchParams('destaque=1')).destaque).toBe(true)
    expect(parseCatalogQuery(new URLSearchParams('destaque=true')).destaque).toBe(false)
  })
})

describe('serializeCatalogQuery', () => {
  it('gera URL vazia pro padrão', () => {
    expect(serializeCatalogQuery(DEFAULT_QUERY).toString()).toBe('')
  })

  it('faz ida e volta sem perder estado', () => {
    const query = {
      categoria: ['trail', 'sport'] as const,
      disponibilidade: ['pre_order'] as const,
      destaque: true,
      ordem: 'autonomia-desc' as const,
    }
    const params = serializeCatalogQuery({
      categoria: [...query.categoria],
      disponibilidade: [...query.disponibilidade],
      destaque: query.destaque,
      ordem: query.ordem,
    })
    expect(params.toString()).toBe(
      'categoria=trail%2Csport&disponibilidade=pre_order&destaque=1&ordem=autonomia-desc',
    )
    expect(parseCatalogQuery(params)).toEqual({
      categoria: ['trail', 'sport'],
      disponibilidade: ['pre_order'],
      destaque: true,
      ordem: 'autonomia-desc',
    })
  })
})

describe('countActiveFilters', () => {
  it('não conta ordenação como filtro', () => {
    expect(countActiveFilters({ ...DEFAULT_QUERY, ordem: 'preco-desc' })).toBe(0)
    expect(
      countActiveFilters({
        categoria: ['scooter'],
        disponibilidade: ['in_stock', 'pre_order'],
        destaque: true,
        ordem: 'relevancia',
      }),
    ).toBe(4)
  })
})
