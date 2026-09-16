import { z } from 'zod'

/**
 * Schemas do domínio de catálogo. Espelham as colunas que a tabela `products`
 * terá na Fase 3 (snake_case, mesmos nomes), pra que o mock e o banco compartilhem
 * um único tipo. `Product` (público) = linha + imagens; `ProductInput` = o que o
 * admin envia (sem id e timestamps).
 */

/**
 * Categorias seguem a linha da fabricante e a decisão real de compra no Brasil:
 * scooter (até 32 km/h), moto (ciclomotor/moto elétrica, mais velocidade),
 * ebike (pedal assistido) e triciclo (passageiros ou carga).
 */
export const productCategorySchema = z.enum(['scooter', 'moto', 'ebike', 'triciclo'])
export type ProductCategory = z.infer<typeof productCategorySchema>

/**
 * `active` diz se o produto está publicado; `availability` diz a situação
 * comercial. São eixos diferentes (decisão registrada em docs/architecture.md).
 */
export const availabilitySchema = z.enum(['in_stock', 'pre_order', 'sold_out'])
export type Availability = z.infer<typeof availabilitySchema>

export const specificationsSchema = z
  .object({
    range_km: z.number().positive().optional(),
    top_speed_kmh: z.number().positive().optional(),
    motor_power_w: z.number().positive().optional(),
    battery_v: z.number().positive().optional(),
    battery_ah: z.number().positive().optional(),
    battery_type: z.string().min(1).optional(),
    charge_time_h: z.number().positive().optional(),
    weight_kg: z.number().positive().optional(),
    max_load_kg: z.number().positive().optional(),
    colors: z.array(z.string().min(1)).optional(),
  })
  .strict()
export type Specifications = z.infer<typeof specificationsSchema>

export const productImageSchema = z.object({
  id: z.string().min(1),
  product_id: z.string().min(1),
  /** Id da imagem no manifesto (`src/content/images.json`) ou path no Storage na Fase 3. */
  path: z.string().min(1),
  alt: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
})
export type ProductImage = z.infer<typeof productImageSchema>

/** Colunas da tabela, sem regras cruzadas. Base de onde os outros schemas derivam. */
const productColumns = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug em kebab-case'),
  /** Fabricante (ex.: "Aima"). Fica no modelo pra suportar outra marca depois. */
  brand: z.string().min(1),
  /** Nome do modelo sem a marca (ex.: "X6"). A UI compõe "Aima X6". */
  name: z.string().min(1),
  short_description: z.string().min(1).max(160),
  description: z.string().min(1),
  /** Preço em centavos. `null` quando é sob consulta. */
  price: z.number().int().nonnegative().nullable(),
  price_on_request: z.boolean(),
  category: productCategorySchema,
  availability: availabilitySchema,
  featured: z.boolean(),
  active: z.boolean(),
  sort_order: z.number().int(),
  specifications: specificationsSchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
})

/** Ou tem preço, ou é sob consulta: nunca os dois, nunca nenhum. */
function withPriceInvariant<
  T extends z.ZodObject<{ price: z.ZodType<number | null>; price_on_request: z.ZodBoolean }>,
>(schema: T) {
  return schema.refine((p) => p.price_on_request !== (p.price !== null), {
    message: 'Informe o preço ou marque "sob consulta", nunca os dois nem nenhum',
    path: ['price'],
  })
}

export const productRowSchema = withPriceInvariant(productColumns)
export type ProductRow = z.infer<typeof productRowSchema>

export const productSchema = withPriceInvariant(
  productColumns.extend({ images: z.array(productImageSchema).min(1) }),
)
export type Product = z.infer<typeof productSchema>

export const productInputSchema = withPriceInvariant(
  productColumns.omit({ id: true, created_at: true, updated_at: true }),
)
export type ProductInput = z.infer<typeof productInputSchema>

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  scooter: 'Scooter',
  moto: 'Moto',
  ebike: 'Bike elétrica',
  triciclo: 'Triciclo',
}

/** "Aima X6": marca + modelo, usado em títulos, cards e na mensagem do WhatsApp. */
export function productTitle(product: Pick<Product, 'brand' | 'name'>): string {
  return `${product.brand} ${product.name}`
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  in_stock: 'Pronta entrega',
  pre_order: 'Sob encomenda',
  sold_out: 'Esgotada',
}
