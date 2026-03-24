import './Sidebar.css'
import {
  IconDashboard,
  IconReceipt,
  IconCash,
  IconStore,
  IconAdjustments,
  IconGrid,
  IconAccount,
} from '../Icons'

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { id: 'dashboard',  icon: <IconDashboard />,   label: 'Dashboard' },
  { id: 'recebiveis', icon: <IconReceipt />,      label: 'Recebíveis' },
  { id: 'caixa',      icon: <IconCash />,         label: 'Caixa' },
  { id: 'sacados',    icon: <IconStore />,        label: 'Sacados' },
  { id: 'ajustes',    icon: <IconAdjustments />,  label: 'Ajustes' },
  { id: 'relatorios', icon: <IconGrid />,         label: 'Relatórios' },
]

interface SidebarProps {
  activeItem?: string
}

export function Sidebar({ activeItem = 'sacados' }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Menu principal">
      <ul className="sidebar__menu" role="list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`sidebar__item${item.id === activeItem ? ' sidebar__item--selected' : ''}`}
              aria-label={item.label}
              aria-current={item.id === activeItem ? 'page' : undefined}
            >
              {item.icon}
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar__footer">
        <button className="sidebar__item" aria-label="Conta">
          <IconAccount />
        </button>
      </div>
    </nav>
  )
}
