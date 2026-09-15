import { Container } from '@/components/ui/Container'
import { site } from '@/config/site'

/** Aviso enquanto o catálogo é mock. Some quando `site.demoCatalog` for false. */
export function DemoNotice() {
  if (!site.demoCatalog) return null
  return (
    <div className="border-b border-ink-200 bg-paper-200 text-ink-600">
      <Container className="py-2 text-xs leading-snug">
        Catálogo demonstrativo: modelos, preços e fotos são ilustrativos e serão substituídos pelos
        dados oficiais da Ápice.
      </Container>
    </div>
  )
}
