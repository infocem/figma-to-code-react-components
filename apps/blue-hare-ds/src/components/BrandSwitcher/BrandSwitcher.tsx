import { useState } from 'react'
import { useButton } from 'react-aria'
import { useRef } from 'react'
import clsx from 'clsx'

type Brand = 'liber' | 'teste'

const BRANDS: { key: Brand; label: string; color: string }[] = [
  { key: 'liber', label: 'Brand Liber', color: '#1e4d6d' },
  { key: 'teste', label: 'Brand Teste', color: '#007d57' },
]

function BrandButton({
  brand,
  isActive,
  onPress,
}: {
  brand: (typeof BRANDS)[number]
  isActive: boolean
  onPress: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress, 'aria-pressed': isActive }, ref)
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={clsx(
        'flex items-center gap-4 w-full px-4 py-3 border-none rounded-sm cursor-pointer font-sans text-sm text-left transition-[background] duration-100',
        'hover:bg-bg-hover',
        isActive
          ? 'bg-bg-hover font-semibold text-primary'
          : 'bg-transparent text-text',
      )}
      title={brand.label}
    >
      <span className="w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ background: brand.color }} />
      <span className="flex-1">{brand.label}</span>
    </button>
  )
}

export function BrandSwitcher() {
  const [active, setActive] = useState<Brand>('liber')
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: toggleProps } = useButton(
    { onPress: () => setOpen(v => !v), 'aria-expanded': open, 'aria-label': 'Trocar brand' },
    toggleRef,
  )

  function selectBrand(key: Brand) {
    setActive(key)
    setOpen(false)
    if (key === 'liber') {
      document.documentElement.removeAttribute('data-brand')
    } else {
      document.documentElement.setAttribute('data-brand', key)
    }
  }

  const activeBrand = BRANDS.find(b => b.key === active)!

  return (
    <div className="fixed top-8 right-8 z-[9999] flex flex-col items-end gap-2">
      <button
        {...toggleProps}
        ref={toggleRef}
        className="flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-full cursor-pointer shadow-sm font-sans text-sm font-semibold text-text-secondary transition-[box-shadow] duration-150 hover:shadow-md"
      >
        <span className="w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ background: activeBrand.color }} />
        <span className="text-xs text-text-secondary uppercase tracking-[0.05em]">Brand</span>
      </button>

      {open && (
        <div
          className="flex flex-col gap-1 bg-bg border border-border rounded-md shadow-dropdown p-2 min-w-[160px]"
          role="menu"
        >
          {BRANDS.map(brand => (
            <BrandButton
              key={brand.key}
              brand={brand}
              isActive={active === brand.key}
              onPress={() => selectBrand(brand.key)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
