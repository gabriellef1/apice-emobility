import { expect, type Page, test } from '@playwright/test'

/**
 * Regressão de overflow horizontal. Não confia em scrollWidth do documento:
 * percorre todos os elementos e reprova qualquer um que passe da viewport,
 * antes de rolar (estado inicial das animações) e depois de rolar tudo.
 * Elementos dentro de um trilho com overflow-x auto/scroll/hidden/clip são
 * ignorados, porque o ancestral contém o excesso.
 */
const WIDTHS = [320, 360, 375, 390, 768]
const PAGES = ['/', '/catalogo', '/produto/aima-x6', '/catalogo?categoria=scooter', '/nao-existe']

interface Offender {
  selector: string
  left: number
  right: number
}

async function findOffenders(page: Page): Promise<Offender[]> {
  return page.evaluate(() => {
    const vw = window.innerWidth
    const clipped = new Set(['auto', 'scroll', 'hidden', 'clip'])
    const selectorOf = (el: Element) => {
      const parts: string[] = []
      let node: Element | null = el
      while (node && node !== document.body && parts.length < 4) {
        const cls = [...node.classList].slice(0, 2).join('.')
        parts.unshift(node.tagName.toLowerCase() + (node.id ? `#${node.id}` : cls ? `.${cls}` : ''))
        node = node.parentElement
      }
      return parts.join(' > ')
    }
    const isContained = (el: Element) => {
      let node = el.parentElement
      while (node && node !== document.documentElement) {
        if (clipped.has(getComputedStyle(node).overflowX)) return true
        node = node.parentElement
      }
      return false
    }
    const offenders: Offender[] = []
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue
      if (el.closest('dialog:not([open])')) continue
      // sr-only: 1px recortado fora da tela, não gera scroll
      if (cs.position === 'absolute' && cs.width === '1px' && cs.height === '1px') continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      if ((r.right > vw + 0.5 || r.left < -0.5) && !isContained(el)) {
        offenders.push({
          selector: selectorOf(el),
          left: Math.round(r.left),
          right: Math.round(r.right),
        })
      }
    }
    return offenders.slice(0, 12)
  })
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight
    for (let y = 0; y < total; y += 300) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
  })
  await page.waitForTimeout(1200)
}

for (const width of WIDTHS) {
  for (const path of PAGES) {
    test(`sem overflow horizontal em ${width}px: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(path, { waitUntil: 'networkidle' })
      await page.waitForTimeout(300)

      const before = await findOffenders(page)
      expect(before, `antes de rolar (${width}px ${path})`).toEqual([])

      await scrollThrough(page)
      const after = await findOffenders(page)
      expect(after, `depois de rolar (${width}px ${path})`).toEqual([])

      const docOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(docOverflow, 'scrollWidth do documento').toBeLessThanOrEqual(0)
    })
  }
}
