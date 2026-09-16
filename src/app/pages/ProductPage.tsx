import { ArrowLeft, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router'

import { type productLoader } from '@/app/loaders'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Picture } from '@/components/ui/Picture'
import { coverImage } from '@/content/images'
import { AvailabilityBadge } from '@/features/product/components/AvailabilityBadge'
import { Price } from '@/features/product/components/Price'
import { listSpecs } from '@/features/product/lib/specs'
import { cn } from '@/lib/cn'
import { whatsappLink } from '@/lib/whatsapp'
import { CATEGORY_LABELS } from '@/services/catalog'

/**
 * Versão mínima da página de produto (Fase 1): galeria simples, specs e CTA.
 * A Fase 2 adiciona transição de galeria, formulário de orçamento e JSON-LD.
 */
export function ProductPage() {
  const { product } = useLoaderData<typeof productLoader>()
  const [activeIndex, setActiveIndex] = useState(0)
  const images = product.images.slice().sort((a, b) => a.sort_order - b.sort_order)
  const active = images[activeIndex] ?? images[0]
  const specs = listSpecs(product)
  const colors = product.specifications.colors ?? []

  return (
    <>
      <Seo
        title={product.name}
        description={product.short_description}
        type="product"
        image={active ? coverImage(active.path).src : undefined}
      />

      <Container className="py-8 lg:py-12">
        <Link
          to="/catalogo"
          viewTransition
          className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-600 hover:text-ink-950"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Catálogo
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            {active && (
              <Picture
                key={active.id}
                image={coverImage(active.path, active.alt)}
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority
                className="aspect-[4/3] rounded-lg"
              />
            )}
            {images.length > 1 && (
              <ul className="mt-3 flex gap-3" aria-label="Fotos do modelo">
                {images.map((image, index) => (
                  <li key={image.id}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Foto ${index + 1} de ${images.length}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                      className={cn(
                        'block w-20 overflow-hidden rounded-md border-2 transition-colors',
                        index === activeIndex
                          ? 'border-ink-950'
                          : 'border-transparent hover:border-ink-300',
                      )}
                    >
                      <Picture
                        image={coverImage(image.path, image.alt)}
                        sizes="80px"
                        className="aspect-[4/3]"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-ink-500">Imagem ilustrativa.</p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="eyebrow text-ink-500">{CATEGORY_LABELS[product.category]}</span>
              <AvailabilityBadge availability={product.availability} />
            </div>
            <h1 className="mt-3 text-display-md font-display text-ink-950 md:text-display-lg">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              {product.short_description}
            </p>

            <div className="mt-6 border-y border-ink-200 py-5">
              <Price product={product} size="lg" />
              {!product.price_on_request && (
                <p className="mt-1 text-xs text-ink-500">
                  Valor de referência. Confirme condições no orçamento.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                href={whatsappLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                <MessageCircle className="size-5" aria-hidden />
                Pedir orçamento no WhatsApp
              </Button>
            </div>

            {specs.length > 0 && (
              <section className="mt-10" aria-labelledby="specs-heading">
                <h2 id="specs-heading" className="eyebrow text-ink-900">
                  Especificações
                </h2>
                <dl className="mt-4 divide-y divide-ink-200 border-y border-ink-200">
                  {specs.map((spec) => (
                    <div key={spec.key} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-sm text-ink-600">{spec.label}</dt>
                      <dd className="text-right text-sm font-medium text-ink-950 tabular-nums">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {colors.length > 0 && (
              <section className="mt-8" aria-labelledby="colors-heading">
                <h2 id="colors-heading" className="eyebrow text-ink-900">
                  Cores
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <li
                      key={color}
                      className="rounded-md border border-ink-200 px-3 py-1.5 text-sm text-ink-700"
                    >
                      {color}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-10" aria-labelledby="desc-heading">
              <h2 id="desc-heading" className="eyebrow text-ink-900">
                Sobre o modelo
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-700">{product.description}</p>
            </section>
          </div>
        </div>
      </Container>
    </>
  )
}
