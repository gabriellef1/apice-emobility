import { type ComponentPropsWithoutRef, type ElementType } from 'react'

import { cn } from '@/lib/cn'

type ContainerProps<T extends ElementType> = {
  as?: T
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

/** Largura de página e gutter lateral. 16px no mobile, mais nos breakpoints maiores. */
export function Container<T extends ElementType = 'div'>({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? 'div'
  return (
    <Component
      className={cn('mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
}
