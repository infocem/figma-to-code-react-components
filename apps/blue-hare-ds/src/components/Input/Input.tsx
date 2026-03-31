import clsx from 'clsx'
import { Label } from '../Label/Label'
import { Field, FieldStatus } from '../Field/Field'

export interface InputProps {
  label?: string
  required?: boolean
  showHelpIcon?: boolean
  hint?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  status?: FieldStatus
  disabled?: boolean
  showLeftIcon?: boolean
  showRightIcon?: boolean
  /** Defined type shows a pre-tab (e.g. "http://") before the field */
  type?: 'default' | 'defined'
  preTab?: string
  id?: string
  name?: string
  className?: string
}

export function Input({
  label,
  required,
  showHelpIcon,
  hint,
  placeholder = 'Placeholder',
  value,
  defaultValue,
  onChange,
  status = 'default',
  disabled,
  showLeftIcon = true,
  showRightIcon = true,
  type = 'default',
  preTab,
  id,
  name,
  className,
}: InputProps) {
  const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  return (
    <div className={clsx('flex flex-col gap-sm', className)}>
      {label && (
        <Label htmlFor={inputId} required={required} showHelpIcon={showHelpIcon}>
          {label}
        </Label>
      )}

      {type === 'defined' ? (
        <div className="flex flex-row items-stretch border border-border rounded-md overflow-hidden">
          {preTab && (
            <div className="flex items-center p-sm bg-bg-disabled border-r border-border shrink-0">
              <span className="font-sans text-md font-regular text-text-placeholder">{preTab}</span>
            </div>
          )}
          <Field
            id={inputId}
            name={name}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            status={status}
            disabled={disabled}
            showLeftIcon={false}
            showRightIcon={false}
            className="border-none rounded-none flex-1 w-auto"
            aria-label={label ?? placeholder}
          />
        </div>
      ) : (
        <Field
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          status={status}
          disabled={disabled}
          showLeftIcon={showLeftIcon}
          showRightIcon={showRightIcon}
          aria-label={label ?? placeholder}
        />
      )}

      {hint && (
        <span className="font-sans text-sm font-regular leading-sm text-text-placeholder">{hint}</span>
      )}
    </div>
  )
}
