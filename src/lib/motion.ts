/**
 * Tokens de movimento. Mesmas curvas do CSS (tokens.css) pra Motion e
 * transições nativas falarem a mesma língua.
 */

/** Saída forte, chegada suave: entradas de seção, fotos, texto. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const
/** Curta e firme: hover, seta, borda. */
export const easeSnap = [0.2, 0.8, 0.2, 1] as const
/** Compatibilidade com o nome antigo. */
export const revealEase = easeOutExpo

export const duration = {
  fast: 0.2,
  base: 0.45,
  slow: 0.9,
  wipe: 1.1,
} as const

/** Passo de stagger entre irmãos (linhas de texto, cards, pontos). */
export const stagger = {
  lines: 0.09,
  cards: 0.07,
  blocks: 0.14,
} as const

/** Clip-path de revelação: fecha à esquerda, abre até o fim. */
export const wipeFromLeft = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: { clipPath: 'inset(0 0% 0 0)' },
} as const

export const wipeFromRight = {
  hidden: { clipPath: 'inset(0 0 0 100%)' },
  visible: { clipPath: 'inset(0 0 0 0%)' },
} as const

export const wipeFromBottom = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)' },
} as const
