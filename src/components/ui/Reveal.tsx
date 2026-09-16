import { motion } from 'motion/react'
import { type ReactNode } from 'react'

import { revealEase } from '@/lib/motion'

type Tag = 'div' | 'li' | 'section'

interface RevealProps {
  children: ReactNode
  as?: Tag
  id?: string
  className?: string
  /** Atraso em segundos, pra stagger entre irmãos. */
  delay?: number
  /** Deslocamento inicial em px. Padrão: sobe 28px. */
  x?: number
  y?: number
}

const tags = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
} as const

/**
 * Entrada editorial: opacidade + deslocamento visível, uma vez, quando 15% do
 * elemento entra na viewport. MotionConfig reducedMotion="user" (no RootLayout)
 * mantém só o fade pra quem pede menos movimento.
 */
export function Reveal({
  children,
  as = 'div',
  id,
  className,
  delay = 0,
  x = 0,
  y = 28,
}: RevealProps) {
  const Component = tags[as]
  return (
    <Component
      id={id}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: revealEase }}
      className={className}
    >
      {children}
    </Component>
  )
}
