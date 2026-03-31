import { useRef } from 'react'
import { useTextField } from 'react-aria'
import clsx from 'clsx'
import './DefinedField.css'

export interface DefinedFieldProps {
  label?: string
  preTab?: string
  postTab?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  hint?: string
  onChange?: (value: string) => void
  className?: string
}

export function DefinedField({
  label,
  preTab,
  postTab,
  value,
  placeholder = 'Placeholder',
  disabled,
  required,
  hint,
  onChange,
  className,
}: DefinedFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = `defined-field-${Math.random().toString(36).slice(2)}`

  const { inputProps, labelProps } = useTextField(
    {
      label,
      value,
      isDisabled: disabled,
      isRequired: required,
      placeholder,
      onChange,
    },
    inputRef
  )

  return (
    <div className={clsx('flex flex-col gap-2 w-field-width', disabled && 'defined-field--disabled', className)}>
      {label && (
        <label {...labelProps} className="font-sans text-md font-regular text-text">
          {label}
          {required && <span className="text-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={clsx(
        'defined-field__input-wrapper flex items-center h-field-height border border-border rounded-md bg-bg overflow-hidden',
        disabled && 'bg-bg-disabled border-border-disabled',
      )}>
        {preTab && (
          <span
            className="flex items-center px-sm h-full bg-bg-tag font-sans text-md font-regular text-text-secondary whitespace-nowrap shrink-0 border-r border-border"
            aria-hidden="true"
          >
            {preTab}
          </span>
        )}
        <input
          {...inputProps}
          ref={inputRef}
          id={inputId}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          className={clsx(
            'flex-1 h-full border-none bg-transparent px-sm font-sans text-md font-regular text-text outline-none min-w-0 placeholder:text-text-disabled',
            disabled && 'text-text-disabled cursor-not-allowed'
          )}
        />
        {postTab && (
          <span
            className="flex items-center px-sm h-full bg-bg-tag font-sans text-md font-regular text-text-secondary whitespace-nowrap shrink-0 border-l border-border"
            aria-hidden="true"
          >
            {postTab}
          </span>
        )}
      </div>
      {hint && (
        <span id={`${inputId}-hint`} className="font-sans text-sm text-text-secondary">
          {hint}
        </span>
      )}
    </div>
  )
}
