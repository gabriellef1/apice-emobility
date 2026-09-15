import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import {
  type CatalogQuery,
  DEFAULT_QUERY,
  parseCatalogQuery,
  serializeCatalogQuery,
} from '../lib/query'

type Update = Partial<CatalogQuery> | ((current: CatalogQuery) => CatalogQuery)

/** Lê e grava o estado dos filtros na URL. Trocar filtro substitui a entrada do histórico. */
export function useCatalogQuery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(() => parseCatalogQuery(searchParams), [searchParams])

  const setQuery = useCallback(
    (update: Update) => {
      setSearchParams(
        (current) => {
          const parsed = parseCatalogQuery(current)
          const next = typeof update === 'function' ? update(parsed) : { ...parsed, ...update }
          return serializeCatalogQuery(next)
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setSearchParams],
  )

  const clear = useCallback(() => {
    setQuery((current) => ({ ...DEFAULT_QUERY, ordem: current.ordem }))
  }, [setQuery])

  return { query, setQuery, clear }
}
