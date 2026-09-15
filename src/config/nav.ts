export interface NavItem {
  label: string
  to: string
}

export const primaryNav: readonly NavItem[] = [
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Por que elétrica', to: '/#por-que-eletrica' },
  { label: 'Sobre', to: '/#sobre' },
  { label: 'Contato', to: '/#contato' },
]
