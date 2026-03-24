import './App.css'
import { Sidebar } from './components/Sidebar/Sidebar'
import { TopBar } from './components/TopBar/TopBar'
import { FornecedoresPage } from './components/FornecedoresPage'

const breadcrumbs = [
  { label: 'Fornecedores', href: '/fornecedores' },
  { label: 'Todos os fornecedores' },
]

export default function App() {
  return (
    <div className="app">
      <Sidebar activeItem="sacados" />

      <div className="app__main">
        <TopBar breadcrumbs={breadcrumbs} />

        {/* Main scroll area — layout_3L3ZZ9: column, overflow-y scroll */}
        <div className="app__scroll">
          <FornecedoresPage />
        </div>
      </div>
    </div>
  )
}
