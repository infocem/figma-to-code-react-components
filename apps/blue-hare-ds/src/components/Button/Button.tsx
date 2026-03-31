import { useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'
import { PlusIcon, AddIcon } from '../Icons'

export type ButtonVariant = 'primary' | 'transparent' | 'outline'
export type ButtonStatus = 'default' | 'hover' | 'focus' | 'disabled'

export interface ButtonProps {
  children?: React.ReactNode
  variant?: ButtonVariant
  disabled?: boolean
  onPress?: () => void
  /** Show icon before text */
  iconLeft?: boolean
  /** Show icon after text */
  iconRight?: boolean
  /** Icon-only button (no text) */
  iconOnly?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const baseClasses =
  'inline-flex flex-row justify-center items-center gap-md rounded-md border-none cursor-pointer relative font-sans text-md font-regular leading-md no-underline transition-[background,color,border-color] duration-150 whitespace-nowrap focus-ring'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-text-on-primary border border-transparent hover:not-disabled:bg-primary-hover disabled:bg-bg-disabled disabled:text-text-secondary disabled:cursor-not-allowed',
  transparent:
    'bg-transparent text-primary-hover border border-transparent hover:not-disabled:bg-bg-hover disabled:text-text-secondary disabled:cursor-not-allowed',
  outline:
    'bg-transparent text-primary-hover border border-primary hover:not-disabled:bg-bg-hover hover:not-disabled:border-primary-hover disabled:bg-bg-disabled disabled:border-border-disabled disabled:text-text-secondary disabled:cursor-not-allowed',
}

export function Button({
  children,
  variant = 'primary',
  disabled,
  onPress,
  iconLeft,
  iconRight,
  iconOnly,
  className,
  type = 'button',
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(
    { onPress, isDisabled: disabled, type },
    ref
  )

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={clsx(
        baseClasses,
        iconOnly ? 'p-sm' : 'py-sm px-lg',
        variantClasses[variant],
        className
      )}
    >
      {!iconOnly && iconLeft && (
        <PlusIcon className="w-icon-md h-icon-md shrink-0" size={24} />
      )}
      {iconOnly ? (
        <AddIcon className="w-icon-md h-icon-md shrink-0" size={24} />
      ) : (
        <span>{children}</span>
      )}
      {!iconOnly && iconRight && (
        <PlusIcon className="w-icon-md h-icon-md shrink-0" size={24} />
      )}
    </button>
  )
}
