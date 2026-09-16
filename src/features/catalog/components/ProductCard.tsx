import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

import { Picture } from '@/components/ui/Picture'
import { coverImage } from '@/content/images'
import { AvailabilityBadge } from '@/features/product/components/AvailabilityBadge'
import { Price } from '@/features/product/components/Price'
import { primarySpecs } from '@/features/product/lib/specs'
import { CATEGORY_LABELS, type Product } from '@/services/catalog'

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
        className="flex h-full flex-col rounded-lg border border-ink-200 bg-white transition-[border-color,box-shadow] duration-300 hover:border-ink-400 hover:shadow-card focus-visible:border-ink-400"
      >
        <Picture
          image={coverImage(cover?.path ?? 'detail-front', cover?.alt)}
          sizes={sizes}
          priority={priority}
          className="aspect-[4/3] rounded-t-lg"
          imgClassName="transition-transform duration-700 ease-out-quart group-hover:scale-105"
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="eyebrow text-ink-500">{CATEGORY_LABELS[product.category]}</span>
            <AvailabilityBadge availability={product.availability} />
          </div>
          <h3 className="mt-2 text-xl font-display text-ink-950">{product.name}</h3>
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
            <span className="duration-fast inline-flex items-center gap-1 text-sm font-medium text-ink-700 transition-colors group-hover:text-brand-600">
              Ver modelo
              <ArrowRight
                className="size-4 transition-transform duration-300 ease-out-quart group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
