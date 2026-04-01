import { useRef } from 'react'
import { useDialog } from 'react-aria'
import clsx from 'clsx'
import iconClose from '../../../public/icons/icon-close.svg'

export type DrawerPlacement = 'left' | 'right' | 'bottom'

export interface DrawerProps {
  title?: string
  isOpen: boolean
  onClose: () => void
  placement?: DrawerPlacement
  children?: React.ReactNode
  className?: string
}

export function Drawer({ title, isOpen, onClose, placement = 'right', children, className }: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { dialogProps, titleProps } = useDialog({ role: 'dialog', 'aria-label': title ?? 'Drawer' }, ref)

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-overlay z-[200]"
        role="presentation"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        {...dialogProps}
        ref={ref}
        className={clsx(
          'fixed z-[201] bg-bg flex flex-col shadow-drawer',
          placement === 'right' && 'top-0 right-0 bottom-0 w-[420px] max-w-[90vw] border-l border-border',
          placement === 'left' && 'top-0 left-0 bottom-0 w-[420px] max-w-[90vw] border-r border-border',
          placement === 'bottom' && 'bottom-0 left-0 right-0 max-h-[80vh] border-t border-border rounded-t-lg',
          className,
        )}
      >
        <div className="flex flex-row items-center justify-between p-md border-b border-border shrink-0">
          {title && (
            <h2 {...titleProps} className="font-sans text-lg font-semibold text-text m-0">
              {title}
            </h2>
          )}
          <button
            className="flex items-center justify-center bg-none border-none cursor-pointer p-2 rounded-sm outline-none hover:bg-bg-hover focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <img src={iconClose} alt="" width={20} height={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-md">{children}</div>
      </div>
    </>
  )
}
