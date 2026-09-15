import { company } from '@/config/company'

/**
 * Mensagem contextual pro WhatsApp. Sem UTM no texto: a origem é capturada
 * à parte (features/leads/attribution) e vai no lead da Fase 3.
 */
export function whatsappMessage(modelName?: string): string {
  if (!modelName)
    return 'Olá! Gostaria de saber mais informações sobre as motos elétricas da Ápice.'
  return `Olá! Tenho interesse na ${modelName} e gostaria de saber mais informações.`
}

export function whatsappLink(modelName?: string): string {
  const text = encodeURIComponent(whatsappMessage(modelName))
  return `https://wa.me/${company.whatsapp.e164}?text=${text}`
}
