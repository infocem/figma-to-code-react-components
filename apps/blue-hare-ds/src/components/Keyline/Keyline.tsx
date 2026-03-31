import clsx from 'clsx'

export type KeylineOrientation = 'horizontal' | 'vertical'

export interface KeylineProps {
  orientation?: KeylineOrientation
  className?: string
}

export function Keyline({ orientation = 'horizontal', className }: KeylineProps) {
  return (
    <hr
      className={clsx(
        'border-none bg-border m-0 shrink-0',
        orientation === 'horizontal' && 'w-full h-px',
        orientation === 'vertical' && 'w-px h-full self-stretch',
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  )
}
