import { useRef, useState } from 'react'
import { useTextField, useFocusRing, useButton } from 'react-aria'
import clsx from 'clsx'

export interface AutocompleteOption {
  value: string
  label: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export interface AutocompleteProps {
  label?: string
  options: AutocompleteOption[]
  value?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  hint?: string
  onChange?: (value: string) => void
  onSelect?: (option: AutocompleteOption) => void
  className?: string
}

export function Autocomplete({
  label,
  options,
  value = '',
  placeholder = 'Type to search…',
  disabled,
  required,
  hint,
  onChange,
  onSelect,
  className,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLButtonElement>(null)
  const inputId = `autocomplete-${Math.random().toString(36).slice(2)}`

  const { buttonProps: clearProps } = useButton({
    onPress: () => { onChange?.(''); inputRef.current?.focus() },
    'aria-label': 'Clear',
  }, clearRef)

  const { buttonProps: searchProps } = useButton({
    'aria-label': 'Search',
  }, searchRef)

  const { inputProps, labelProps } = useTextField(
    {
      label,
      value,
      isDisabled: disabled,
      isRequired: required,
      placeholder,
      onChange: v => { onChange?.(v); setIsOpen(true) },
      onFocus: () => setIsOpen(true),
      onBlur: () => setTimeout(() => setIsOpen(false), 150),
    },
    inputRef
  )
  const { isFocusVisible, focusProps } = useFocusRing()

  const filtered = value
    ? options.filter(o => o.label.toLowerCase().includes(value.toLowerCase()))
    : options

  return (
    <div className={clsx('flex flex-col gap-2 w-field-width', className)}>
      {label && (
        <label {...labelProps} className="font-sans text-md font-regular text-text">
          {label}
          {required && <span className="text-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="relative">
        <div
          className={clsx(
            'flex items-center h-field-height border border-border rounded-md bg-bg overflow-hidden',
            isFocusVisible && 'border-primary shadow-[0_0_0_1px_var(--color-primary)]',
            disabled && 'bg-bg-disabled border-border-disabled'
          )}
        >
          <input
            {...inputProps}
            {...focusProps}
            ref={inputRef}
            className={clsx(
              'flex-1 h-full border-none bg-transparent px-md font-sans text-md font-regular text-text outline-none placeholder:text-text-disabled min-w-0',
              disabled && 'text-text-disabled cursor-not-allowed'
            )}
            aria-autocomplete="list"
            aria-expanded={isOpen && filtered.length > 0}
            aria-describedby={hint ? `${inputId}-hint` : undefined}
            role="combobox"
          />
          {value && !disabled && (
            <button {...clearProps} ref={clearRef} className="flex items-center justify-center shrink-0 w-[24px] h-[24px] bg-transparent border-none cursor-pointer p-0 mr-1 outline-none">
              <img src="/icons/icon-close.svg" alt="" width={16} height={16} />
            </button>
          )}
          <button {...searchProps} ref={searchRef} className="flex items-center justify-center shrink-0 h-full px-sm bg-primary border-none cursor-pointer outline-none">
            <img src="/icons/icon-search.svg" alt="" width={24} height={24} />
          </button>
        </div>
        {isOpen && filtered.length > 0 && (
          <ul
            className="absolute top-[calc(100%+4px)] left-0 right-0 bg-bg border border-border rounded-md shadow-dropdown list-none m-0 py-2 max-h-[240px] overflow-y-auto z-10"
            role="listbox"
          >
            {filtered.map(option => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={clsx(
                  'flex items-center gap-sm py-2 px-md font-sans text-md font-regular text-text cursor-pointer hover:bg-bg-hover hover:text-primary',
                  option.value === value && 'bg-primary text-text-on-primary font-semibold'
                )}
                onMouseDown={() => {
                  onSelect?.(option)
                  onChange?.(option.label)
                  setIsOpen(false)
                }}
              >
                {option.iconLeft && <span className="flex items-center shrink-0" aria-hidden="true">{option.iconLeft}</span>}
                <span className="flex-1 min-w-0">{option.label}</span>
                {option.iconRight && <span className="flex items-center shrink-0" aria-hidden="true">{option.iconRight}</span>}
              </li>
            ))}
          </ul>
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
