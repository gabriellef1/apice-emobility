import { company } from '@/config/company'
import { site } from '@/config/site'
import { type Product, productTitle } from '@/services/catalog'

interface ProductJsonLdProps {
  product: Product
  /** Caminho público da imagem principal (já com base). */
  image?: string
}

const availabilityUrl: Record<Product['availability'], string> = {
  in_stock: 'https://schema.org/InStock',
  pre_order: 'https://schema.org/PreOrder',
  sold_out: 'https://schema.org/SoldOut',
}

/**
 * Schema.org Product. Só inclui `offers` quando há preço; "sob consulta" não
 * vira oferta com valor. Sem VITE_SITE_URL a imagem fica relativa (aceito).
 */
export function ProductJsonLd({ product, image }: ProductJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productTitle(product),
    brand: { '@type': 'Brand', name: product.brand },
    description: product.short_description,
    category: product.category,
  }
  if (image) data.image = site.url ? `${site.url}${image}` : image
  if (!product.price_on_request && product.price !== null) {
    data.offers = {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: (product.price / 100).toFixed(2),
      availability: availabilityUrl[product.availability],
      seller: { '@type': 'Organization', name: company.name },
    }
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}
