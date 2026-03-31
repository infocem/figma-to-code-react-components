import { useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'

export type PaginationVariant = 'jumper' | 'default'

export interface PaginationProps {
  page: number
  total: number
  pageSize?: number
  pageSizeOptions?: number[]
  variant?: PaginationVariant
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
}

interface PageButtonProps {
  label: React.ReactNode
  onPress: () => void
  disabled?: boolean
  selected?: boolean
  ariaLabel?: string
}

function PageButton({ label, onPress, disabled, selected, ariaLabel }: PageButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress, isDisabled: disabled, 'aria-label': ariaLabel, 'aria-current': selected ? 'page' : undefined }, ref)

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={clsx(
        'focus-ring',
        'flex items-center justify-center w-8 h-8 rounded-sm border-0',
        'bg-bg-tag font-sans text-md font-semibold text-primary-hover',
        'cursor-pointer outline-none relative shrink-0',
        !disabled && !selected && 'hover:bg-bg-hover hover:border hover:border-primary-hover',
        selected && 'bg-primary text-text-on-primary cursor-default hover:bg-primary-hover',
        disabled && 'bg-bg-disabled text-text-muted cursor-not-allowed',
      )}
    >
      {label}
    </button>
  )
}

function buildPages(page: number, total: number): Array<number | '...'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: Array<number | '...'> = [1]
  if (page > 3) pages.push('...')
  for (let p = Math.max(2, page - 1); p <= Math.min(total - 1, page + 1); p++) pages.push(p)
  if (page < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

export function Pagination({
  page,
  total,
  pageSize = 12,
  pageSizeOptions = [12, 24, 48],
  variant = 'jumper',
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const pages = buildPages(page, total)

  return (
    <div className={clsx('flex flex-row items-center gap-md flex-wrap', className)}>
      <div className="flex items-center gap-2">
        {/* Previous */}
        <PageButton
          label={<img src="/icons/icon-chevron-left.svg" alt="" aria-hidden="true" width={24} height={24} />}
          ariaLabel="Previous page"
          onPress={() => onPageChange(page - 1)}
          disabled={page <= 1}
        />

        {variant === 'jumper' ? (
          pages.map((p, i) =>
            p === '...' ? (
              <span
                key={`overflow-${i}`}
                className="flex items-center justify-center w-8 h-8 rounded-sm bg-bg-tag cursor-default pointer-events-none"
                aria-hidden="true"
              >
                <img src="/icons/icon-three-dots.svg" alt="…" width={24} height={24} />
              </span>
            ) : (
              <PageButton
                key={p}
                label={String(p)}
                ariaLabel={`Page ${p}`}
                onPress={() => onPageChange(p as number)}
                selected={p === page}
              />
            )
          )
        ) : (
          <span className="flex items-center gap-sm">
            <input
              className="w-20 h-8 border border-border rounded-md px-sm font-sans text-md text-text bg-bg outline-none text-center focus-visible:border-primary"
              type="number"
              min={1}
              max={total}
              value={page}
              onChange={e => onPageChange(Number(e.target.value))}
              aria-label="Page number"
            />
            <span className="font-sans text-sm text-text-secondary whitespace-nowrap">of {total} pages</span>
          </span>
        )}

        {/* Next */}
        <PageButton
          label={<img src="/icons/icon-chevron-right.svg" alt="" aria-hidden="true" width={24} height={24} />}
          ariaLabel="Next page"
          onPress={() => onPageChange(page + 1)}
          disabled={page >= total}
        />
      </div>

      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm text-text-secondary whitespace-nowrap">Results per page</span>
          <select
            className="h-8 border border-border rounded-md px-sm font-sans text-md text-text bg-bg outline-none cursor-pointer focus-visible:border-primary"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            aria-label="Results per page"
          >
            {pageSizeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
