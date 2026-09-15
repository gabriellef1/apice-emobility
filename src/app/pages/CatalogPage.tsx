import { SlidersHorizontal } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useLoaderData } from 'react-router'

import { type catalogLoader } from '@/app/loaders'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Drawer } from '@/components/ui/Drawer'
import { FilterPanel } from '@/features/catalog/components/FilterPanel'
import { ProductCard } from '@/features/catalog/components/ProductCard'
import { SortSelect } from '@/features/catalog/components/SortSelect'
import { useCatalogQuery } from '@/features/catalog/hooks/useCatalogQuery'
import { filterProducts, sortProducts } from '@/features/catalog/lib/apply'
import { buildFacets } from '@/features/catalog/lib/facets'
import { countActiveFilters } from '@/features/catalog/lib/query'

export function CatalogPage() {
  const { products } = useLoaderData<typeof catalogLoader>()
  const { query, setQuery, clear } = useCatalogQuery()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const facets = useMemo(() => buildFacets(products), [products])
  const results = useMemo(
    () => sortProducts(filterProducts(products, query), query.ordem),
    [products, query],
  )
  const activeCount = countActiveFilters(query)
  const hasFacets =
    facets.categoria.length > 0 || facets.disponibilidade.length > 0 || facets.destaque !== null

  const panel = (idPrefix: string) => (
    <FilterPanel
      facets={facets}
      query={query}
      onChange={setQuery}
      onClear={clear}
      idPrefix={idPrefix}
    />
  )

  return (
    <>
      <Seo
        title="Catálogo de motos elétricas"
        description="Todos os modelos da Ápice E-Mobility: scooters, urbanas, trail e esportivas. Filtre por categoria e disponibilidade e peça seu orçamento."
      />

      <Container className="py-10 lg:py-14">
        <header className="max-w-2xl">
          <p className="eyebrow text-brand-600">Catálogo</p>
          <h1 className="mt-3 text-display-md font-display text-ink-950 md:text-display-lg">
            Motos elétricas
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-600">
            Compare autonomia, velocidade e potência, escolha o modelo e peça um orçamento pelo
            WhatsApp.
          </p>
        </header>

        <div className="mt-10 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12">
          {hasFacets && (
            <aside aria-label="Filtros" className="hidden lg:block">
              <div className="sticky top-24">
                <h2 className="mb-5 text-lg font-display">Filtros</h2>
                {panel('sidebar')}
              </div>
            </aside>
          )}

          <section aria-label="Resultados" className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 pb-4">
              <p className="text-sm text-ink-600" aria-live="polite">
                <span className="font-medium text-ink-900 tabular-nums">{results.length}</span>{' '}
                {results.length === 1 ? 'modelo' : 'modelos'}
              </p>
              <div className="flex items-center gap-3">
                {hasFacets && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setDrawerOpen(true)}
                    aria-expanded={drawerOpen}
                  >
                    <SlidersHorizontal className="size-4" aria-hidden />
                    Filtrar{activeCount > 0 && ` (${activeCount})`}
                  </Button>
                )}
                <SortSelect value={query.ordem} onChange={(ordem) => setQuery({ ordem })} />
              </div>
            </div>

            {results.length > 0 ? (
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence initial={false}>
                  {results.map((product, index) => (
                    <motion.li
                      key={product.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProductCard product={product} priority={index < 3} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-ink-300 px-6 py-16 text-center">
                <h2 className="text-display-sm font-display text-ink-950">
                  Nenhum modelo com esses filtros
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-600">
                  Tente remover um filtro ou ver o catálogo completo.
                </p>
                <Button variant="outline" className="mt-6" onClick={clear}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </section>
        </div>
      </Container>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filtros"
        closeLabel="Fechar filtros"
      >
        {panel('drawer')}
        <Button variant="dark" className="mt-6 w-full" onClick={() => setDrawerOpen(false)}>
          Ver {results.length} {results.length === 1 ? 'modelo' : 'modelos'}
        </Button>
      </Drawer>
    </>
  )
}
