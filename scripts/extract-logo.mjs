/**
 * Extrai os assets de marca a partir do PNG original das propostas de logo.
 *
 * Não redesenha nada: recorta a opção 1 (monograma A + wordmark) e converte o
 * fundo preto em transparência por un-premultiply (alpha = canal máximo,
 * cor dividida pelo alpha). Compor sobre preto devolve o pixel original.
 *
 * Uso: node scripts/extract-logo.mjs [caminho/do/logos.png]
 * Saída: src/assets/brand/*.png e public/favicon-*.png
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = process.argv[2] ?? 'C:/Users/gabri/Downloads/logos.png'
const OUT_BRAND = 'src/assets/brand'
const OUT_PUBLIC = 'public'

// Nível abaixo do qual o pixel é fundo (textura do PNG original fica <= 13).
const BG_LEVEL = 14

// Regiões (px) da opção 1 no PNG original 1536x1024, medidas por histograma.
const REGIONS = {
  symbol: { left: 50, top: 276, width: 416, height: 255 },
  wordmark: { left: 50, top: 543, width: 416, height: 124 },
  lockup: { left: 50, top: 276, width: 416, height: 391 },
}

const FAVICON_SIZES = [16, 32, 48, 180, 192, 512]
const DARK = { r: 10, g: 10, b: 10, alpha: 1 }

async function unpremultiply(region) {
  const { data, info } = await sharp(SOURCE)
    .extract(region)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const out = Buffer.alloc(info.width * info.height * 4)
  for (let i = 0, o = 0; i < data.length; i += info.channels, o += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const alpha = max <= BG_LEVEL ? 0 : Math.min(1, (max - BG_LEVEL) / (255 - BG_LEVEL))
    const scale = max > 0 ? 255 / max : 0
    out[o] = Math.min(255, Math.round(r * scale))
    out[o + 1] = Math.min(255, Math.round(g * scale))
    out[o + 2] = Math.min(255, Math.round(b * scale))
    out[o + 3] = Math.round(alpha * 255)
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function main() {
  await mkdir(OUT_BRAND, { recursive: true })
  await mkdir(OUT_PUBLIC, { recursive: true })

  const symbol = await unpremultiply(REGIONS.symbol)
  const wordmark = await unpremultiply(REGIONS.wordmark)
  const lockup = await unpremultiply(REGIONS.lockup)

  await sharp(symbol).toFile(path.join(OUT_BRAND, 'symbol.png'))
  await sharp(wordmark).toFile(path.join(OUT_BRAND, 'wordmark.png'))
  await sharp(lockup).toFile(path.join(OUT_BRAND, 'lockup-stacked.png'))

  // Lockup horizontal (header): símbolo à esquerda, wordmark à direita, alinhados pelo centro.
  const sMeta = await sharp(symbol).metadata()
  const wMeta = await sharp(wordmark).metadata()
  const gap = Math.round(sMeta.height * 0.18)
  const wordmarkScaled = await sharp(wordmark)
    .resize({ height: Math.round(sMeta.height * 0.62) })
    .toBuffer()
  const wsMeta = await sharp(wordmarkScaled).metadata()
  const width = sMeta.width + gap + wsMeta.width
  const height = sMeta.height
  await sharp({
    create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: symbol, left: 0, top: 0 },
      {
        input: wordmarkScaled,
        left: sMeta.width + gap,
        top: Math.round((height - wsMeta.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_BRAND, 'lockup-horizontal.png'))

  // Favicons: símbolo centralizado num quadrado escuro (funciona em aba clara e escura).
  for (const size of FAVICON_SIZES) {
    const inner = Math.round(size * 0.78)
    const icon = await sharp(symbol)
      .resize({
        width: inner,
        height: inner,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer()
    await sharp({ create: { width: size, height: size, channels: 4, background: DARK } })
      .composite([{ input: icon, gravity: 'centre' }])
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT_PUBLIC, `favicon-${size}.png`))
  }

  console.log('Assets gerados em', OUT_BRAND, 'e', OUT_PUBLIC)
  console.log(
    'symbol',
    sMeta.width,
    'x',
    sMeta.height,
    '| wordmark',
    wMeta.width,
    'x',
    wMeta.height,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
