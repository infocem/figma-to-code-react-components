import { useRef } from 'react'
import { useLink } from 'react-aria'
import clsx from 'clsx'
import { ExternalLinkIcon } from '../Icons'

export interface BreadcrumbItem {
  label: string
  href?: string
  showExternalIcon?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

function BreadcrumbLink({ item, isCurrent }: { item: BreadcrumbItem; isCurrent: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { linkProps } = useLink({ href: item.href, isDisabled: isCurrent, elementType: 'a' }, ref)

  if (isCurrent) {
    return (
      <span
        className="font-sans text-md font-regular leading-md outline-none text-text-secondary cursor-default"
        aria-current="page"
      >
        {item.label}
      </span>
    )
  }

  return (
    <a
      {...linkProps}
      ref={ref}
      href={item.href}
      className={clsx(
        'inline-flex items-center gap-1 font-sans text-md font-regular leading-md outline-none',
        'text-primary no-underline cursor-pointer',
        'hover:text-primary-hover',
        'focus-visible:rounded-sm focus-visible:shadow-[0_0_0_2px_var(--color-primary)]'
      )}
    >
      {item.showExternalIcon && (
        <ExternalLinkIcon size={14} className="shrink-0" />
      )}
      {item.label}
    </a>
  )
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={clsx(className)}>
      <ol className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
        {items.map((item, i) => {
          const isCurrent = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              <BreadcrumbLink item={item} isCurrent={isCurrent} />
              {!isCurrent && (
                <img src="/icons/icon-chevron-right.svg" alt="" aria-hidden="true" width={16} height={16} className="opacity-40" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
