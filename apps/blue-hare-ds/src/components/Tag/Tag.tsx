import { useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'

export type TagType = 'default' | 'success' | 'information' | 'error' | 'warning' | 'disabled'

export interface TagProps {
  children: React.ReactNode
  /** Interactive tag: shows selection state + remove button */
  interactive?: boolean
  selected?: boolean
  disabled?: boolean
  onRemove?: () => void
  onPress?: () => void
  type?: TagType
  className?: string
}

const typeClasses: Record<TagType, string> = {
  default:     'bg-bg text-text border-border',
  success:     'bg-success-bg text-success-text border-success',
  information: 'bg-info-bg text-info-text border-info-border',
  error:       'bg-error-bg text-error-text border-error',
  warning:     'bg-warning-bg text-warning-text border-warning-border',
  disabled:    'bg-bg-disabled text-text-secondary border-border-disabled',
}

const baseClasses = 'inline-flex items-center gap-2 py-2 px-sm rounded-lg border border-solid border-border font-sans text-md font-regular leading-md whitespace-nowrap'

function RemoveButton({ onRemove }: { onRemove: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress: onRemove, 'aria-label': 'Remove' }, ref)
  return (
    <button
      {...buttonProps}
      ref={ref}
      className="flex items-center justify-center w-[20px] h-[20px] border-none bg-transparent cursor-pointer text-inherit text-[10px] rounded-full p-0 outline-none focus-visible:shadow-[inset_0_0_0_1px_currentColor]"
    >
      ✕
    </button>
  )
}

export function Tag({ children, interactive, selected, disabled, onRemove, onPress, type = 'default', className }: TagProps) {
  const ref = useRef<HTMLSpanElement>(null)

  if (interactive) {
    return (
      <span
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={selected}
        aria-disabled={disabled}
        className={clsx(
          baseClasses,
          'cursor-pointer outline-none',
          'focus-visible:shadow-[0_0_0_1px_var(--color-primary)]',
          selected
            ? 'bg-primary border-solid border-primary text-text-on-primary hover:bg-primary-hover'
            : disabled
              ? 'bg-bg-disabled border-border-disabled text-text-secondary cursor-not-allowed border-dashed'
              : 'border-dashed border-primary bg-transparent text-primary-hover hover:bg-bg-hover',
          className,
        )}
        onClick={() => !disabled && onPress?.()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && onPress?.() } }}
      >
        {!selected && <span className="text-md leading-none" aria-hidden="true">+</span>}
        <span className="min-w-0">{children}</span>
        {selected && onRemove && <RemoveButton onRemove={onRemove} />}
      </span>
    )
  }

  return (
    <span
      className={clsx(
        baseClasses,
        typeClasses[type],
        disabled && typeClasses.disabled,
        className,
      )}
    >
      <span className="min-w-0">{children}</span>
    </span>
  )
}
