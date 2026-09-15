import { motion } from 'motion/react'
import { type ReactNode } from 'react'

type Tag = 'div' | 'li' | 'section'

interface RevealProps {
  children: ReactNode
  as?: Tag
  className?: string
  /** Atraso em segundos, pra stagger manual entre irmãos. */
  delay?: number
}

const tags = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
} as const

/**
 * Entrada editorial: fade + 12px pra cima, uma vez, quando entra na viewport.
 * MotionConfig reducedMotion="user" (no RootLayout) desliga o deslocamento.
 */
export function Reveal({ children, as = 'div', className, delay = 0 }: RevealProps) {
  const Component = tags[as]
  return (
    <Component
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}
