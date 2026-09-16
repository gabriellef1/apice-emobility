/**
 * Configuração do site (não da empresa). Base path e URL pública vêm do
 * ambiente pra funcionar no GitHub Pages e em domínio próprio sem mudar código.
 */
export const site = {
  /** Base path do Vite ("/" ou "/<repo>/"). Sempre termina com "/". */
  basePath: import.meta.env.BASE_URL,
  /** Origem pública sem barra final, pra canonical e OG. */
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? '',
  defaultTitle: 'Ápice E-Mobility · Motos elétricas',
  titleTemplate: '%s · Ápice E-Mobility',
  defaultDescription:
    'Ápice E-Mobility, revenda autorizada Aima: scooters, ciclomotores, motos e bikes elétricas. Veja especificações e peça seu orçamento pelo WhatsApp.',
  locale: 'pt_BR',
  /**
   * Enquanto o catálogo usa dados mockados, o site avisa que é demonstrativo.
   * A Fase 3 (Supabase) desliga isto.
   */
  demoCatalog: true,
} as const
