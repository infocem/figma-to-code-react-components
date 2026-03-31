import clsx from 'clsx'

export interface AnchorItem {
  key: string
  label: string
}

export interface AnchorProps {
  items: AnchorItem[]
  activeKey?: string
  onItemClick?: (key: string) => void
  className?: string
}

export function Anchor({ items, activeKey, onItemClick, className }: AnchorProps) {
  return (
    <nav aria-label="Page sections" className={clsx('flex flex-col', className)}>
      <ol className="flex flex-col list-none m-0 p-0 border-l-2 border-border">
        {items.map(item => (
          <li key={item.key} className="flex">
            <a
              href={`#${item.key}`}
              onClick={e => { e.preventDefault(); onItemClick?.(item.key) }}
              className={clsx(
                'block py-2 px-sm font-sans text-md font-regular text-text-secondary no-underline border-l-2 border-transparent -ml-[2px] outline-none transition-[color,border-color] duration-150',
                'hover:text-primary hover:border-l-primary-hover',
                'focus-visible:rounded-sm focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]',
                item.key === activeKey && 'text-primary border-l-primary font-semibold'
              )}
              aria-current={item.key === activeKey ? 'true' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
