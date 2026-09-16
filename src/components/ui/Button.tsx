import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Link } from 'react-router'

import { cn } from '@/lib/cn'

type Variant = 'primary' | 'dark' | 'outline' | 'outline-light' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-md font-medium tracking-tight transition-colors duration-base ease-out-expo select-none disabled:pointer-events-none disabled:opacity-50'

/**
 * Preenchimento que desliza da esquerda no hover e no foco por teclado
 * (estudo de micro de botão do Uiverse, reimplementado em CSS puro).
 */
const fill =
  'before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-base before:ease-out-expo before:content-[""] hover:before:scale-x-100 focus-visible:before:scale-x-100'

const variants: Record<Variant, string> = {
  primary: `bg-brand-500 text-white before:bg-brand-700 ${fill}`,
  dark: `bg-ink-950 text-white before:bg-ink-700 ${fill}`,
  outline: `border border-ink-900 text-ink-900 before:bg-ink-900 hover:text-white focus-visible:text-white ${fill}`,
  'outline-light': `border border-white/40 text-white before:bg-white hover:border-white hover:text-ink-950 focus-visible:border-white focus-visible:text-ink-950 ${fill}`,
  ghost: 'text-ink-900 hover:bg-ink-100',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type LinkProps = CommonProps & { to: string; href?: never } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'to' | 'className'
  >
type AnchorProps = CommonProps & { href: string; to?: never } & Omit<
    ComponentPropsWithoutRef<'a'>,
    'href' | 'className'
  >
type NativeProps = CommonProps & { to?: never; href?: never } & Omit<
    ComponentPropsWithoutRef<'button'>,
    'className'
  >

export type ButtonProps = LinkProps | AnchorProps | NativeProps

/** Botão ou link com a mesma aparência. Vira <Link> com `to`, <a> com `href`, <button> sem os dois. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props
  const classes = cn(base, variants[variant], sizes[size], className)

  if ('to' in props && props.to !== undefined) {
    const { to, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
    return (
      <Link to={to} className={classes} viewTransition {...rest}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...rest } = props
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
