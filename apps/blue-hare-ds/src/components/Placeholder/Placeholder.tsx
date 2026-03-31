import clsx from 'clsx'

export interface PlaceholderProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  width?: number | string
  height?: number | string
  className?: string
}

export function Placeholder({ title, description, icon, action, width, height, className }: PlaceholderProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-2',
        'border border-dashed border-border rounded-lg',
        'bg-bg-tag p-xl text-center min-h-[160px]',
        className
      )}
      style={{ width, height }}
    >
      {icon && (
        <span
          className="flex items-center justify-center text-text-secondary mb-2"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {title && (
        <p className="font-sans text-md font-semibold text-text m-0">
          {title}
        </p>
      )}
      {description && (
        <p className="font-sans text-md font-regular text-text-secondary m-0 max-w-[320px]">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
