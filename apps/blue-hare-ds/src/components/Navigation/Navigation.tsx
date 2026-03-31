import { useRef } from 'react'
import { useLink, useFocusRing } from 'react-aria'
import clsx from 'clsx'
import './Navigation.css'

export interface NavItem {
  key: string
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface NavAction {
  label: string
  variant: 'primary' | 'transparent'
  onPress?: () => void
}

export interface NavigationProps {
  logo?: React.ReactNode
  items?: NavItem[]
  actions?: NavAction[]
  activeKey?: string
  onItemPress?: (key: string) => void
  className?: string
}

function NavLink({ item, isActive, onPress }: { item: NavItem; isActive: boolean; onPress: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { linkProps } = useLink({ href: item.href, onPress, elementType: 'a' }, ref)
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <a
      {...linkProps}
      {...focusProps}
      ref={ref}
      className={clsx(
        'inline-flex items-center gap-md p-2 font-sans text-md font-regular leading-md text-text no-underline relative outline-none',
        'hover:text-primary-hover',
        isActive && 'text-primary-hover font-semibold',
        isFocusVisible && 'nav__item--focus',
      )}
    >
      {item.icon && <span className="flex items-center" aria-hidden="true">{item.icon}</span>}
      {item.label}
    </a>
  )
}

export function Navigation({ logo, items = [], actions = [], activeKey, onItemPress, className }: NavigationProps) {
  return (
    <header className={clsx('flex flex-row items-center gap-[26px] p-0 bg-bg border-b border-border', className)}>
      {logo && <div className="flex items-center shrink-0">{logo}</div>}
      {items.length > 0 && (
        <nav className="flex flex-row items-center flex-1" aria-label="Main navigation">
          {items.map(item => (
            <NavLink
              key={item.key}
              item={item}
              isActive={item.key === activeKey}
              onPress={() => onItemPress?.(item.key)}
            />
          ))}
        </nav>
      )}
      {actions.length > 0 && (
        <div className="flex flex-row gap-[10px] p-[10px] shrink-0">
          {actions.map((action, i) => (
            <button
              key={i}
              className={clsx(
                'inline-flex items-center justify-center gap-sm py-2 px-md rounded-md font-sans text-md font-regular cursor-pointer outline-none',
                'focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]',
                action.variant === 'transparent' && 'bg-transparent border-none text-primary-hover hover:bg-bg-hover',
                action.variant === 'primary' && 'bg-primary border-none text-text-on-primary hover:bg-primary-hover',
              )}
              onClick={() => action.onPress?.()}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
