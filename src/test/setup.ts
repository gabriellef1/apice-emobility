import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

// jsdom não implementa <dialog>.showModal/close: polyfill mínimo pros testes de drawer.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

// motion usa IntersectionObserver em whileInView.
if (typeof IntersectionObserver === 'undefined') {
  class IO {
    observe() {
      // noop: nada entra na viewport no jsdom
    }
    unobserve() {
      // noop
    }
    disconnect() {
      // noop
    }
    takeRecords() {
      return []
    }
  }
  Object.defineProperty(globalThis, 'IntersectionObserver', { value: IO, writable: true })
}
