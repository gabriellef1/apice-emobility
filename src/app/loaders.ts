import { type LoaderFunctionArgs } from 'react-router'

import { catalogService, type Product } from '@/services/catalog'

/**
 * Loaders das rotas. Ficam fora dos componentes pra manter o Fast Refresh e
 * porque a Fase 3 troca só o serviço, não as páginas.
 */

export async function homeLoader(): Promise<{ products: Product[] }> {
  return { products: await catalogService.list() }
}

export async function catalogLoader(): Promise<{ products: Product[] }> {
  return { products: await catalogService.list() }
}

export async function productLoader({ params }: LoaderFunctionArgs): Promise<{ product: Product }> {
  const product = params.slug ? await catalogService.getBySlug(params.slug) : null
  if (!product) {
    throw new Response('Produto não encontrado', { status: 404 })
  }
  return { product }
}
