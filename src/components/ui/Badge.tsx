import { type ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'success' | 'warning' | 'muted' | 'brand'

const tones: Record<Tone, string> = {
  neutral: 'text-ink-700 before:bg-ink-500',
  success: 'text-success-600 before:bg-success-600',
  warning: 'text-warning-600 before:bg-warning-600',
  muted: 'text-ink-500 before:bg-ink-300',
  brand: 'text-brand-600 before:bg-brand-500',
}

interface BadgeProps {
  tone?: Tone
  className?: string
  children: ReactNode
}

/** Rótulo curto com ponto colorido. Sem fundo, sem cápsula. */
export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 eyebrow before:size-1.5 before:rounded-full before:content-[""]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
