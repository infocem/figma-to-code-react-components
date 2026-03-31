import { useRef } from 'react'
import clsx from 'clsx'
import { Label } from '../Label/Label'

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
        <span
          className="absolute bottom-[var(--spacing-sm)] right-[var(--spacing-sm)] w-4 h-4 pointer-events-none bg-no-repeat bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cline%20x1%3D%224%22%20y1%3D%2212%22%20x2%3D%2212%22%20y2%3D%224%22%20stroke%3D%22%23B7B7B7%22%20stroke-width%3D%221.5%22%2F%3E%3Cline%20x1%3D%228%22%20y1%3D%2212%22%20x2%3D%2212%22%20y2%3D%228%22%20stroke%3D%22%23B7B7B7%22%20stroke-width%3D%221.5%22%2F%3E%3C%2Fsvg%3E')]"
          aria-hidden="true"
        />
      </div>

      {maxLength && (
        <span className="font-sans text-sm font-regular text-text-placeholder text-right">
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  )
}
