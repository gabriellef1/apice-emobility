import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/test/factories'

import { ProductCard } from './ProductCard'

function renderCard(product = makeProduct()) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('mostra nome, categoria, preço, status e 3 specs, e linka pro produto', () => {
    const product = makeProduct({
      name: 'Ápice Teste',
      slug: 'apice-teste',
      category: 'trail',
      availability: 'pre_order',
      price: 2790000,
      specifications: { range_km: 90, top_speed_kmh: 75, motor_power_w: 5000, weight_kg: 78 },
    })
    renderCard(product)

    expect(screen.getByRole('heading', { name: 'Ápice Teste' })).toBeInTheDocument()
    expect(screen.getByText('Trail')).toBeInTheDocument()
    expect(screen.getByText('Sob encomenda')).toBeInTheDocument()
    expect(screen.getByText(/27\.900/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/produto/apice-teste')

    const terms = screen.getAllByRole('term').map((el) => el.textContent)
    expect(terms).toEqual(['Autonomia', 'Velocidade', 'Potência'])
    expect(screen.getByText('5 kW')).toBeInTheDocument()
  })

  it('mostra "Sob consulta" sem preço', () => {
    renderCard(makeProduct({ price: null, price_on_request: true }))
    expect(screen.getByText('Sob consulta')).toBeInTheDocument()
  })

  it('usa alt da imagem do produto', () => {
    renderCard(
      makeProduct({
        images: [
          { id: 'i', product_id: 'p', path: 'detail-front', alt: 'Foto lateral', sort_order: 0 },
        ],
      }),
    )
    expect(screen.getByRole('img', { name: 'Foto lateral' })).toHaveAttribute('loading', 'lazy')
  })
})
