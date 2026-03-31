import { useState } from 'react'
import clsx from 'clsx'

export interface SidebarSubItem {
  key: string
  label: string
  href?: string
}

export interface SidebarItem {
  key: string
  label: string
  icon?: React.ReactNode
  href?: string
  subItems?: SidebarSubItem[]
}

export interface SidebarFooterUser {
  name: string
  subtitle?: string
  avatar?: React.ReactNode
  menuItems?: { key: string; label: string; icon?: React.ReactNode }[]
}

export interface SidebarProps {
  logo?: React.ReactNode
  items?: SidebarItem[]
  activeKey?: string
  expandedKeys?: Set<string>
  collapsed?: boolean
  footerUser?: SidebarFooterUser
  onItemPress?: (key: string) => void
  footer?: React.ReactNode
  className?: string
}

export function Sidebar({
  logo,
  items = [],
  activeKey,
  expandedKeys: controlledExpanded,
  collapsed = false,
  footerUser,
  onItemPress,
  footer,
  className,
}: SidebarProps) {
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(new Set())
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const expanded = controlledExpanded ?? internalExpanded

  const toggleExpand = (key: string) => {
    if (controlledExpanded) return // controlled externally
    setInternalExpanded(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <aside
      className={clsx(
        'flex flex-col gap-md py-xl px-sm min-h-full bg-bg border-r-[0.5px] border-border transition-[width] duration-200',
        collapsed ? 'w-[56px] items-center' : 'w-[268px]',
        className,
      )}
    >
      {/* Logo */}
      {logo && (
        <div className={clsx('flex items-center mb-md', collapsed ? 'justify-center' : 'px-md')}>
          {logo}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1" aria-label="Sidebar navigation">
        <ul className="list-none m-0 p-0 flex flex-col gap-2">
          {items.map(item => {
            const isActive = item.key === activeKey || item.subItems?.some(s => s.key === activeKey)
            const isExpanded = expanded.has(item.key)
            const hasChildren = item.subItems && item.subItems.length > 0

            return (
              <li key={item.key}>
                <button
                  className={clsx(
                    'flex flex-row items-center gap-2 py-2 w-full border-none rounded-md font-sans text-md cursor-pointer text-left outline-none',
                    collapsed ? 'justify-center px-0' : 'px-md',
                    'hover:bg-bg-hover hover:text-primary',
                    'focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]',
                    isActive && hasChildren && isExpanded
                      ? 'bg-primary text-text-on-primary font-semibold'
                      : isActive
                        ? 'text-primary font-semibold bg-bg-hover'
                        : 'bg-transparent font-regular text-text',
                  )}
                  onClick={() => {
                    if (hasChildren) toggleExpand(item.key)
                    else onItemPress?.(item.key)
                  }}
                  aria-current={isActive && !hasChildren ? 'page' : undefined}
                  aria-expanded={hasChildren ? isExpanded : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon && (
                    <span
                      className={clsx(
                        'flex items-center shrink-0 w-[24px] h-[24px]',
                        isActive && hasChildren && isExpanded && 'brightness-0 invert',
                      )}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  )}
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && hasChildren && (
                    <span
                      className={clsx(
                        'flex items-center shrink-0 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                        isActive && isExpanded && 'brightness-0 invert',
                      )}
                      aria-hidden="true"
                    >
                      <img src="/icons/icon-chevron-down.svg" alt="" width={24} height={24} />
                    </span>
                  )}
                </button>
                {!collapsed && hasChildren && isExpanded && (
                  <ul className="list-none m-0 p-0 flex flex-col gap-2 mt-2">
                    {item.subItems!.map(sub => {
                      const isSubActive = sub.key === activeKey
                      return (
                        <li key={sub.key}>
                          <button
                            className={clsx(
                              'flex items-center py-2 pr-md pl-[56px] w-full border-none rounded-md font-sans text-md cursor-pointer text-left outline-none',
                              'hover:bg-bg-hover hover:text-primary',
                              'focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]',
                              isSubActive
                                ? 'bg-primary text-text-on-primary font-semibold'
                                : 'bg-transparent font-regular text-text',
                            )}
                            onClick={() => onItemPress?.(sub.key)}
                            aria-current={isSubActive ? 'page' : undefined}
                          >
                            {sub.label}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer user */}
      {footerUser && (
        <div className="relative border-t border-border pt-md">
          <button
            className={clsx(
              'flex items-center gap-2 w-full border-none rounded-md font-sans text-md cursor-pointer text-left outline-none',
              collapsed ? 'justify-center p-2' : 'px-md py-2',
              userMenuOpen
                ? 'bg-primary text-text-on-primary'
                : 'bg-transparent text-text hover:bg-bg-hover hover:text-primary',
              'focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]',
            )}
            onClick={() => setUserMenuOpen(v => !v)}
            aria-expanded={userMenuOpen}
          >
            {footerUser.avatar && (
              <span className="flex items-center shrink-0 w-[24px] h-[24px]" aria-hidden="true">
                {footerUser.avatar}
              </span>
            )}
            {!collapsed && (
              <>
                <span className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm truncate">{footerUser.name}</span>
                  {footerUser.subtitle && (
                    <span className={clsx('text-xs truncate', userMenuOpen ? 'text-text-on-primary/70' : 'text-text-secondary')}>
                      {footerUser.subtitle}
                    </span>
                  )}
                </span>
                <span
                  className={clsx(
                    'flex items-center shrink-0 transition-transform duration-200',
                    userMenuOpen && 'rotate-180',
                    userMenuOpen && 'brightness-0 invert',
                  )}
                  aria-hidden="true"
                >
                  <img src="/icons/icon-chevron-down.svg" alt="" width={20} height={20} />
                </span>
              </>
            )}
          </button>
          {userMenuOpen && !collapsed && footerUser.menuItems && (
            <ul className="list-none m-0 p-0 flex flex-col gap-2 mt-2">
              {footerUser.menuItems.map(mi => (
                <li key={mi.key}>
                  <button
                    className={clsx(
                      'flex items-center gap-2 py-2 px-md w-full bg-transparent border-none rounded-md font-sans text-md font-regular text-text cursor-pointer text-left outline-none',
                      'hover:bg-bg-hover hover:text-primary',
                      'focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]',
                    )}
                    onClick={() => onItemPress?.(mi.key)}
                  >
                    {mi.icon && <span className="flex items-center shrink-0 w-[20px] h-[20px]" aria-hidden="true">{mi.icon}</span>}
                    <span>{mi.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Static footer (Powered by...) */}
      {footer && (
        <div className={clsx('px-md', collapsed && 'hidden')}>
          {footer}
        </div>
      )}
    </aside>
  )
}
