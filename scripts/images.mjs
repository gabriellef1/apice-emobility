/**
 * Baixa as fotos ilustrativas listadas em src/content/images.json e gera as
 * variantes WebP em public/images. Os originais ficam em .cache/images (fora do git).
 *
 * Uso: node scripts/images.mjs
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const MANIFEST = 'src/content/images.json'
const CACHE = '.cache/images'
const OUT = 'public/images'
const SOURCE_WIDTH = 2400
const COVER_WIDTHS = [480, 960, 1440]
const WIDE_WIDTHS = [960, 1600, 2000]
const QUALITY = 76

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function download(unsplashId, target) {
  if (await exists(target)) return
  const url = `https://unsplash.com/photos/${unsplashId}/download?force=true&w=${SOURCE_WIDTH}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Falha ao baixar ${unsplashId}: HTTP ${res.status}`)
  await writeFile(target, Buffer.from(await res.arrayBuffer()))
}

async function variant(source, id, width, ratio) {
  const [rw, rh] = ratio
  const height = Math.round((width * rh) / rw)
  const file = path.join(OUT, `${id}-${width}.webp`)
  await sharp(source)
    .resize(width, height, { fit: 'cover', position: 'attention' })
    .webp({ quality: QUALITY })
    .toFile(file)
  return file
}

async function main() {
  await mkdir(CACHE, { recursive: true })
  await mkdir(OUT, { recursive: true })
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))

  for (const image of manifest.images) {
    const original = path.join(CACHE, `${image.unsplashId}.jpg`)
    await download(image.unsplashId, original)
    for (const width of COVER_WIDTHS) await variant(original, image.id, width, [4, 3])
    if (image.wide) {
      for (const width of WIDE_WIDTHS) await variant(original, `${image.id}-wide`, width, [16, 9])
    }
    console.log('ok', image.id)
  }
  await ogDefault(manifest)
}

/** Imagem OG padrão (1200x630): foto do hero escurecida + lockup da marca. */
async function ogDefault(manifest) {
  const hero = manifest.images.find((image) => image.id === manifest.ogImage)
  if (!hero) return
  const photo = await sharp(path.join(CACHE, `${hero.unsplashId}.jpg`))
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .modulate({ brightness: 0.55 })
    .toBuffer()
  const lockup = await sharp('src/assets/brand/lockup-stacked.png')
    .resize({ height: 220 })
    .toBuffer()
  await sharp(photo)
    .composite([{ input: lockup, left: 72, top: 64 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join('public', 'og-default.png'))
  console.log('ok og-default')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
