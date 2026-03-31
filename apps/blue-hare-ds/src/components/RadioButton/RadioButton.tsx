import { useRef } from 'react'
import { useRadio, useRadioGroup } from 'react-aria'
import { useRadioGroupState } from 'react-stately'
import clsx from 'clsx'

// ── RadioGroup ──────────────────────────────────────────────────────────────

interface RadioGroupProps {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  isDisabled?: boolean
  label?: string
  className?: string
}

export function RadioGroup({ children, label, className, ...props }: RadioGroupProps) {
  const state = useRadioGroupState(props)
  const { radioGroupProps, labelProps } = useRadioGroup({ label, ...props }, state)

  return (
    <div {...radioGroupProps} className={clsx('flex flex-col gap-sm', className)}>
      {label && (
        <span {...labelProps} className="font-sans text-md font-semibold text-text">
          {label}
        </span>
      )}
      <RadioGroupContext.Provider value={state}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  )
}

// ── Context ─────────────────────────────────────────────────────────────────

import { createContext, useContext } from 'react'
import type { RadioGroupState } from 'react-stately'

const RadioGroupContext = createContext<RadioGroupState | null>(null)

function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) throw new Error('RadioButton must be used inside a RadioGroup')
  return ctx
}

// ── RadioButton ─────────────────────────────────────────────────────────────

export interface RadioButtonProps {
  children?: React.ReactNode
  value: string
  isDisabled?: boolean
  className?: string
}

export function RadioButton({ children, value, isDisabled, className }: RadioButtonProps) {
  const state = useRadioGroupContext()
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps, isSelected, isDisabled: disabled } = useRadio(
    { value, isDisabled, children },
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
          'flex items-center justify-center w-[22px] h-[22px] rounded-full border-[1.5px] border-border bg-bg shrink-0 relative transition-[background,border-color] duration-150',
          isSelected && !disabled && 'bg-primary border-primary',
          disabled && 'bg-bg-disabled border-border-disabled',
          // hover
          !disabled && !isSelected && 'group-hover:border-[var(--color-primary-hover)] group-hover:bg-bg-hover',
          !disabled && isSelected && 'group-hover:bg-[var(--color-primary-hover)] group-hover:border-[var(--color-primary-hover)]',
          // focus ring
          'peer-focus-visible:after:content-[""] peer-focus-visible:after:absolute peer-focus-visible:after:inset-[calc(-1*var(--focus-ring-offset))] peer-focus-visible:after:border-[length:var(--focus-ring-width)] peer-focus-visible:after:border-[var(--focus-ring-color)] peer-focus-visible:after:rounded-[inherit]',
        )}
        aria-hidden="true"
      >
        {isSelected && (
          <span className={clsx(
            'radio-button__dot w-[6px] h-[6px] rounded-full',
            disabled ? 'bg-text-muted' : 'bg-bg',
          )} />
        )}
      </span>
      {children && (
        <span
          className={clsx(
            'font-sans text-md font-regular leading-md text-text',
            disabled && 'text-text-muted',
          )}
        >
          {children}
        </span>
      )}
    </label>
  )
}
