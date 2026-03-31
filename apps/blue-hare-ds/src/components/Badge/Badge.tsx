import clsx from 'clsx'

export type BadgeStatus = 'default' | 'information' | 'error' | 'warning' | 'success'
export type BadgeType = 'copy' | 'dot'

export interface BadgeProps {
  count?: number
  status?: BadgeStatus
  type?: BadgeType
  className?: string
}

const statusBg: Record<BadgeStatus, string> = {
  default:     'bg-primary',
  information: 'bg-info',
  error:       'bg-error',
  warning:     'bg-warning',
  success:     'bg-success',
}

export function Badge({ count = 0, status = 'default', type = 'copy', className }: BadgeProps) {
  const display = count > 99 ? '99+' : String(count)
  // Wider circle for 3-char values (99+)
  const copySize = display.length >= 3 ? 'w-[28px] h-[28px]' : 'w-[24px] h-[24px]'

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full shrink-0',
        statusBg[status],
        type === 'copy' && copySize,
        type === 'dot'  && 'w-[8px] h-[8px]',
        className,
      )}
      aria-label={type === 'copy' ? display : undefined}
    >
      {type === 'copy' && (
        <span className="font-sans text-xs font-semibold leading-none text-text-on-primary">
          {display}
        </span>
      )}
    </span>
  )
}
