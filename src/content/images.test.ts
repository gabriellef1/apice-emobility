import { describe, expect, it } from 'vitest'

import { products } from '@/services/catalog/mock/products'

import { categoryContent } from './categories'
import { getImageMeta, listImages } from './images'
import manifest from './images.json'

function duplicates<T>(values: T[]): T[] {
  const seen = new Set<T>()
  const dupes = new Set<T>()
  for (const value of values) {
    if (seen.has(value)) dupes.add(value)
    seen.add(value)
  }
  return [...dupes]
}

describe('manifesto de imagens', () => {
  it('não tem id repetido', () => {
    expect(duplicates(listImages().map((i) => i.id))).toEqual([])
  })

  it('não tem a mesma foto do Unsplash sob dois ids', () => {
    expect(duplicates(listImages().map((i) => i.unsplashId))).toEqual([])
  })

  it('toda imagem tem autor, link e alt', () => {
    for (const image of listImages()) {
      expect(image.author, image.id).toBeTruthy()
      expect(image.authorUrl, image.id).toMatch(/^https:\/\/unsplash\.com\/@/)
      expect(image.alt.length, image.id).toBeGreaterThan(10)
    }
  })

  it('a imagem OG existe e tem variante wide', () => {
    expect(getImageMeta(manifest.ogImage).wide).toBe(true)
  })
})

describe('uso das imagens no catálogo', () => {
  it('todo produto e categoria aponta pra imagem registrada', () => {
    for (const product of products) {
      for (const image of product.images) {
        expect(() => getImageMeta(image.path), `${product.slug} -> ${image.path}`).not.toThrow()
      }
    }
    for (const content of Object.values(categoryContent)) {
      expect(() => getImageMeta(content.image)).not.toThrow()
    }
  })

  it('nenhuma foto se repete entre produtos ativos', () => {
    const used = new Map<string, string>()
    for (const product of products.filter((p) => p.active)) {
      for (const image of product.images) {
        const owner = used.get(image.path)
        expect(owner, `${image.path} já usada em ${owner ?? ''}`).toBeUndefined()
        used.set(image.path, product.slug)
      }
    }
  })
})
