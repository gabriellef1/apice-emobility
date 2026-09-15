import { cn } from '@/lib/cn'
import { formatPriceBRL } from '@/lib/format'
import { type Product } from '@/services/catalog'

interface PriceProps {
  product: Pick<Product, 'price' | 'price_on_request'>
  size?: 'md' | 'lg'
  className?: string
}

export function Price({ product, size = 'md', className }: PriceProps) {
  if (product.price_on_request || product.price === null) {
    return (
      <span
        className={cn(
          'font-medium text-ink-600',
          size === 'lg' ? 'text-xl' : 'text-base',
          className,
        )}
      >
        Sob consulta
      </span>
    )
  }
  return (
    <span
      className={cn(
        'font-display text-ink-950 tabular-nums',
        size === 'lg' ? 'text-3xl' : 'text-lg',
        className,
      )}
    >
      {formatPriceBRL(product.price)}
    </span>
  )
}
