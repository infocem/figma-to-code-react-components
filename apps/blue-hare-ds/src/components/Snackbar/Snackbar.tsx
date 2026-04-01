import { useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'
import iconSnackbarDefault from '../../../public/icons/icon-snackbar-default.svg'
import iconSnackbarInfo from '../../../public/icons/icon-snackbar-info.svg'
import iconSnackbarSuccess from '../../../public/icons/icon-snackbar-success.svg'
import iconSnackbarWarning from '../../../public/icons/icon-snackbar-warning.svg'
import iconSnackbarError from '../../../public/icons/icon-snackbar-error.svg'
import iconX from '../../../public/icons/icon-x.svg'

export type SnackbarType = 'default' | 'information' | 'success' | 'warning' | 'error'

export interface SnackbarProps {
  type?: SnackbarType
  title?: string
  description?: string
  linkLabel?: string
  onLinkClick?: () => void
  onClose?: () => void
  progress?: number
  className?: string
}

const titleColorClasses: Record<SnackbarType, string> = {
  default: 'text-primary-hover',
  information: 'text-info-text',
  success: 'text-success-text',
  warning: 'text-warning-text',
  error: 'text-error-text',
}

const iconByType: Record<SnackbarType, string> = {
  default: iconSnackbarDefault,
  information: iconSnackbarInfo,
  success: iconSnackbarSuccess,
  warning: iconSnackbarWarning,
  error: iconSnackbarError,
}

export function Snackbar({
  type = 'default',
  title,
  description,
  linkLabel,
  onLinkClick,
  onClose,
  progress,
  className,
}: SnackbarProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const linkRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: closeProps } = useButton({ onPress: onClose, 'aria-label': 'Close' }, closeRef)
  const { buttonProps: linkProps } = useButton({ onPress: onLinkClick }, linkRef)

  return (
    <div
      className={clsx(
        'relative w-[532px] bg-bg border border-border rounded-lg shadow-snackbar overflow-hidden',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-row gap-md p-md">
        <span className="flex items-center shrink-0" aria-hidden="true">
          <img src={iconByType[type]} alt="" width={24} height={24} />
        </span>
        <div className="flex flex-col gap-md flex-1">
          <div className="flex flex-col gap-2">
            {title && (
              <span
                className={clsx(
                  'font-sans text-lg font-semibold leading-[1.33]',
                  titleColorClasses[type],
                )}
              >
                {title}
              </span>
            )}
            {description && (
              <p className="font-sans text-md font-regular leading-md text-text m-0">
                {description}
              </p>
            )}
          </div>
          {linkLabel && onLinkClick && (
            <button
              {...linkProps}
              ref={linkRef}
              className="inline-flex items-center gap-sm bg-none border-none p-0 font-sans text-md font-regular text-primary-hover cursor-pointer outline-none underline hover:text-primary focus-visible:rounded-sm focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]"
            >
              {linkLabel}
            </button>
          )}
        </div>
        {onClose && (
          <button
            {...closeProps}
            ref={closeRef}
            className="flex items-start shrink-0 bg-none border-none p-0 cursor-pointer outline-none focus-visible:rounded-sm focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]"
          >
            <img src={iconX} alt="Close" width={20} height={20} />
          </button>
        )}
      </div>
      {progress !== undefined && (
        <div className="h-[4px] bg-bg-disabled absolute bottom-0 left-0 right-0" aria-hidden="true">
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-in-out"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
    </div>
  )
}
