import { createBrowserRouter } from 'react-router'

import { HydrateFallback } from './layout/HydrateFallback'
import { RootLayout } from './layout/RootLayout'
import { catalogLoader, homeLoader, productLoader } from './loaders'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage, RouteErrorPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'

/**
 * `basename` vem da base do Vite, então as rotas ficam iguais no GitHub Pages
 * ("/<repo>/") e no domínio próprio ("/"). Deep-link no Pages passa pelo
 * dist/404.html gerado no postbuild, que devolve a rota via query string
 * (ver index.html).
 */

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: RootLayout,
      ErrorBoundary: RouteErrorPage,
      HydrateFallback,
      children: [
        { index: true, Component: HomePage, loader: homeLoader },
        { path: 'catalogo', Component: CatalogPage, loader: catalogLoader },
        {
          path: 'produto/:slug',
          Component: ProductPage,
          loader: productLoader,
          ErrorBoundary: RouteErrorPage,
        },
        { path: '*', Component: NotFoundPage },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)
