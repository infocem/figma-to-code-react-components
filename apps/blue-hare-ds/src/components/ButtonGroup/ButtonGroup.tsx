import { useRef } from 'react'
import { useButton, useFocusRing } from 'react-aria'
import clsx from 'clsx'
import './ButtonGroup.css'

export type ButtonGroupType = 'default' | 'toggle' | 'icon'

export interface ButtonGroupItem {
  key: string
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface ButtonGroupProps {
  items: ButtonGroupItem[]
  selectedKey?: string
  type?: ButtonGroupType
  onSelectionChange?: (key: string) => void
  className?: string
}

interface GroupButtonProps {
  item: ButtonGroupItem
  isSelected: boolean
  isFirst: boolean
  isLast: boolean
  isIconOnly: boolean
  onPress: () => void
  showLabel?: boolean
}

function GroupButton({ item, isSelected, isLast, isIconOnly, onPress, showLabel = true }: GroupButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(
    { onPress, isDisabled: item.disabled, 'aria-pressed': isSelected },
    ref
  )
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <button
      {...buttonProps}
      {...focusProps}
      ref={ref}
      className={clsx(
        'btn-group__item',
        'relative inline-flex items-center justify-center',
        'font-sans text-md font-regular leading-md',
        'outline-none cursor-pointer border-none',
        isIconOnly ? 'px-[var(--spacing-2)] py-[var(--spacing-2)]' : 'px-[var(--spacing-md)] py-[var(--spacing-2)]',
        'gap-2',
        !isLast && 'border-r border-r-primary',
        isSelected
          ? 'bg-primary text-text-on-primary'
          : item.disabled
            ? 'bg-bg-disabled text-text-secondary cursor-not-allowed border-r-border'
            : 'bg-transparent text-primary-hover hover:bg-bg-hover',
        isFocusVisible && 'btn-group__item--focus',
      )}
    >
      {item.icon && (
        <span className="inline-flex items-center w-[var(--icon-size-md)] h-[var(--icon-size-md)]" aria-hidden="true">
          {item.icon}
        </span>
      )}
      {showLabel && item.label && <span>{item.label}</span>}
    </button>
  )
}

export function ButtonGroup({ items, selectedKey, type = 'default', onSelectionChange, className }: ButtonGroupProps) {
  const isIconOnly = type === 'icon'

  return (
    <div
      className={clsx(
        'inline-flex flex-row items-center border border-primary rounded-sm overflow-hidden',
        className,
      )}
      role="group"
    >
      {items.map((item, i) => (
        <GroupButton
          key={item.key}
          item={item}
          isSelected={item.key === selectedKey}
          isFirst={i === 0}
          isLast={i === items.length - 1}
          isIconOnly={isIconOnly}
          onPress={() => onSelectionChange?.(item.key)}
          showLabel={!isIconOnly}
        />
      ))}
    </div>
  )
}
