import { beforeEach, describe, expect, it } from 'vitest'

import { buildAttribution, captureAttribution, readAttribution, STORAGE_KEY } from './attribution'

function fakeStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key)
    },
    setItem: (key, value) => {
      map.set(key, value)
    },
  }
}

describe('buildAttribution', () => {
  it('captura só as UTMs conhecidas, truncadas', () => {
    const a = buildAttribution(
      `?utm_source=${'x'.repeat(150)}&utm_medium=cpc&utm_term=ignorar&foo=bar`,
      '/catalogo',
      'https://google.com/',
      new Date('2026-09-15T12:00:00Z'),
    )
    expect(a.utm_source).toHaveLength(100)
    expect(a.utm_medium).toBe('cpc')
    expect(a).not.toHaveProperty('utm_term')
    expect(a.referrer).toBe('https://google.com/')
    expect(a.landing_path).toBe('/catalogo')
    expect(a.captured_at).toBe('2026-09-15T12:00:00.000Z')
  })
})

describe('captureAttribution', () => {
  let storage: Storage
  beforeEach(() => {
    storage = fakeStorage()
  })

  it('grava na primeira visita e não sobrescreve depois', () => {
    captureAttribution(storage, { search: '?utm_source=insta', pathname: '/' } as Location, '')
    captureAttribution(storage, { search: '?utm_source=outra', pathname: '/x' } as Location, '')
    expect(readAttribution(storage)?.utm_source).toBe('insta')
  })

  it('ignora registro corrompido', () => {
    storage.setItem(STORAGE_KEY, '{nope')
    expect(readAttribution(storage)).toBeNull()
  })
})
