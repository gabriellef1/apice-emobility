import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

import { Picture } from '@/components/ui/Picture'
import { coverImage } from '@/content/images'
import { AvailabilityBadge } from '@/features/product/components/AvailabilityBadge'
import { Price } from '@/features/product/components/Price'
import { primarySpecs } from '@/features/product/lib/specs'
import { CATEGORY_LABELS, type Product, productTitle } from '@/services/catalog'

interface ProductCardProps {
  product: Product
  /** `sizes` da imagem, depende do grid onde o card está. */
  sizes?: string
  priority?: boolean
}

export function ProductCard({
  product,
  sizes = '(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw',
  priority = false,
}: ProductCardProps) {
  const cover = product.images[0]
  const specs = primarySpecs(product)

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        to={`/produto/${product.slug}`}
        viewTransition
        onClick={(event) => {
          // Só o card clicado ganha o nome compartilhado: a foto dele vira a foto
          // grande do produto na transição, os outros ficam parados.
          const picture = event.currentTarget.querySelector<HTMLElement>('[data-card-picture]')
          if (picture) picture.style.viewTransitionName = `product-${product.slug}`
        }}
        className="flex h-full flex-col rounded-lg border border-ink-200 bg-white transition-[border-color,box-shadow] duration-200 ease-snap hover:border-ink-950 hover:shadow-card focus-visible:border-ink-950 focus-visible:shadow-card focus-visible:outline-offset-4"
      >
        <Picture
          image={coverImage(cover?.path ?? 'detail-dash', cover?.alt)}
          sizes={sizes}
          priority={priority}
          className="aspect-[4/3] rounded-t-lg"
          imgClassName="transition-transform duration-900 ease-out-expo group-hover:scale-[1.07] group-focus-within:scale-[1.07]"
          data-card-picture
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="eyebrow text-ink-500">{CATEGORY_LABELS[product.category]}</span>
            <AvailabilityBadge availability={product.availability} />
          </div>
          <h3 className="mt-2 text-xl font-display text-ink-950 transition-colors delay-75 duration-300 group-focus-within:text-brand-600 group-hover:text-brand-600">
            {productTitle(product)}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {product.short_description}
          </p>

          {specs.length > 0 && (
            <dl className="mt-4 grid grid-cols-3 gap-x-3 border-t border-ink-100 pt-4">
              {specs.map((spec) => (
                <div key={spec.key} className="min-w-0">
                  <dt className="text-[11px] tracking-wide text-ink-500 uppercase">{spec.label}</dt>
                  <dd className="mt-0.5 truncate text-sm font-medium text-ink-900 tabular-nums">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <Price product={product} />
            <span className="inline-flex items-center gap-1 text-sm font-medium text-ink-700 transition-colors delay-100 duration-300 group-focus-within:text-brand-600 group-hover:text-brand-600">
              Ver modelo
              <ArrowRight
                className="size-4 transition-transform delay-100 duration-500 ease-out-expo group-focus-within:translate-x-1.5 group-hover:translate-x-1.5"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
