import { useLocation } from 'react-router'

import { site } from '@/config/site'

interface SeoProps {
  title?: string
  description?: string
  /** Caminho absoluto de uma imagem OG (1200x630 idealmente). */
  image?: string
  type?: 'website' | 'product'
}

/**
 * Metadados por rota. React 19 eleva <title> e <meta> pro <head> sozinho,
 * sem biblioteca. Canonical usa VITE_SITE_URL + base + rota atual.
 */
export function Seo({
  title,
  description = site.defaultDescription,
  image,
  type = 'website',
}: SeoProps) {
  const { pathname } = useLocation()
  const fullTitle = title ? site.titleTemplate.replace('%s', title) : site.defaultTitle
  const canonical = site.url
    ? `${site.url}${site.basePath}${pathname.replace(/^\//, '')}`
    : undefined
  const ogImage = image ?? (site.url ? `${site.url}${site.basePath}og-default.png` : undefined)

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:site_name" content="Ápice E-Mobility" />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
    </>
  )
}
