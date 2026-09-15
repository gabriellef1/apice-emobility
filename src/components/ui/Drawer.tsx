import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, type SyntheticEvent, useEffect, useRef } from 'react'

import { Button } from './Button'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  closeLabel?: string
}

/**
 * Painel lateral sobre <dialog> nativo: foco preso, Esc, fundo inerte e
 * devolução do foco vêm do navegador. Motion só anima entrada e saída; o
 * dialog só fecha de fato quando a saída termina.
 */
export function Drawer({ open, onClose, title, children, closeLabel = 'Fechar' }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    // Esc: fecha com animação em vez de sumir na hora.
    event.preventDefault()
    onClose()
  }

  function handleExitComplete() {
    const dialog = dialogRef.current
    if (dialog?.open) dialog.close()
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      aria-label={title}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-transparent"
    >
      <AnimatePresence onExitComplete={handleExitComplete}>
        {open && (
          <>
            <motion.button
              key="backdrop"
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 cursor-default bg-ink-950/60"
            />
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-paper-50 text-ink-900 shadow-drawer"
            >
              <header className="flex h-16 shrink-0 items-center justify-between border-b border-ink-200 px-4">
                <h2 className="text-lg font-display">{title}</h2>
                <Button variant="ghost" size="sm" onClick={onClose} aria-label={closeLabel}>
                  <X className="size-5" aria-hidden />
                </Button>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </dialog>
  )
}
