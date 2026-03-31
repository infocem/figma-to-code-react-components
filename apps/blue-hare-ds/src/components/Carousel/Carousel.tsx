import { useState, useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'

export interface CarouselProps {
  items: React.ReactNode[]
  label?: string
  className?: string
}

export function Carousel({ items, label = 'Carousel', className }: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const { buttonProps: prevProps } = useButton(
    { onPress: () => setCurrent(c => Math.max(0, c - 1)), isDisabled: current === 0, 'aria-label': 'Previous' },
    prevRef
  )
  const { buttonProps: nextProps } = useButton(
    { onPress: () => setCurrent(c => Math.min(items.length - 1, c + 1)), isDisabled: current === items.length - 1, 'aria-label': 'Next' },
    nextRef
  )

  return (
    <div
      className={clsx('flex flex-col gap-md w-full', className)}
      aria-label={label}
      aria-roledescription="carousel"
    >
      {/* Track */}
      <div className="relative overflow-hidden rounded-lg" aria-live="polite">
        {items.map((item, i) => (
          <div
            key={i}
            className={clsx('w-full', i === current ? 'block' : 'hidden')}
            aria-hidden={i !== current}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-row items-center gap-md">
        <button
          {...prevProps}
          ref={prevRef}
          className={clsx(
            'flex items-center justify-center w-[40px] h-[40px] rounded-full border border-primary outline-none flex-shrink-0 cursor-pointer bg-transparent',
            'focus-visible:shadow-[0_0_0_2px_var(--color-primary)]',
            'hover:not-disabled:bg-bg-hover',
            current === 0 && 'border-border-disabled cursor-not-allowed opacity-50',
          )}
        >
          <img src="/icons/icon-chevron-left.svg" alt="" aria-hidden="true" width={24} height={24} />
        </button>

        {/* Progress track */}
        <div className="flex-1 h-[4px] rounded-full bg-border overflow-hidden" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={items.length}>
          <div
            className="h-full bg-primary rounded-full transition-[width] duration-300"
            style={{ width: `${((current + 1) / items.length) * 100}%` }}
          />
        </div>

        <button
          {...nextProps}
          ref={nextRef}
          className={clsx(
            'flex items-center justify-center w-[40px] h-[40px] rounded-full border border-primary outline-none flex-shrink-0 cursor-pointer bg-transparent',
            'focus-visible:shadow-[0_0_0_2px_var(--color-primary)]',
            'hover:not-disabled:bg-bg-hover',
            current === items.length - 1 && 'border-border-disabled cursor-not-allowed opacity-50',
          )}
        >
          <img src="/icons/icon-chevron-right.svg" alt="" aria-hidden="true" width={24} height={24} />
        </button>
      </div>
    </div>
  )
}
