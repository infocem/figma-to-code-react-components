import { useRef } from 'react'
import { useCheckbox } from 'react-aria'
import { useToggleState } from 'react-stately'
import { CheckIcon, MinusIcon } from '../Icons'
import clsx from 'clsx'
import './Checkbox.css'

export type CheckboxStatus = 'default' | 'hover' | 'focus' | 'disabled' | 'error'
export type CheckboxType = 'default' | 'selected' | 'indeterminate'
export type CheckboxSize = 'medium' | 'small'

export interface CheckboxProps {
  children?: React.ReactNode
  isSelected?: boolean
  isIndeterminate?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  defaultSelected?: boolean
  onChange?: (isSelected: boolean) => void
  size?: CheckboxSize
  className?: string
  'aria-label'?: string
}

export function Checkbox({
  children,
  isSelected,
  isIndeterminate,
  isDisabled,
  isInvalid,
  defaultSelected,
  onChange,
  size = 'medium',
  className,
  ...ariaProps
}: CheckboxProps) {
  const state = useToggleState({ isSelected, defaultSelected, onChange })
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useCheckbox(
    {
      isIndeterminate,
      isDisabled,
      isInvalid,
      children,
      ...ariaProps,
    },
    state,
    ref
  )

  const checked = state.isSelected
  const type: CheckboxType = isIndeterminate ? 'indeterminate' : checked ? 'selected' : 'default'

  const isActive = type === 'selected' || type === 'indeterminate'

  return (
    <label
      className={clsx(
        'checkbox',
        `checkbox--${type}`,
        isInvalid && 'checkbox--error',
        'inline-flex flex-row items-center gap-sm cursor-pointer font-sans text-md leading-md text-text select-none',
        isDisabled && 'cursor-not-allowed checkbox--disabled',
        className,
      )}
    >
      <input {...inputProps} ref={ref} className="checkbox__input absolute w-px h-px opacity-0 m-0" />
      <span
        className={clsx(
          'checkbox__control',
          'flex items-center justify-center shrink-0 rounded-sm border border-border bg-bg relative transition-[background,border-color] duration-150',
          size === 'medium' ? 'w-[22px] h-[22px]' : 'w-[16px] h-[16px]',
          isActive && !isDisabled && !isInvalid && 'bg-primary border-primary',
          isInvalid && 'bg-error-bg border-border-error',
          isDisabled && 'bg-bg-disabled border-border-disabled',
        )}
        aria-hidden="true"
      >
        {type === 'selected' && <CheckIcon className="block" size={size === 'small' ? 12 : 22} />}
        {type === 'indeterminate' && <MinusIcon className="block" size={size === 'small' ? 12 : 22} />}
      </span>
      {children && (
        <span
          className={clsx(
            'font-sans text-md font-regular leading-md text-text',
            isDisabled && 'text-text-muted',
          )}
        >
          {children}
        </span>
      )}
    </label>
  )
}
