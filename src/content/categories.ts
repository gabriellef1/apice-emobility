import { type ProductCategory } from '@/services/catalog'

interface CategoryContent {
  /** Uma linha sobre pra quem é. */
  blurb: string
  /** Id em images.json. */
  image: string
}

/** Texto e foto do bloco "Escolha por uso" da home. Só categorias com produto aparecem. */
export const categoryContent: Record<ProductCategory, CategoryContent> = {
  scooter: {
    blurb: 'Até 32 km/h, pra rotina na cidade sem complicação.',
    image: 'scooter-small-white',
  },
  moto: {
    blurb: 'Mais velocidade e autonomia pra avenida e estrada.',
    image: 'ride-street',
  },
  ebike: {
    blurb: 'Pedal assistido com sensor de torque e bateria removível.',
    image: 'ebike-cruiser',
  },
  triciclo: { blurb: 'Três rodas pra passageiros ou carga.', image: 'scooter-mini-pair' },
}
