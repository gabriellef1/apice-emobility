import { type Product, productSchema } from '@/services/catalog'

let counter = 0

/** Produto válido com overrides. Passa pelo schema pra teste nunca usar dado inválido. */
export function makeProduct(overrides: Partial<Product> = {}): Product {
  counter += 1
  const id = overrides.id ?? `p-${counter}`
  const base: Product = {
    id,
    slug: `modelo-${counter}`,
    brand: 'Aima',
    name: `Modelo ${counter}`,
    short_description: 'Descrição curta.',
    description: 'Descrição longa do modelo.',
    price: 1000000,
    price_on_request: false,
    category: 'scooter',
    availability: 'in_stock',
    featured: false,
    active: true,
    sort_order: counter,
    specifications: { range_km: 80, top_speed_kmh: 60, motor_power_w: 2000 },
    images: [{ id: `${id}-img`, product_id: id, path: 'detail-dash', alt: 'Foto', sort_order: 0 }],
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  }
  return productSchema.parse({ ...base, ...overrides })
}
