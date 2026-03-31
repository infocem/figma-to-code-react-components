import clsx from 'clsx'

export type ListIndicatorType = 'process' | 'icon'

export interface ListItem {
  title?: string
  description?: string
  icon?: React.ReactNode
  indicatorType?: ListIndicatorType
}

export interface ListProps {
  heading?: string
  items: ListItem[]
  className?: string
}

export function List({ heading, items, className }: ListProps) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {heading && (
        <h2 className="font-sans text-2xl font-[500] leading-[1.17] text-text m-0">
          {heading}
        </h2>
      )}
      <ol className="flex flex-col gap-2 list-none m-0 p-0">
        {items.map((item, i) => (
          <li key={i} className="flex flex-row items-start gap-sm">
            <span
              className={clsx(
                'flex items-center justify-center w-[24px] h-[24px] rounded-full shrink-0',
                item.indicatorType === 'icon' ? 'bg-transparent' : 'bg-bg-hover',
              )}
              aria-hidden="true"
            >
              {item.indicatorType === 'icon' && item.icon
                ? item.icon
                : <span className="font-sans text-md font-regular text-primary-hover leading-none">{i + 1}</span>
              }
            </span>
            <div className="flex flex-col gap-[4px] flex-1">
              {item.title && (
                <span className="font-sans text-md font-regular leading-[1.5] text-text">
                  {item.title}
                </span>
              )}
              {item.description && (
                <p className="font-sans text-md font-regular leading-md text-text m-0">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
