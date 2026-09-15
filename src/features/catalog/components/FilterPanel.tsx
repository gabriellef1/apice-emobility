import { type ReactNode } from 'react'

import { type Facets } from '../lib/facets'
import { type CatalogQuery, hasActiveFilters } from '../lib/query'

interface FilterPanelProps {
  facets: Facets
  query: CatalogQuery
  onChange: (update: (current: CatalogQuery) => CatalogQuery) => void
  onClear: () => void
  /** Prefixo pros ids dos inputs, pra sidebar e drawer não colidirem. */
  idPrefix: string
}

function toggle<T>(list: T[], value: T, checked: boolean): T[] {
  if (checked) return list.includes(value) ? list : [...list, value]
  return list.filter((item) => item !== value)
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-ink-200 py-5 first:border-t-0 first:pt-0">
      <legend className="float-left mb-3 w-full eyebrow text-ink-900">{legend}</legend>
      <div className="clear-both space-y-2.5">{children}</div>
    </fieldset>
  )
}

function Option({
  id,
  label,
  count,
  checked,
  onChange,
}: {
  id: string
  label: string
  count?: number
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 shrink-0 cursor-pointer accent-ink-950"
      />
      <label
        htmlFor={id}
        className="flex flex-1 cursor-pointer items-center justify-between text-sm"
      >
        <span>{label}</span>
        {count !== undefined && <span className="text-ink-400 tabular-nums">{count}</span>}
      </label>
    </div>
  )
}

/** Formulário de filtros. Sem botão "aplicar": cada mudança já atualiza a URL. */
export function FilterPanel({ facets, query, onChange, onClear, idPrefix }: FilterPanelProps) {
  const active = hasActiveFilters(query)

  return (
    <div>
      {facets.categoria.length > 0 && (
        <Group legend="Categoria">
          {facets.categoria.map((option) => (
            <Option
              key={option.value}
              id={`${idPrefix}-categoria-${option.value}`}
              label={option.label}
              count={option.count}
              checked={query.categoria.includes(option.value)}
              onChange={(checked) =>
                onChange((current) => ({
                  ...current,
                  categoria: toggle(current.categoria, option.value, checked),
                }))
              }
            />
          ))}
        </Group>
      )}

      {facets.disponibilidade.length > 0 && (
        <Group legend="Disponibilidade">
          {facets.disponibilidade.map((option) => (
            <Option
              key={option.value}
              id={`${idPrefix}-disponibilidade-${option.value}`}
              label={option.label}
              count={option.count}
              checked={query.disponibilidade.includes(option.value)}
              onChange={(checked) =>
                onChange((current) => ({
                  ...current,
                  disponibilidade: toggle(current.disponibilidade, option.value, checked),
                }))
              }
            />
          ))}
        </Group>
      )}

      {facets.destaque !== null && (
        <Group legend="Destaque">
          <Option
            id={`${idPrefix}-destaque`}
            label="Só modelos em destaque"
            count={facets.destaque}
            checked={query.destaque}
            onChange={(checked) => onChange((current) => ({ ...current, destaque: checked }))}
          />
        </Group>
      )}

      {active && (
        <div className="border-t border-ink-200 pt-5">
          <button
            type="button"
            onClick={onClear}
            className="rounded-sm text-sm font-medium text-brand-600 underline-offset-4 hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
