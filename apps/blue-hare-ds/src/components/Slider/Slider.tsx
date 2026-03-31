import clsx from 'clsx'
import './Slider.css'

export type SliderType = 'default' | 'range'

export interface SliderProps {
  type?: SliderType
  value?: number
  rangeValue?: [number, number]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  onChange?: (value: number) => void
  onRangeChange?: (value: [number, number]) => void
  className?: string
}

export function Slider({
  type = 'default',
  value = 0,
  rangeValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  disabled,
  label,
  onChange,
  onRangeChange,
  className,
}: SliderProps) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <div className={clsx('flex flex-col gap-2 w-full', disabled && 'slider--disabled', className)}>
      {label && (
        <label className="font-sans text-sm font-regular text-text">
          {label}
        </label>
      )}

      {type === 'default' ? (
        <div className="relative h-3 flex items-center">
          {/* Track */}
          <div className="absolute left-0 right-0 h-1 bg-bg-disabled rounded-full pointer-events-none">
            <div
              className={clsx(
                'absolute top-0 left-0 h-full rounded-full pointer-events-none',
                disabled ? 'bg-[var(--color-text-disabled)]' : 'bg-primary'
              )}
              style={{ width: `${pct(value)}%` }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={e => onChange?.(Number(e.target.value))}
            className={clsx(
              'slider__input absolute left-0 w-full h-3 opacity-0 margin-0 appearance-none',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
            aria-label={label ?? 'Slider'}
          />
        </div>
      ) : (
        <div className="relative h-3 flex items-center">
          {/* Track */}
          <div className="absolute left-0 right-0 h-1 bg-bg-disabled rounded-full pointer-events-none">
            <div
              className={clsx(
                'absolute top-0 h-full pointer-events-none',
                disabled ? 'bg-[var(--color-text-disabled)]' : 'bg-primary'
              )}
              style={{
                left: `${pct(rangeValue[0])}%`,
                width: `${pct(rangeValue[1]) - pct(rangeValue[0])}%`,
              }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={rangeValue[0]}
            disabled={disabled}
            onChange={e => onRangeChange?.([Number(e.target.value), rangeValue[1]])}
            className={clsx(
              'slider__input slider__input--range-start absolute left-0 w-full h-3 opacity-0 m-0 appearance-none pointer-events-none z-[2]',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
            aria-label={`${label ?? 'Range'} start`}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={rangeValue[1]}
            disabled={disabled}
            onChange={e => onRangeChange?.([rangeValue[0], Number(e.target.value)])}
            className={clsx(
              'slider__input slider__input--range-end absolute left-0 w-full h-3 opacity-0 m-0 appearance-none pointer-events-none z-[3]',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
            aria-label={`${label ?? 'Range'} end`}
          />
        </div>
      )}
    </div>
  )
}
