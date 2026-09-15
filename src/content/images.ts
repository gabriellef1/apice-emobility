import manifest from './images.json'

/**
 * Acesso tipado às fotos ilustrativas. Os arquivos em public/images são gerados
 * por scripts/images.mjs a partir de images.json (fonte, autor e licença de cada
 * uma estão lá). Larguras precisam bater com o script.
 */
export const COVER_WIDTHS = [480, 960, 1440] as const
export const WIDE_WIDTHS = [960, 1600, 2000] as const
const COVER_LARGEST = COVER_WIDTHS[2]
const WIDE_LARGEST = WIDE_WIDTHS[2]

export interface ImageMeta {
  id: string
  unsplashId: string
  author: string
  authorUrl: string
  alt: string
  ratio: string
  wide?: boolean
}

export interface ImageSource {
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
}

const byId = new Map<string, ImageMeta>(manifest.images.map((image) => [image.id, image]))

export const imageLicense = manifest.license

export function getImageMeta(id: string): ImageMeta {
  const meta = byId.get(id)
  if (!meta) throw new Error(`Imagem não registrada em images.json: ${id}`)
  return meta
}

export function listImages(): ImageMeta[] {
  return manifest.images
}

function publicUrl(file: string): string {
  return `${import.meta.env.BASE_URL}images/${file}`
}

/** Variante 4:3 (cards, galeria). */
export function coverImage(id: string, alt?: string): ImageSource {
  const meta = getImageMeta(id)
  return {
    src: publicUrl(`${id}-${COVER_WIDTHS[1]}.webp`),
    srcSet: COVER_WIDTHS.map((w) => `${publicUrl(`${id}-${w}.webp`)} ${w}w`).join(', '),
    width: COVER_LARGEST,
    height: Math.round((COVER_LARGEST * 3) / 4),
    alt: alt ?? meta.alt,
  }
}

/** 16:9 quando a imagem tem variante wide; senão cai pro 4:3. */
export function heroImage(id: string, alt?: string): ImageSource {
  return getImageMeta(id).wide ? wideImage(id, alt) : coverImage(id, alt)
}

/** Variante 16:9 (hero e blocos largos). Só existe pra imagens com `wide: true`. */
export function wideImage(id: string, alt?: string): ImageSource {
  const meta = getImageMeta(id)
  if (!meta.wide) throw new Error(`Imagem sem variante wide: ${id}`)
  return {
    src: publicUrl(`${id}-wide-${WIDE_WIDTHS[1]}.webp`),
    srcSet: WIDE_WIDTHS.map((w) => `${publicUrl(`${id}-wide-${w}.webp`)} ${w}w`).join(', '),
    width: WIDE_LARGEST,
    height: Math.round((WIDE_LARGEST * 9) / 16),
    alt: alt ?? meta.alt,
  }
}
