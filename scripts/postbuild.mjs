/**
 * Gera em dist/ os arquivos que dependem da base do site:
 * - 404.html: redirect de deep-link no GitHub Pages (spa-github-pages, MIT)
 * - site.webmanifest: ícones com o prefixo certo
 * - robots.txt e sitemap.xml (rotas estáticas; URLs de produto entram quando
 *   houver hospedagem com rewrite ou prerender, já que o Pages responde 404 nelas)
 *
 * Roda automaticamente após `vite build` (script "postbuild").
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from 'vite'

const DIST = 'dist'
// Mesma resolução de env do vite.config.ts (.env + variáveis do processo).
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')
const base = normalizeBase(env.VITE_BASE_PATH || '/')
const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '')
const segmentsToKeep = base.split('/').filter(Boolean).length

function normalizeBase(value) {
  let b = value.trim()
  if (!b.startsWith('/')) b = `/${b}`
  if (!b.endsWith('/')) b = `${b}/`
  return b
}

const notFoundHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Ápice E-Mobility</title>
    <meta name="robots" content="noindex" />
    <script>
      // GitHub Pages não faz rewrite pra SPA. Guarda a rota na query e volta pro index,
      // que a restaura antes do React Router iniciar (ver index.html).
      // Fonte: https://github.com/rafgraph/spa-github-pages (MIT)
      var pathSegmentsToKeep = ${segmentsToKeep}
      var l = window.location
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      )
    </script>
  </head>
  <body></body>
</html>
`

const manifest = {
  name: 'Ápice E-Mobility',
  short_name: 'Ápice',
  start_url: base,
  display: 'browser',
  background_color: '#0a0a0b',
  theme_color: '#0a0a0b',
  icons: [
    { src: `${base}favicon-192.png`, sizes: '192x192', type: 'image/png' },
    { src: `${base}favicon-512.png`, sizes: '512x512', type: 'image/png' },
  ],
}

const staticRoutes = ['', 'catalogo']

function sitemap() {
  if (!siteUrl) return null
  const urls = staticRoutes
    .map((route) => `  <url><loc>${siteUrl}${base}${route}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function robots() {
  const lines = ['User-agent: *', 'Allow: /', `Disallow: ${base}admin`]
  if (siteUrl) lines.push(`Sitemap: ${siteUrl}${base}sitemap.xml`)
  return `${lines.join('\n')}\n`
}

async function main() {
  await readFile(path.join(DIST, 'index.html'))
  await writeFile(path.join(DIST, '404.html'), notFoundHtml)
  await writeFile(path.join(DIST, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`)
  await writeFile(path.join(DIST, 'robots.txt'), robots())
  const xml = sitemap()
  if (xml) await writeFile(path.join(DIST, 'sitemap.xml'), xml)
  console.log(
    `postbuild: base=${base} segments=${segmentsToKeep} site=${siteUrl || '(sem VITE_SITE_URL, sem sitemap)'}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
