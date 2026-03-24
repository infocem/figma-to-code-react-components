import './TopBar.css'
import { IconChevronRight } from '../Icons'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopBarProps {
  breadcrumbs: BreadcrumbItem[]
}

function LiberLogo() {
  return (
    <img
      src="/icons/logo-liber.svg"
      width={70}
      height={24}
      alt="Liber Capital"
      draggable={false}
    />
  )
}

export function TopBar({ breadcrumbs }: TopBarProps) {
  return (
    <header className="top-bar" role="banner">
      <nav className="top-bar__breadcrumb" aria-label="Navegação estrutural">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          return (
            <span key={index} className="top-bar__breadcrumb-item">
              {crumb.href && !isLast ? (
                <a
                  href={crumb.href}
                  className="top-bar__breadcrumb-link"
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  className={`top-bar__breadcrumb-label${isLast ? ' top-bar__breadcrumb-label--current' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast && (
                <span className="top-bar__breadcrumb-sep" aria-hidden>
                  <IconChevronRight size={16} />
                </span>
              )}
            </span>
          )
        })}
      </nav>

      <div className="top-bar__logo">
        <LiberLogo />
      </div>
    </header>
  )
}
