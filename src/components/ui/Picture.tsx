import { type CSSProperties } from 'react'

import { type ImageSource } from '@/content/images'
import { cn } from '@/lib/cn'

interface PictureProps {
  image: ImageSource
  /** Atributo `sizes` do srcset. Ex.: "(min-width: 1024px) 33vw, 100vw". */
  sizes: string
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
  'data-card-picture'?: boolean
}

/**
 * Imagem responsiva com proporção fixa (largura/altura no <img>) pra não ter
 * layout shift. Lazy por padrão; `priority` pra imagem acima da dobra.
 */
export function Picture({
  image,
  sizes,
  priority = false,
  className,
  imgClassName,
  style,
  ...rest
}: PictureProps) {
  return (
    <div className={cn('overflow-hidden bg-ink-100', className)} style={style} {...rest}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  )
}
