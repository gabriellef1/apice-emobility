import { Link } from 'react-router'

import { Logo } from '@/components/brand/Logo'
import { Container } from '@/components/ui/Container'
import { company } from '@/config/company'
import { primaryNav } from '@/config/nav'
import { whatsappLink } from '@/lib/whatsapp'

const PENDING = 'A confirmar'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-ink-950 text-ink-300">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo height={40} />
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
                <Link to={item.to} className="rounded-sm hover:text-white">
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

        <div>
          <h2 className="eyebrow text-white">Loja</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div>
              <dt className="text-ink-500">Endereço</dt>
              <dd>{company.address ?? PENDING}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Horário</dt>
              <dd>{company.businessHours ?? PENDING}</dd>
            </div>
            <div>
              <dt className="text-ink-500">CNPJ</dt>
              <dd>{company.cnpj ?? PENDING}</dd>
            </div>
          </dl>
        </div>
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
