import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'

import { captureAttribution } from '@/features/leads/lib/attribution'

import { DemoNotice } from './DemoNotice'
import { Footer } from './Footer'
import { Header } from './Header'

export function RootLayout() {
  useEffect(() => {
    try {
      captureAttribution(window.sessionStorage, window.location, document.referrer)
    } catch {
      // sessionStorage indisponível (modo privado, bloqueio): segue sem atribuição.
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <DemoNotice />
      <main id="conteudo" className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </MotionConfig>
  )
}
