import { useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'

export type MessageType = 'info' | 'success' | 'warning' | 'error'

const iconByType: Record<MessageType, string> = {
  info:    '/icons/icon-message-info.svg',
  success: '/icons/icon-message-success.svg',
  warning: '/icons/icon-message-warning.svg',
  error:   '/icons/icon-message-error.svg',
}

const TYPE_CLASSES: Record<MessageType, string> = {
  info:    'bg-info-bg border-info text-info-text',
  success: 'bg-success-bg border-success text-success-text',
  warning: 'bg-warning-bg border-warning text-warning-text',
  error:   'bg-error-bg border-error text-error-text',
}

export interface MessageProps {
  type?: MessageType
  title?: string
  description?: string
  onClose?: () => void
  className?: string
}

export function Message({ type = 'info', title, description, onClose, className }: MessageProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress: onClose, 'aria-label': 'Close message' }, closeRef)

  return (
    <div
      className={clsx(
        'inline-flex flex-row items-stretch gap-md py-2 px-md rounded-lg border-[1.5px] border-solid',
        TYPE_CLASSES[type],
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      <span className="flex items-center shrink-0" aria-hidden="true">
        <img src={iconByType[type]} alt="" width={24} height={24} />
      </span>
      <div className="flex flex-col gap-[2px] flex-1">
        {title && (
          <span className="font-sans text-md font-semibold leading-[2]">
            {title}
          </span>
        )}
        {description && (
          <p className="font-sans text-md font-regular leading-md m-0">
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <button
          {...buttonProps}
          ref={closeRef}
          className="flex items-center shrink-0 border-none bg-transparent cursor-pointer text-inherit p-0 outline-none self-start focus-visible:rounded-sm focus-visible:shadow-[0_0_0_1.5px_currentColor]"
        >
          <img src="/icons/icon-message-close.svg" alt="Close" width={16} height={16} />
        </button>
      )}
    </div>
  )
}
