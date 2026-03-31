import { useState, useRef, useId } from 'react'
import { useFocusRing } from 'react-aria'
import clsx from 'clsx'
import './Tabs.css'

export interface TabItem {
  key: string
  label: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  disabled?: boolean
  children?: React.ReactNode
}

export interface TabsProps {
  items: TabItem[]
  selectedKey?: string
  defaultSelectedKey?: string
  onSelectionChange?: (key: string) => void
  className?: string
}

function TabButton({
  item,
  isSelected,
  onSelect,
  id,
  panelId,
}: {
  item: TabItem
  isSelected: boolean
  onSelect: () => void
  id: string
  panelId: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <button
      {...focusProps}
      ref={ref}
      id={id}
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      disabled={item.disabled}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => !item.disabled && onSelect()}
      className={clsx(
        'tabs__tab',
        // base
        'inline-flex items-center justify-center gap-2 px-md py-2',
        'border-0 border-b-2 border-border bg-transparent',
        'font-sans text-md font-regular leading-md text-text',
        'cursor-pointer outline-none relative -mb-px',
        // selected
        isSelected && 'border-b-primary font-semibold',
        // disabled
        item.disabled && 'text-text-muted border-b-border cursor-not-allowed',
        // focus ring hook
        isFocusVisible && 'tabs__tab--focus',
        // hover states handled via CSS residual (needs :not compound)
        !item.disabled && !isSelected && 'hover:bg-bg-hover hover:border-b-primary-hover hover:text-primary-hover',
        isSelected && !item.disabled && 'hover:bg-bg-hover',
      )}
    >
      {item.iconLeft && (
        <span className="flex items-center w-[var(--icon-size-md)] h-[var(--icon-size-md)]" aria-hidden="true">
          {item.iconLeft}
        </span>
      )}
      <span>{item.label}</span>
      {item.iconRight && (
        <span className="flex items-center w-[var(--icon-size-md)] h-[var(--icon-size-md)]" aria-hidden="true">
          {item.iconRight}
        </span>
      )}
    </button>
  )
}

export function Tabs({ items, selectedKey, defaultSelectedKey, onSelectionChange, className }: TabsProps) {
  const baseId = useId()
  const [internalKey, setInternalKey] = useState(defaultSelectedKey ?? items[0]?.key)
  const activeKey = selectedKey ?? internalKey

  function handleSelect(key: string) {
    setInternalKey(key)
    onSelectionChange?.(key)
  }

  const activeItem = items.find(i => i.key === activeKey)

  return (
    <div className={clsx('flex flex-col w-full', className)}>
      <div role="tablist" aria-label="Tabs" className="flex flex-row items-end border-b border-border">
        {items.map(item => {
          const tabId = `${baseId}-tab-${item.key}`
          const panelId = `${baseId}-panel-${item.key}`
          return (
            <TabButton
              key={item.key}
              item={item}
              isSelected={activeKey === item.key}
              onSelect={() => handleSelect(item.key)}
              id={tabId}
              panelId={panelId}
            />
          )
        })}
      </div>
      {activeItem?.children && (
        <div
          id={`${baseId}-panel-${activeItem.key}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeItem.key}`}
          className="py-md"
        >
          {activeItem.children}
        </div>
      )}
    </div>
  )
}
