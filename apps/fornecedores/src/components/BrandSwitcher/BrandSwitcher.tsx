import { useEffect, useState } from 'react'
import './BrandSwitcher.css'

type BrandId = 'liber' | 'teste'

const brands: { id: BrandId; label: string; color: string }[] = [
  { id: 'liber', label: 'Brand liber', color: '#1E4D6D' },
  { id: 'teste', label: 'Brand teste', color: '#007D57' },
]

export function BrandSwitcher() {
  const [active, setActive] = useState<BrandId>('liber')

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', active)
  }, [active])

  return (
    <div className="brand-switcher" role="group" aria-label="Selecionar brand">
      <span className="brand-switcher__label">Brand</span>
      <div className="brand-switcher__options">
        {brands.map(b => (
          <button
            key={b.id}
            className={`brand-switcher__btn${b.id === active ? ' brand-switcher__btn--active' : ''}`}
            aria-pressed={b.id === active}
            onClick={() => setActive(b.id)}
          >
            <span
              className="brand-switcher__dot"
              style={{ backgroundColor: b.color }}
              aria-hidden
            />
            {b.label}
          </button>
        ))}
      </div>
    </div>
  )
}
