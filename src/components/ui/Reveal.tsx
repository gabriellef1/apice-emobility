import { motion, type Variants } from 'motion/react'
import { type ReactNode } from 'react'

import { duration, easeOutExpo, wipeFromBottom, wipeFromLeft, wipeFromRight } from '@/lib/motion'

type Tag = 'div' | 'li' | 'section' | 'span' | 'p'

const tags = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
  span: motion.span,
  p: motion.p,
} as const

interface RevealProps {
  children: ReactNode
  as?: Tag
  id?: string
  className?: string
  /** Atraso em segundos, pra stagger entre irmãos. */
  delay?: number
  /**
   * `rise` (padrão): sobe 32px com fade. `wipe-left|right|up`: revelação por
   * máscara (clip-path), sem deslocar layout, pra fotos e acentos.
   */
  effect?: 'rise' | 'wipe-left' | 'wipe-right' | 'wipe-up'
  /** Quanto do elemento precisa aparecer pra disparar (0-1). */
  amount?: number
}

const rise: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

const effects: Record<NonNullable<RevealProps['effect']>, Variants> = {
  rise,
  'wipe-left': wipeFromLeft,
  'wipe-right': wipeFromRight,
  'wipe-up': wipeFromBottom,
}

/**
 * Entrada editorial, uma vez, quando entra na viewport. Nunca usa translateX:
 * deslocamento lateral em estado inicial vira overflow horizontal no celular.
 * MotionConfig reducedMotion="user" (no RootLayout) mantém só o fade.
 */
export function Reveal({
  children,
  as = 'div',
  id,
  className,
  delay = 0,
  effect = 'rise',
  amount = 0.15,
}: RevealProps) {
  const Component = tags[as]
  const isWipe = effect !== 'rise'
  const transition = {
    duration: isWipe ? duration.wipe : duration.slow,
    delay,
    ease: easeOutExpo,
  }

  if (!isWipe) {
    return (
      <Component
        id={id}
        variants={rise}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount }}
        transition={transition}
        className={className}
      >
        {children}
      </Component>
    )
  }

  // Máscara: quem observa a viewport é o wrapper sem clip-path (o Chrome
  // desconta o clip-path no cálculo de interseção e o elemento recortado a
  // 100% nunca "entra"). O filho herda a variante e anima o recorte.
  return (
    <Component
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      className={className}
    >
      <motion.div variants={effects[effect]} transition={transition} className="h-full">
        {children}
      </motion.div>
    </Component>
  )
}
