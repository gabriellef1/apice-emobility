import { type ProductCategory } from '@/services/catalog'

interface CategoryContent {
  /** Uma linha sobre pra quem é. */
  blurb: string
  /** Id em images.json. */
  image: string
}

/** Texto e foto do bloco "Escolha por uso" da home. Só categorias com produto aparecem. */
export const categoryContent: Record<ProductCategory, CategoryContent> = {
  scooter: { blurb: 'Deslocamento diário com conforto e porta-objetos.', image: 'detail-dash' },
  street: { blurb: 'Leve, minimalista, pra trajetos curtos na cidade.', image: 'ride-street' },
  trail: { blurb: 'Terra, areia e cidade com suspensão de longo curso.', image: 'trail-orange' },
  sport: { blurb: 'Desempenho de estrada com torque instantâneo.', image: 'sport-garage' },
}
