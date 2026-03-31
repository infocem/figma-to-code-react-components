import { useRef } from 'react'
import clsx from 'clsx'
import { Label } from '../Label/Label'
import './TextArea.css'

export interface TextAreaProps {
  label?: string
  required?: boolean
  showHelpIcon?: boolean
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  maxLength?: number
  disabled?: boolean
  rows?: number
  id?: string
  name?: string
  className?: string
}

export function TextArea({
  label,
  required,
  showHelpIcon,
  placeholder = 'Placeholder',
  value,
  defaultValue,
  onChange,
  maxLength,
  disabled,
  rows = 4,
  id,
  name,
  className,
}: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const inputId = id ?? (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  const currentLength = value?.length ?? 0

  return (
    <div className={clsx('flex flex-col gap-sm w-field-width', className)}>
      {label && (
        <Label htmlFor={inputId} required={required} showHelpIcon={showHelpIcon}>
          {label}
        </Label>
      )}

      <div className="relative">
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className="w-full min-h-[100px] p-[var(--field-padding)] bg-bg border border-border rounded-md font-sans text-md font-regular leading-md text-text resize-y outline-none transition-[border-color] duration-150 placeholder:text-text-placeholder hover:not-disabled:border-border-hover focus-visible:border-border-focus focus-visible:shadow-[0_0_0_var(--focus-ring-width)_var(--focus-ring-color)] disabled:bg-bg-disabled disabled:text-text-disabled disabled:cursor-not-allowed disabled:resize-none block"
          onChange={(e) => onChange?.(e.target.value)}
        />
        <span className="text-area__resize-handle" aria-hidden="true" />
      </div>

      {maxLength && (
        <span className="font-sans text-sm font-regular text-text-placeholder text-right">
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  )
}
