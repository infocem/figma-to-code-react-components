/* Real SVG icons downloaded from Figma (Blue Hare DS)
   Served from /public/icons/ via Vite's static asset pipeline
   ------------------------------------------------------------------ */

interface IconProps {
  size?: number
  alt?: string
  className?: string
}

function Icon({ src, size = 24, alt = '', className }: IconProps & { src: string }) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      className={className}
      draggable={false}
    />
  )
}

export const IconDashboard   = (p: IconProps) => <Icon src="/icons/icon-dashboard.svg"   {...p} />
export const IconReceipt     = (p: IconProps) => <Icon src="/icons/icon-receipt.svg"     {...p} />
export const IconCash        = (p: IconProps) => <Icon src="/icons/icon-cash.svg"        {...p} />
export const IconStore       = (p: IconProps) => <Icon src="/icons/icon-store.svg"       {...p} />
export const IconAdjustments = (p: IconProps) => <Icon src="/icons/icon-adjustments.svg" {...p} />
export const IconGrid        = (p: IconProps) => <Icon src="/icons/icon-grid.svg"        {...p} />
export const IconPlus        = (p: IconProps) => <Icon src="/icons/icon-plus.svg"        {...p} />
export const IconChevronRight= (p: IconProps) => <Icon src="/icons/icon-chevron-right.svg" {...p} />
export const IconSort        = (p: IconProps) => <Icon src="/icons/icon-sort.svg"        {...p} />
export const IconFilter      = (p: IconProps) => <Icon src="/icons/icon-filter.svg"      {...p} />
export const IconDownload    = (p: IconProps) => <Icon src="/icons/icon-download.svg"    {...p} />
export const IconColumns     = (p: IconProps) => <Icon src="/icons/icon-columns.svg"     {...p} />
export const IconAccount     = (p: IconProps) => <Icon src="/icons/icon-account.svg"     {...p} />
export const IconLibrary     = (p: IconProps) => <Icon src="/icons/icon-library.svg"     {...p} />
export const IconChevronDown = (p: IconProps) => <Icon src="/icons/icon-chevron-down.svg" {...p} />
