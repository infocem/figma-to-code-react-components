import { useRef } from 'react'
import { useLink } from 'react-aria'
import clsx from 'clsx'
import { ExternalLinkIcon, ArrowRightIcon } from '../Icons'

export type LinkVariant = 'basic' | 'inline' | 'standalone'

export interface LinkProps {
  children: React.ReactNode
  href?: string
  variant?: LinkVariant
  disabled?: boolean
  className?: string
  onPress?: () => void
}

export function Link({ children, href, variant = 'basic', disabled, className, onPress }: LinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { linkProps } = useLink(
    { href, isDisabled: disabled, onPress, elementType: 'a' },
    ref
  )

  return (
    <a
      {...linkProps}
      ref={ref}
      href={disabled ? undefined : href}
      className={clsx(
        'inline-flex items-center gap-1 font-sans text-md font-regular text-primary no-underline cursor-pointer relative outline-none',
        'focus-visible:rounded-sm focus-visible:shadow-[0_0_0_2px_var(--color-primary)]',
        !disabled && 'hover:text-primary-hover hover:bg-bg-hover hover:rounded-sm',
        disabled && 'text-text-disabled cursor-not-allowed pointer-events-none',
        variant === 'inline' && 'underline text-[inherit] font-[inherit]',
        variant === 'standalone' && 'font-semibold',
        className,
      )}
    >
      <ExternalLinkIcon size={14} className="shrink-0" />
      <span>{children}</span>
      <ArrowRightIcon size={14} className="shrink-0" />
    </a>
  )
}
