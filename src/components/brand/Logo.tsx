import lockupImage from '@/assets/brand/lockup-horizontal.png'
import symbol from '@/assets/brand/symbol.png'
import { company } from '@/config/company'
import { cn } from '@/lib/cn'

interface LogoProps {
  /** Altura em px do lockup. */
  height?: number
  /** "auto": só o símbolo abaixo de 640px (header). "always": lockup completo sempre. */
  lockup?: 'auto' | 'always'
  className?: string
}

/**
 * Lockup horizontal (símbolo + wordmark) a partir de 640px; só o símbolo
 * abaixo disso pra sobrar espaço no header. Os PNGs vêm de scripts/extract-logo.mjs
 * e funcionam apenas sobre fundo escuro (wordmark branco).
 */
export function Logo({ height = 36, lockup = 'auto', className }: LogoProps) {
  // Proporções medidas dos arquivos gerados (lockup 948x255, símbolo 372x255).
  const lockupWidth = Math.round((height * 948) / 255)
  const symbolWidth = Math.round((height * 372) / 255)

  return (
    <picture className={cn('block', className)}>
      <source
        media={lockup === 'always' ? 'all' : '(min-width: 640px)'}
        srcSet={lockupImage}
        width={lockupWidth}
        height={height}
      />
      <img
        src={symbol}
        width={symbolWidth}
        height={height}
        alt={company.name}
        decoding="async"
        className="h-auto w-auto"
        style={{ height }}
      />
    </picture>
  )
}
