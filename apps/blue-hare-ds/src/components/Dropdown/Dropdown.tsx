import { useState, useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'
import { Label } from '../Label/Label'
import { ChevronDownIcon } from '../Icons'
import { Menu, MenuItem } from '../Menu/Menu'

export interface DropdownProps {
  label?: string
  required?: boolean
  showHelpIcon?: boolean
  hint?: string
  placeholder?: string
  items?: MenuItem[]
  value?: string | number
  onChange?: (item: MenuItem) => void
  disabled?: boolean
  className?: string
}

export function Dropdown({
  label,
  required,
  showHelpIcon,
  hint,
  placeholder = 'Placeholder',
  items = [],
  value,
  onChange,
  disabled,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = label ? `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined

  const { buttonProps } = useButton(
    {
      isDisabled: disabled,
      onPress: () => setOpen((v) => !v),
      'aria-haspopup': 'listbox',
      'aria-expanded': open,
    },
    triggerRef
  )

  const selectedItem = items.find((i) => i.id === value)

  return (
    <div className={clsx('flex flex-col gap-sm w-field-width relative', className)}>
      {label && (
        <Label htmlFor={id} required={required} showHelpIcon={showHelpIcon}>
          {label}
        </Label>
      )}

      <button
        {...buttonProps}
        ref={triggerRef}
        id={id}
        className={clsx(
          'flex flex-row items-center gap-md p-[var(--field-padding)] h-field-height bg-bg border border-border rounded-md cursor-pointer font-sans text-md font-regular text-text text-left transition-[border-color] duration-150 w-full',
          'hover:not-disabled:border-border-hover',
          'focus-visible:outline-none focus-visible:border-border-focus focus-visible:shadow-[0_0_0_var(--focus-ring-width)_var(--focus-ring-color)]',
          open && 'border-border-focus',
          disabled && 'bg-bg-disabled text-text-placeholder cursor-not-allowed'
        )}
      >
        <span
          className={clsx(
            'flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap',
            !selectedItem && 'text-text-placeholder'
          )}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDownIcon
          className={clsx(
            'shrink-0 transition-transform duration-200',
            open && 'rotate-180'
          )}
          size={24}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+var(--spacing-xs))] left-0 right-0 z-[100]">
          <Menu
            items={items.map((item) => ({ ...item, selected: item.id === value }))}
            onSelect={(item) => {
              onChange?.(item)
              setOpen(false)
            }}
          />
        </div>
      )}

      {hint && (
        <span className="font-sans text-sm font-regular text-text-placeholder">
          {hint}
        </span>
      )}
    </div>
  )
}
