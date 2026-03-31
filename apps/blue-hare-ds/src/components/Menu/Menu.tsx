import clsx from 'clsx'

export interface MenuItem {
  id: string | number
  label: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  selected?: boolean
  disabled?: boolean
}

export interface MenuProps {
  items: MenuItem[]
  onSelect?: (item: MenuItem) => void
  className?: string
}

export function Menu({ items, onSelect, className }: MenuProps) {
  return (
    <div
      role="menu"
      className={clsx(
        'flex flex-col gap-sm p-sm bg-bg border-[0.5px] border-border rounded-md w-full',
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="menuitem"
          aria-selected={item.selected}
          aria-disabled={item.disabled}
          tabIndex={item.disabled ? -1 : 0}
          className={clsx(
            'flex flex-row items-center gap-sm py-sm px-lg rounded-md cursor-pointer font-sans text-md font-regular leading-md text-text transition-[background] duration-100 outline-none',
            !item.disabled && 'hover:bg-bg-hover',
            !item.disabled && 'focus-visible:bg-bg-hover focus-visible:shadow-[inset_0_0_0_1px_var(--color-primary)]',
            item.selected && 'bg-primary text-text-on-primary font-semibold hover:bg-primary-hover',
            item.disabled && 'cursor-not-allowed text-text-placeholder',
          )}
          onClick={() => !item.disabled && onSelect?.(item)}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
              onSelect?.(item)
            }
          }}
        >
          {item.iconLeft && (
            <span className="flex items-center shrink-0 w-icon-md h-icon-md" aria-hidden="true">
              {item.iconLeft}
            </span>
          )}
          <span className="flex-1 min-w-0">{item.label}</span>
          {item.iconRight && (
            <span className="flex items-center shrink-0 w-icon-md h-icon-md" aria-hidden="true">
              {item.iconRight}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
