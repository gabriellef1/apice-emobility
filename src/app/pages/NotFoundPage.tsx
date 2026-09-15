import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

interface NotFoundPageProps {
  title?: string
  message?: string
}

export function NotFoundPage({
  title = 'Página não encontrada',
  message = 'O endereço pode ter mudado ou o modelo saiu do catálogo.',
}: NotFoundPageProps) {
  return (
    <>
      <Seo title={title} />
      <Container className="py-24 text-center lg:py-32">
        <p className="eyebrow text-brand-600">Erro 404</p>
        <h1 className="mt-3 text-display-md font-display text-ink-950">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-600">{message}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/catalogo">Ver catálogo</Button>
          <Button to="/" variant="outline">
            Início
          </Button>
        </div>
      </Container>
    </>
  )
}

/** Trata erros de loader: 404 vira página amigável, o resto mostra mensagem genérica. */
export function RouteErrorPage() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage title="Modelo não encontrado" />
  }
  return (
    <NotFoundPage
      title="Algo deu errado"
      message="Não conseguimos carregar esta página. Tente novamente em instantes."
    />
  )
}
