import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/test/factories'

import { CatalogPage } from './CatalogPage'

const products = [
  makeProduct({ name: 'Scooter A', category: 'scooter', availability: 'in_stock', featured: true }),
  makeProduct({ name: 'Scooter B', category: 'scooter', availability: 'sold_out' }),
  makeProduct({ name: 'Moto C', category: 'moto', availability: 'pre_order' }),
  makeProduct({ name: 'Ebike D', category: 'ebike', availability: 'in_stock', price: 5000000 }),
]

function renderCatalog(initialEntry = '/catalogo') {
  const router = createMemoryRouter(
    [{ path: '/catalogo', Component: CatalogPage, loader: () => ({ products }) }],
    { initialEntries: [initialEntry] },
  )
  render(<RouterProvider router={router} />)
  return router
}

function results() {
  return screen.findByRole('region', { name: 'Resultados' })
}

async function resultNames() {
  const list = await results()
  return within(list)
    .getAllByRole('heading', { level: 3 })
    .map((h) => h.textContent)
}

/** AnimatePresence mantém o card saindo no DOM até a animação acabar. */
async function expectResults(names: string[]) {
  await waitFor(async () => {
    expect(await resultNames()).toEqual(names)
  })
}

describe('CatalogPage', () => {
  it('lê os filtros da URL ao abrir', async () => {
    renderCatalog('/catalogo?categoria=moto')
    expect(await resultNames()).toEqual(['Aima Moto C'])
    const sidebar = screen.getByRole('complementary', { name: 'Filtros' })
    expect(within(sidebar).getByRole('checkbox', { name: /Moto/ })).toBeChecked()
  })

  it('marcar filtro atualiza a URL (replace) e a lista', async () => {
    const user = userEvent.setup()
    const router = renderCatalog()
    expect(await resultNames()).toHaveLength(4)

    const sidebar = screen.getByRole('complementary', { name: 'Filtros' })
    await user.click(within(sidebar).getByRole('checkbox', { name: /Scooter/ }))
    await user.click(within(sidebar).getByRole('checkbox', { name: /Pronta entrega/ }))

    await waitFor(() => {
      expect(router.state.location.search).toBe('?categoria=scooter&disponibilidade=in_stock')
    })
    await expectResults(['Aima Scooter A'])
    expect(router.state.historyAction).toBe('REPLACE')
  })

  it('ordenar por preço grava na URL', async () => {
    const user = userEvent.setup()
    const router = renderCatalog()
    await user.selectOptions(await screen.findByLabelText('Ordenar'), 'preco-desc')
    await waitFor(() => {
      expect(router.state.location.search).toBe('?ordem=preco-desc')
    })
    expect((await resultNames())[0]).toBe('Aima Ebike D')
  })

  it('estado vazio oferece limpar filtros', async () => {
    const user = userEvent.setup()
    const router = renderCatalog('/catalogo?categoria=moto&disponibilidade=sold_out')
    expect(await screen.findByText('Nenhum modelo com esses filtros')).toBeInTheDocument()
    await user.click(within(await results()).getByRole('button', { name: 'Limpar filtros' }))
    await waitFor(() => {
      expect(router.state.location.search).toBe('')
    })
    await waitFor(async () => {
      expect(await resultNames()).toHaveLength(4)
    })
  })

  it('abre o drawer de filtros com os mesmos controles', async () => {
    const user = userEvent.setup()
    renderCatalog()
    await user.click(await screen.findByRole('button', { name: /Filtrar/ }))
    const dialog = screen.getByRole('dialog', { name: 'Filtros' })
    expect(dialog).toHaveAttribute('open')
    expect(within(dialog).getByRole('checkbox', { name: /Moto/ })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Fechar filtros' })).toBeInTheDocument()
  })
})
