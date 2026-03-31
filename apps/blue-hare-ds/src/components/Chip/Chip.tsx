import { useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'
import { CloseCircleIcon } from '../Icons'

export type ChipType = 'default' | 'success' | 'information' | 'error' | 'warning' | 'disabled'

export interface ChipProps {
  children: React.ReactNode
  type?: ChipType
  onRemove?: () => void
  className?: string
}

const typeClasses: Record<ChipType, string> = {
  default:     'bg-primary text-text-on-primary border-primary',
  success:     'bg-success-bg text-success-text border-success',
  information: 'bg-info-bg text-info-text border-info-border',
  error:       'bg-error-bg text-error-text border-error',
  warning:     'bg-warning-bg text-warning-text border-warning-border',
  disabled:    'bg-bg-disabled text-text-secondary border-border-disabled',
}

export function Chip({ children, type = 'default', onRemove, className }: ChipProps) {
  const removeRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress: onRemove, 'aria-label': `Remove ${children}` }, removeRef)

  const isDisabled = type === 'disabled'
  const closeIcon = <CloseCircleIcon size={20} />

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 py-2 pr-2 pl-md rounded-full border border-solid font-sans text-md font-regular leading-md whitespace-nowrap',
        typeClasses[type],
        className,
      )}
    >
      <span className="min-w-0">{children}</span>
      {onRemove && !isDisabled ? (
        <button
          {...buttonProps}
          ref={removeRef}
          tabIndex={0}
          className="flex items-center justify-center w-[24px] h-[24px] border-none bg-transparent cursor-pointer text-inherit rounded-full p-0 outline-none opacity-70 hover:opacity-100 focus-visible:shadow-[inset_0_0_0_1px_currentColor]"
        >
          {closeIcon}
        </button>
      ) : (
        <span className="flex items-center justify-center w-[24px] h-[24px] opacity-50">
          {closeIcon}
        </span>
      )}
    </span>
  )
}
