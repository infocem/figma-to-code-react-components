import { useRef } from 'react'
import { useSwitch } from 'react-aria'
import { useToggleState } from 'react-stately'
import clsx from 'clsx'

export interface SwitchProps {
  children?: React.ReactNode
  isSelected?: boolean
  defaultSelected?: boolean
  isDisabled?: boolean
  onChange?: (isSelected: boolean) => void
  className?: string
  'aria-label'?: string
}

export function Switch({
  children,
  isSelected,
  defaultSelected,
  isDisabled,
  onChange,
  className,
  ...ariaProps
}: SwitchProps) {
  const state = useToggleState({ isSelected, defaultSelected, onChange })
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps, isSelected: selected, isDisabled: disabled } = useSwitch(
    { isDisabled, children, ...ariaProps },
    state,
    ref
  )

  return (
    <label
      className={clsx(
        'group inline-flex flex-row items-center gap-sm cursor-pointer font-sans text-md leading-md text-text select-none',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <input {...inputProps} ref={ref} className="peer absolute w-px h-px opacity-0 m-0" />
      <span
        className={clsx(
          'flex items-center w-[41px] h-[22px] rounded-full border border-border bg-bg px-1 relative shrink-0 transition-[background,border-color] duration-200',
          selected && !disabled && 'bg-primary border-primary justify-end',
          disabled && 'bg-bg-disabled border-border-disabled',
          // hover
          !disabled && !selected && 'group-hover:border-[var(--color-primary-hover)] group-hover:bg-bg-hover',
          !disabled && selected && 'group-hover:bg-[var(--color-primary-hover)] group-hover:border-[var(--color-primary-hover)]',
          // focus ring
          'peer-focus-visible:after:content-[""] peer-focus-visible:after:absolute peer-focus-visible:after:inset-[calc(-1*var(--focus-ring-offset))] peer-focus-visible:after:border-[length:var(--focus-ring-width)] peer-focus-visible:after:border-[var(--focus-ring-color)] peer-focus-visible:after:rounded-[inherit]',
        )}
        aria-hidden="true"
      >
        <span
          className={clsx(
            'w-[16px] h-[16px] rounded-full bg-border shrink-0 transition-[transform,background] duration-200',
            selected && !disabled && 'bg-bg',
            disabled && 'bg-[var(--neutral-400)]',
          )}
        />
      </span>
      {children && (
        <span
          className={clsx(
            'font-sans text-md font-regular text-text',
            disabled && 'text-text-muted',
          )}
        >
          {children}
        </span>
      )}
    </label>
  )
}
