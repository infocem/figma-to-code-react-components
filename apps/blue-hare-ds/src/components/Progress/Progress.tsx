import clsx from 'clsx'

export type ProgressVariant = 'default' | 'success' | 'error' | 'warning'
export type ProgressType = 'linear' | 'circular'

export interface ProgressProps {
  value: number
  max?: number
  variant?: ProgressVariant
  type?: ProgressType
  size?: number
  showLabel?: boolean
  label?: string
  className?: string
}

const fillVariantClass: Record<ProgressVariant, string> = {
  default: 'bg-primary',
  success: 'bg-[var(--color-success)]',
  error:   'bg-[var(--color-error)]',
  warning: 'bg-[var(--color-warning)]',
}

const strokeVariantColor: Record<ProgressVariant, string> = {
  default: 'var(--color-primary)',
  success: 'var(--color-success)',
  error:   'var(--color-error)',
  warning: 'var(--color-warning)',
}

function CircularProgress({ pct, variant, size, label }: { pct: number; variant: ProgressVariant; size: number; label?: string }) {
  const strokeWidth = size >= 120 ? 10 : 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${Math.round(pct)}%`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg-tag)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeVariantColor[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300 ease-in-out"
        />
      </svg>
      <span className="absolute font-sans text-lg font-semibold text-text-secondary">
        {Math.round(pct)}%
      </span>
    </div>
  )
}

export function Progress({ value, max = 100, variant = 'default', type = 'linear', size = 120, showLabel, label, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  if (type === 'circular') {
    return (
      <div className={clsx('inline-flex flex-col items-center gap-2', className)}>
        <CircularProgress pct={pct} variant={variant} size={size} label={label} />
        {label && <span className="font-sans text-sm font-regular text-text">{label}</span>}
      </div>
    )
  }

  return (
    <div
      className={clsx('flex flex-col gap-2 w-full', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? `${Math.round(pct)}%`}
    >
      {label && (
        <span className="font-sans text-sm font-regular text-text">
          {label}
        </span>
      )}

      <div className="w-full h-2 rounded-full bg-bg-tag overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-[width] duration-300 ease-in-out',
            fillVariantClass[variant],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {showLabel && (
        <span className="font-sans text-sm text-text-secondary self-end" aria-hidden="true">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}
