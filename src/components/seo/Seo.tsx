import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { site } from '@/config/site'

interface SeoProps {
  title?: string
  description?: string
  /** Caminho público da imagem OG (já com base), ou URL absoluta. */
  image?: string
  type?: 'website' | 'product'
}

/** Torna absoluta uma URL pública; sem VITE_SITE_URL não dá pra montar OG. */
function absolute(path: string): string | undefined {
  if (/^https?:\/\//.test(path)) return path
  return site.url ? `${site.url}${path}` : undefined
}

/**
 * Metadados por rota. React 19 eleva <title> e <meta> pro <head> sozinho,
 * sem biblioteca. Os tags estáticos do index.html (fallback sem JS) são
 * removidos na primeira renderização pra não duplicar.
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
  const ogImage = absolute(image ?? `${site.basePath}og-default.png`)

  useEffect(() => {
    document.head.querySelectorAll('[data-static-seo]').forEach((el) => {
      el.remove()
    })
  }, [])

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
