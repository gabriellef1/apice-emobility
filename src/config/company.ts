/**
 * Dados oficiais da empresa. Único lugar com contato e informação institucional.
 * Campos com `null` ainda não foram informados pela Ápice: a UI mostra um
 * placeholder claro em vez de inventar.
 */
export const company = {
  name: 'Ápice E-Mobility',
  shortName: 'Ápice',
  tagline: 'Motos elétricas para novos caminhos',
  email: 'contatoemobility@gmail.com',
  whatsapp: {
    /** E.164, sem "+": usado no link wa.me. */
    e164: '5531992645742',
    display: '+55 31 99264-5742',
  },
  /** Dados institucionais pendentes de confirmação com a empresa. */
  address: null as string | null,
  cnpj: null as string | null,
  businessHours: null as string | null,
  social: {
    instagram: null as string | null,
  },
} as const

export type Company = typeof company
