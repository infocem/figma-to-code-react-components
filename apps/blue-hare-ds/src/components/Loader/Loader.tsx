import clsx from 'clsx'

export type LoaderSize = 'x-small' | 'small' | 'medium' | 'large'
export type LoaderType = 'primary' | 'secondary'

export interface LoaderProps {
  size?: LoaderSize
  type?: LoaderType
  label?: string
  className?: string
}

const sizeMap: Record<LoaderSize, string> = {
  'large':   'w-[50px] h-[50px]',
  'medium':  'w-[40px] h-[40px]',
  'small':   'w-[30px] h-[30px]',
  'x-small': 'w-[20px] h-[20px]',
}

const dotSizeMap: Record<LoaderSize, string> = {
  'large':   'w-[12px] h-[12px]',
  'medium':  'w-[9.6px] h-[9.6px]',
  'small':   'w-[7.2px] h-[7.2px]',
  'x-small': 'w-[4.8px] h-[4.8px]',
}

const typeColorMap: Record<LoaderType, string> = {
  primary:   'bg-primary',
  secondary: 'bg-[var(--color-info)]',
}

// Each dot: [top%, left%, animation-delay]
const DOT_POSITIONS: [string, string, string][] = [
  ['2%',  '38%', '0s'],    // dot-1 top-center
  ['74%', '38%', '0.6s'],  // dot-2 bottom-center
  ['22%', '2%',  '1.0s'],  // dot-3 top-left
  ['58%', '2%',  '0.8s'],  // dot-4 bottom-left
  ['58%', '74%', '0.4s'],  // dot-5 bottom-right
  ['22%', '74%', '0.2s'],  // dot-6 top-right
]

export function Loader({ size = 'medium', type = 'primary', label = 'Loading...', className }: LoaderProps) {
  return (
    <div
      className={clsx('relative inline-block flex-shrink-0', sizeMap[size], className)}
      role="status"
      aria-label={label}
    >
      {DOT_POSITIONS.map(([top, left, delay], i) => (
        <span
          key={i}
          className={clsx(
            'absolute rounded-full loader-dot-fade',
            dotSizeMap[size],
            typeColorMap[type]
          )}
          style={{ top, left, animationDelay: delay }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
