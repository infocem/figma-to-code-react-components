import './Pagination.css'

interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
}

export function Pagination({ current, total, onChange }: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        className="pagination__item pagination__item--arrow"
        aria-label="Página anterior"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        ‹
      </button>

      {pages.map(p => (
        <button
          key={p}
          className={`pagination__item${p === current ? ' pagination__item--selected' : ''}`}
          aria-label={`Página ${p}`}
          aria-current={p === current ? 'page' : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="pagination__item pagination__item--arrow"
        aria-label="Próxima página"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        ›
      </button>
    </nav>
  )
}
