import { describe, expect, it } from 'vitest'

import { company } from '@/config/company'
import { formatPower } from '@/features/product/lib/specs'

import { formatPriceBRL } from './format'
import { whatsappLink, whatsappMessage } from './whatsapp'

describe('whatsapp', () => {
  it('monta a mensagem contextual com o nome do modelo', () => {
    expect(whatsappMessage('Ápice GT-R')).toBe(
      'Olá! Tenho interesse na Ápice GT-R e gostaria de saber mais informações.',
    )
  })

  it('usa o número oficial e codifica o texto', () => {
    const url = new URL(whatsappLink('Ápice GT-R'))
    expect(url.origin + url.pathname).toBe(`https://wa.me/${company.whatsapp.e164}`)
    expect(url.searchParams.get('text')).toBe(whatsappMessage('Ápice GT-R'))
    expect(url.searchParams.has('utm_source')).toBe(false)
  })

  it('tem mensagem genérica sem modelo', () => {
    expect(whatsappMessage()).toContain('Olá!')
  })
})

describe('format', () => {
  it('formata centavos em BRL sem decimais', () => {
    // Intl usa espaço não separável entre símbolo e valor.
    expect(formatPriceBRL(1899000).replace(/\s/g, ' ')).toBe('R$ 18.990')
  })

  it('mostra potência em kW a partir de 1000 W', () => {
    expect(formatPower(12000)).toBe('12 kW')
    expect(formatPower(2500)).toBe('2,5 kW')
    expect(formatPower(800)).toBe('800 W')
  })
})
