import { motion, useReducedMotion, type Variants } from 'motion/react'

import { easeOutExpo, stagger } from '@/lib/motion'

interface SplitTextProps {
  text: string
  /** Elemento de bloco que recebe o texto (h2, p...). */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  id?: string
  className?: string
  delay?: number
  /** `blur`: cada palavra sai de um desfoque (estudo do BlurText). `line`: sobe de uma linha recortada. */
  effect?: 'blur' | 'line'
}

const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const

const container = (delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger.lines * 0.7, delayChildren: delay } },
})

const blurWord: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeOutExpo },
  },
}

const lineWord: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: easeOutExpo } },
}

const fadeWord: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

/**
 * Título revelado palavra a palavra quando entra na viewport. Reimplementação
 * em Motion do padrão SplitText/BlurText (ReactBits) e text-split-reveal
 * (21st.dev): sem dependência, com as curvas dos tokens e respeitando
 * prefers-reduced-motion (vira fade por palavra). Leitores de tela recebem o
 * texto inteiro pelo aria-label; as palavras ficam aria-hidden.
 */
export function SplitText({
  text,
  as = 'h2',
  id,
  className,
  delay = 0,
  effect = 'blur',
}: SplitTextProps) {
  const Component = tags[as]
  const reduced = useReducedMotion()
  const word = reduced ? fadeWord : effect === 'line' ? lineWord : blurWord
  const words = text.split(' ')

  return (
    <Component
      id={id}
      aria-label={text}
      variants={container(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className={className}
    >
      {words.map((w, index) => (
        <span
          key={`${w}-${index}`}
          aria-hidden
          className={
            effect === 'line'
              ? 'inline-block overflow-hidden pb-[0.08em] align-bottom'
              : 'inline-block'
          }
        >
          <motion.span variants={word} className="inline-block will-change-transform">
            {w}
          </motion.span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Component>
  )
}
