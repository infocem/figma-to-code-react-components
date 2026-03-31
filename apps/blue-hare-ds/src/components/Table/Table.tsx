import { useState, useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'
import './Table.css'

export type SortDirection = 'asc' | 'desc' | null

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  heading: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

export type BorderVariant = 'none' | 'bottom' | 'full'

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  rows: T[]
  keyField?: string
  caption?: string
  className?: string
  border?: BorderVariant
  selectedKeys?: Set<string>
  onSelectionChange?: (keys: Set<string>) => void
}

interface SortButtonProps {
  onPress: () => void
  direction: SortDirection
  label: string
}

function SortButton({ onPress, direction, label }: SortButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress, 'aria-label': `Sort by ${label}` }, ref)
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={clsx(
        'table__sort-btn',
        'flex items-center justify-center bg-transparent border-0 p-[2px] cursor-pointer rounded-sm text-text-secondary outline-none opacity-50 hover:opacity-100',
        (direction === 'asc' || direction === 'desc') && 'opacity-100 text-primary table__sort-btn--active',
      )}
    >
      <img src="/icons/icon-sort-alt.svg" alt="" aria-hidden="true" width={12} height={12} />
    </button>
  )
}

export function Table<T extends Record<string, unknown>>({ columns, rows, keyField = 'id', caption, className, border = 'bottom', selectedKeys, onSelectionChange }: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc')
      if (sortDir === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...rows].sort((a, b) => {
    if (!sortKey || !sortDir) return 0
    const av = a[sortKey]
    const bv = b[sortKey]
    const cmp = String(av ?? '').localeCompare(String(bv ?? ''))
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div className={clsx(
      'table-wrapper',
      'w-full overflow-x-auto rounded-lg',
      border === 'full' && 'border border-border',
      className,
    )}>
      <table className="table w-full border-collapse font-sans text-sm text-text">
        {caption && (
          <caption className="text-left text-lg font-semibold text-text p-md border-b border-border">
            {caption}
          </caption>
        )}
        <thead className="bg-bg-tag">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={clsx(
                  'table__th px-md py-2 text-left text-md font-semibold text-text whitespace-nowrap',
                  border !== 'none' && 'border-b border-border',
                )}
                scope="col"
              >
                <div className="flex items-center gap-2">
                  <span>{col.heading}</span>
                  {col.sortable && (
                    <SortButton
                      onPress={() => handleSort(col.key)}
                      direction={sortKey === col.key ? sortDir : null}
                      label={col.heading}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={clsx('table__body', border === 'none' && 'table__body--no-border')}>
          {sorted.map((row, i) => {
            const rowKey = String(row[keyField] ?? i)
            const isSelected = selectedKeys?.has(rowKey)
            return (
              <tr
                key={rowKey}
                className={clsx(
                  'table__row',
                  isSelected && 'table__row--selected bg-primary text-text-on-primary',
                  border === 'full' && 'border-b border-border',
                )}
                onClick={onSelectionChange ? () => {
                  const next = new Set(selectedKeys)
                  next.has(rowKey) ? next.delete(rowKey) : next.add(rowKey)
                  onSelectionChange(next)
                } : undefined}
                style={onSelectionChange ? { cursor: 'pointer' } : undefined}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-md py-2 text-sm leading-md align-middle">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
