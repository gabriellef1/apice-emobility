import { Link } from 'react-router'

import { Logo } from '@/components/brand/Logo'
import { Container } from '@/components/ui/Container'
import { company } from '@/config/company'
import { cn } from '@/lib/cn'
import { primaryNav } from '@/config/nav'
import { whatsappLink } from '@/lib/whatsapp'

export function Footer() {
  const year = new Date().getFullYear()
  const storeInfo = [
    ['Endereço', company.address],
    ['Horário', company.businessHours],
    ['CNPJ', company.cnpj],
  ].filter((entry): entry is [string, string] => typeof entry[1] === 'string')

  return (
    <footer className="border-t border-white/10 bg-ink-950 text-ink-300">
      <Container
        className={cn(
          'grid gap-10 py-14',
          storeInfo.length ? 'md:grid-cols-[1.4fr_1fr_1fr_1fr]' : 'md:grid-cols-[1.4fr_1fr_1fr]',
        )}
      >
        <div className="max-w-xs">
          <Logo height={40} lockup="always" />
          <p className="mt-5 text-sm leading-relaxed">{company.tagline}.</p>
          <p className="mt-2 text-sm leading-relaxed">
            Revenda de motos elétricas. Atendimento por WhatsApp e e-mail.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="eyebrow text-white">Navegação</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="rounded-sm hover:text-white" viewTransition>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-white">Contato</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm hover:text-white"
              >
                {company.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="rounded-sm break-all hover:text-white">
                {company.email}
              </a>
            </li>
          </ul>
        </div>

        {storeInfo.length > 0 && (
          <div>
            <h2 className="eyebrow text-white">Loja</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              {storeInfo.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-ink-500">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. Todos os direitos reservados.
          </p>
          <p>Fotos ilustrativas via Unsplash. Não retratam os modelos à venda.</p>
        </Container>
      </div>
    </footer>
  )
}
