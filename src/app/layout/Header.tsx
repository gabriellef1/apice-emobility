import { Menu, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Drawer } from '@/components/ui/Drawer'
import { primaryNav } from '@/config/nav'
import { cn } from '@/lib/cn'
import { whatsappLink } from '@/lib/whatsapp'

const desktopLink = (isActive: boolean) =>
  cn(
    'duration-fast rounded-sm px-3 py-2 text-sm font-medium tracking-tight transition-colors',
    isActive ? 'text-white' : 'text-ink-300 hover:text-white',
  )

const mobileLink = (isActive: boolean) =>
  cn('block py-4 text-xl font-display', isActive ? 'text-brand-600' : 'text-ink-900')

/** Links com hash apontam pra seções da home; não têm estado "ativo" próprio. */
function NavItemLink({
  to,
  label,
  className,
  onNavigate,
}: {
  to: string
  label: string
  className: (active: boolean) => string
  onNavigate?: () => void
}) {
  if (to.includes('#')) {
    return (
      <Link to={to} className={className(false)} onClick={onNavigate}>
        {label}
      </Link>
    )
  }
  return (
    <NavLink to={to} className={({ isActive }) => className(isActive)} onClick={onNavigate}>
      {label}
    </NavLink>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950 text-white">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex shrink-0 items-center rounded-sm"
          aria-label="Ápice E-Mobility, início"
        >
          <Logo height={34} />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavItemLink to={item.to} label={item.label} className={desktopLink} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            className="md:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" aria-hidden />
          </Button>
        </div>
      </Container>

      <Drawer open={menuOpen} onClose={closeMenu} title="Menu" closeLabel="Fechar menu">
        <nav aria-label="Principal (mobile)">
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.to} className="border-b border-ink-200">
                <NavItemLink
                  to={item.to}
                  label={item.label}
                  className={mobileLink}
                  onNavigate={closeMenu}
                />
              </li>
            ))}
          </ul>
        </nav>
        <Button
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full"
        >
          <MessageCircle className="size-4" aria-hidden />
          Falar no WhatsApp
        </Button>
      </Drawer>
    </header>
  )
}
