import { useRef } from 'react'
import { useTextField } from 'react-aria'
import clsx from 'clsx'
import { IdentityIcon, EyeIcon } from '../Icons'

export type FieldStatus = 'default' | 'hover' | 'focus' | 'disabled' | 'error' | 'success'

export interface FieldProps {
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  status?: FieldStatus
  disabled?: boolean
  showLeftIcon?: boolean
  showRightIcon?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  id?: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  className?: string
}

export function Field({
  placeholder,
  value,
  defaultValue,
  onChange,
  status = 'default',
  disabled,
  showLeftIcon = true,
  showRightIcon = true,
  className,
  ...ariaProps
}: FieldProps) {
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useTextField(
    {
      placeholder,
      value,
      defaultValue,
      onChange,
      isDisabled: disabled,
      ...ariaProps,
    },
    ref
  )

  const resolvedStatus = disabled ? 'disabled' : status

  return (
    <div
      className={clsx(
        'flex flex-row items-center gap-[var(--field-gap)] p-[var(--field-padding)] w-field-width h-field-height bg-bg border border-border rounded-md relative transition-[border-color,background] duration-150',
        'after:content-[""] after:absolute after:inset-[calc(-1*var(--focus-ring-offset))] after:border-[length:var(--focus-ring-width)] after:border-transparent after:rounded-[inherit] after:pointer-events-none after:transition-[border-color] after:duration-150',
        resolvedStatus !== 'disabled' && 'focus-within:border-[var(--color-border-focus)] focus-within:after:border-[var(--focus-ring-color)]',
        resolvedStatus === 'hover' && 'border-border-hover bg-bg-hover',
        resolvedStatus === 'focus' && 'border-border-focus',
        resolvedStatus === 'disabled' && 'bg-bg-disabled border-border-disabled cursor-not-allowed',
        resolvedStatus === 'error' && 'border-border-error',
        resolvedStatus === 'success' && 'border-border-success bg-success-bg',
        className,
      )}
    >
      {showLeftIcon && (
        <IdentityIcon className="w-icon-md h-icon-md shrink-0" size={24} />
      )}
      <input
        {...inputProps}
        ref={ref}
        className={clsx(
          'flex-1 min-w-0 border-none outline-none bg-transparent font-sans text-md font-regular leading-md text-text placeholder:text-text-placeholder',
          disabled && 'cursor-not-allowed text-text-disabled',
        )}
      />
      {showRightIcon && (
        <EyeIcon className="w-icon-md h-icon-md shrink-0" size={24} />
      )}
    </div>
  )
}
