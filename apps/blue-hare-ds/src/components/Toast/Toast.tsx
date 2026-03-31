import clsx from 'clsx'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastProps {
  type?: ToastType
  title?: string
  description?: string
  className?: string
}

const TYPE_CLASSES: Record<ToastType, string> = {
  info:    'bg-info-bg border-info text-info-text',
  success: 'bg-success-bg border-success text-success-text',
  warning: 'bg-warning-bg border-warning text-warning-text',
  error:   'bg-error-bg border-error text-error-text',
}

export function Toast({ type = 'info', title, description, className }: ToastProps) {
  return (
    <div
      className={clsx(
        'inline-flex flex-col gap-[2px] py-2 px-md rounded-lg border border-solid',
        TYPE_CLASSES[type],
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {title && (
        <span className="font-sans text-md font-semibold leading-[2]">
          {title}
        </span>
      )}
      {description && (
        <p className="font-sans text-sm font-regular leading-sm m-0">
          {description}
        </p>
      )}
    </div>
  )
}
