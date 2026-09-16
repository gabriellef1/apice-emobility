import { ChevronDown } from 'lucide-react'

import { SORT_LABELS, type SortOrder, sortOrderSchema } from '../lib/query'

interface SortSelectProps {
  value: SortOrder
  onChange: (order: SortOrder) => void
  id?: string
}

export function SortSelect({ value, onChange, id = 'ordenacao' }: SortSelectProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <label htmlFor={id} className="shrink-0 text-sm text-ink-500">
        Ordenar
      </label>
      <div className="relative min-w-0 flex-1 sm:flex-none">
        <select
          id={id}
          value={value}
          onChange={(event) => {
            const parsed = sortOrderSchema.safeParse(event.target.value)
            if (parsed.success) onChange(parsed.data)
          }}
          className="h-10 w-full cursor-pointer appearance-none rounded-md border border-ink-300 bg-white py-0 pr-9 pl-3 text-sm font-medium text-ink-900 hover:border-ink-500 sm:w-auto"
        >
          {sortOrderSchema.options.map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-500"
          aria-hidden
        />
      </div>
    </div>
  )
}
