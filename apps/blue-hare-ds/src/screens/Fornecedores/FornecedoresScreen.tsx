import { useState } from 'react'
import clsx from 'clsx'
import { Button } from '../../components/Button/Button'
import { Pagination } from '../../components/Pagination/Pagination'
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb'
import { Sidebar } from '../../components/Sidebar/Sidebar'

// ── Data ─────────────────────────────────────────────────────────────────────

export interface Fornecedor {
  id: string
  cnpj: string
  empresa: string
  contato: string
  acionistas: string
  status: 'approved' | 'pending' | 'inactive' | 'warning'
  statusLabel: string
  categoria: string
  regrasDaPlataforma: 'Ativo' | 'Inativo'
  credito: string
}

const allData: Fornecedor[] = [
  { id: '1', cnpj: '12.345.678/0001-90', empresa: 'Nova Era Transportes',        contato: 'financeiro@novaera.com',        acionistas: '3/3', status: 'pending',  statusLabel: 'Pendente', categoria: 'Grupo Beta',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 50.000,00'  },
  { id: '2', cnpj: '98.765.432/0001-01', empresa: 'Bela Vista Alimentos',        contato: 'comercial@belavista.com',       acionistas: '3/3', status: 'pending',  statusLabel: 'Pendente', categoria: 'Grupo Alfa',    regrasDaPlataforma: 'Inativo', credito: 'R$ 20.000,00'  },
  { id: '3', cnpj: '54.321.678/0001-12', empresa: 'Sol Nascente Agrícola',       contato: 'juridico@solnascente.com',      acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Gama',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 100.000,00' },
  { id: '4', cnpj: '78.901.234/0001-23', empresa: 'Caminho do Campo Ltda.',      contato: 'fiscal@caminhodocampo.com',     acionistas: '3/3', status: 'pending',  statusLabel: 'Pendente', categoria: 'Grupo Delta',   regrasDaPlataforma: 'Inativo', credito: 'R$ 30.000,00'  },
  { id: '5', cnpj: '34.567.890/0001-34', empresa: 'Horizonte Azul S.A.',         contato: 'rh@horizonteazul.com',          acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Épsilon', regrasDaPlataforma: 'Ativo',   credito: 'R$ 75.000,00'  },
  { id: '6', cnpj: '45.678.901/0001-45', empresa: 'Porto Seguro Commodities',    contato: 'ti@portoseguro.com',            acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Zeta',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 120.000,00' },
  { id: '7', cnpj: '56.789.012/0001-56', empresa: 'Estrela Guia Produtos',       contato: 'suporte@estrelaguia.com',       acionistas: '3/3', status: 'pending',  statusLabel: 'Pendente', categoria: 'Grupo Eta',     regrasDaPlataforma: 'Inativo', credito: 'R$ 40.000,00'  },
  { id: '8', cnpj: '67.890.123/0001-67', empresa: 'Unidos Venceremos S.A.',      contato: 'vendas@unidosvenceremos.com',   acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Teta',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 90.000,00'  },
  { id: '9', cnpj: '78.901.234/0001-78', empresa: 'Amanhecer Feliz Agronegócios',contato: 'qualidade@amanhecerfeliz.com',  acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Iota',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 150.000,00' },
]

// ── Status badge ──────────────────────────────────────────────────────────────

const statusClasses: Record<Fornecedor['status'], string> = {
  approved: 'bg-success-bg text-success-text',
  pending:  'bg-warning-bg text-warning-text',
  inactive: 'bg-bg-disabled text-text-disabled',
  warning:  'bg-error-bg text-error-text',
}

function StatusBadge({ status, label }: { status: Fornecedor['status']; label: string }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-4 py-[2px] rounded-full text-sm font-sans font-semibold whitespace-nowrap',
      statusClasses[status],
    )}>
      {label}
      <img src="/icons/icon-chevron-down.svg" alt="" width={14} height={14} className="opacity-70" />
    </span>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────

function FornecedoresTable({ data }: { data: Fornecedor[] }) {
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function handleSort(key: string) {
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(key); setSortDir('asc') }
  }

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortCol) return 0
    const av = String(a[sortCol as keyof Fornecedor] ?? '')
    const bv = String(b[sortCol as keyof Fornecedor] ?? '')
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  const columns = [
    { key: 'empresa',           label: 'Empresa',              sortable: true  },
    { key: 'contato',           label: 'Contato',              sortable: true  },
    { key: 'acionistas',        label: 'Acionistas',           sortable: false },
    { key: 'status',            label: 'Status',               sortable: true  },
    { key: 'categoria',         label: 'Categoria',            sortable: false },
    { key: 'regrasDaPlataforma',label: 'Regras da Plataforma', sortable: false },
    { key: 'credito',           label: 'Crédito',              sortable: false },
  ]

  const cellPx = 'px-8 py-4'

  return (
    <div className="bg-bg rounded-lg shadow-card p-8 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-8 mb-8">
        <Button variant="transparent" disabled>Redefinir</Button>
        <div className="flex gap-2">
          {[
            { icon: '/icons/icon-filter.svg',   label: 'Filtrar'  },
            { icon: '/icons/icon-download.svg', label: 'Exportar' },
            { icon: '/icons/icon-columns.svg',  label: 'Colunas'  },
          ].map(btn => (
            <button
              key={btn.label}
              className="flex items-center justify-center w-[34px] h-[34px] border border-border bg-transparent rounded-md cursor-pointer text-primary transition-[background] duration-150 p-4 hover:bg-bg-hover"
              aria-label={btn.label}
            >
              <img src={btn.icon} alt="" width={18} height={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-sans text-md">
          <thead className="bg-bg-tag">
            <tr>
              {columns.map(col => (
                <th key={col.key} className={clsx(cellPx, 'text-left font-semibold text-text-secondary whitespace-nowrap border-b border-border')}>
                  <button
                    className="inline-flex items-center gap-2 bg-none border-none cursor-pointer font-sans text-md font-semibold text-text-secondary p-0 disabled:cursor-default"
                    onClick={() => col.sortable && handleSort(col.key)}
                    disabled={!col.sortable}
                  >
                    <span>{col.label}</span>
                    {col.sortable && (
                      <img
                        src="/icons/icon-sort-alt.svg"
                        alt=""
                        width={14}
                        height={14}
                        className={sortCol === col.key ? 'opacity-100' : 'opacity-40'}
                      />
                    )}
                  </button>
                </th>
              ))}
              <th className={clsx(cellPx, 'text-left font-semibold text-text-secondary whitespace-nowrap border-b border-border')}>Opções</th>
            </tr>
          </thead>

          <tbody className="[&>tr+tr]:border-t [&>tr+tr]:border-border">
            {sortedData.map(row => (
              <tr
                key={row.id}
                className={clsx(
                  'cursor-pointer transition-[background] duration-100',
                  'hover:bg-bg-hover',
                  selected.has(row.id) && 'bg-bg-hover',
                )}
                onClick={() => toggleRow(row.id)}
              >
                <td className={clsx(cellPx, 'text-text align-middle whitespace-nowrap')}>
                  <div className="flex flex-col gap-[2px]">
                    <span className="font-semibold text-text text-md">{row.empresa}</span>
                    <span className="text-sm text-text-secondary">{row.cnpj}</span>
                  </div>
                </td>
                <td className={clsx(cellPx, 'text-text-secondary align-middle whitespace-nowrap text-sm')}>{row.contato}</td>
                <td className={clsx(cellPx, 'text-text align-middle whitespace-nowrap')}>
                  <span className="inline-flex items-center gap-1">
                    {row.acionistas}
                    <img src="/icons/icon-library.svg" alt="" width={16} height={16} className="opacity-50" />
                  </span>
                </td>
                <td className={clsx(cellPx, 'text-text align-middle whitespace-nowrap')}>
                  <StatusBadge status={row.status} label={row.statusLabel} />
                </td>
                <td className={clsx(cellPx, 'text-text align-middle whitespace-nowrap')}>{row.categoria}</td>
                <td className={clsx(cellPx, 'text-text align-middle whitespace-nowrap')}>
                  <span className={clsx(
                    'text-sm font-semibold',
                    row.regrasDaPlataforma === 'Ativo' ? 'text-success' : 'text-text-disabled',
                  )}>
                    {row.regrasDaPlataforma}
                  </span>
                </td>
                <td className={clsx(cellPx, 'align-middle whitespace-nowrap text-text')}>{row.credito}</td>
                <td className={clsx(cellPx, 'align-middle whitespace-nowrap text-center')}>
                  <img src="/icons/icon-information-fill.svg" alt="Detalhes" width={20} height={20} className="opacity-50 inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

const sidebarItems = [
  { key: 'dashboard',  label: 'Dashboard',  icon: <img src="/icons/icon-grid-1x2.svg" alt="" width={24} height={24} /> },
  { key: 'recebiveis', label: 'Recebíveis', icon: <img src="/icons/icon-receipt.svg" alt="" width={24} height={24} /> },
  { key: 'caixa',      label: 'Caixa',      icon: <img src="/icons/icon-cash.svg" alt="" width={24} height={24} /> },
  { key: 'sacados',    label: 'Sacados',    icon: <img src="/icons/icon-store.svg" alt="" width={24} height={24} /> },
  { key: 'ajustes',    label: 'Ajustes',    icon: <img src="/icons/icon-adjustments.svg" alt="" width={24} height={24} /> },
  { key: 'relatorios', label: 'Relatórios', icon: <img src="/icons/icon-grid.svg" alt="" width={24} height={24} /> },
]

export function FornecedoresScreen() {
  const [page, setPage] = useState(1)
  const totalPages = 3

  return (
    <div className="flex flex-row min-h-screen bg-bg-tag">
      {/* Sidebar — collapsed mode (icons only) */}
      <Sidebar
        collapsed
        items={sidebarItems}
        activeKey="sacados"
        footerUser={{
          name: '',
          avatar: <img src="/icons/icon-account.svg" alt="Conta" width={24} height={24} className="opacity-60" />,
        }}
        className="pt-[64px]"
      />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-6 bg-bg shadow-card shrink-0 gap-5">
          <Breadcrumb
            items={[
              { label: 'Fornecedores', href: '#' },
              { label: 'Todos os fornecedores' },
            ]}
          />
          <img src="/icons/logo-liber.svg" alt="Liber Capital" height={24} />
        </header>

        {/* Page content */}
        <main className="flex flex-col gap-8 pt-10 px-8 pb-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="font-sans text-lg font-semibold text-text m-0 leading-md">
                Todos os fornecedores
              </h1>
              <p className="font-sans text-md font-regular text-text-secondary m-0">
                Visualize todos fornecedores
              </p>
            </div>
            <div className="flex items-center gap-8 shrink-0">
              <Button variant="transparent">Atualizar limites</Button>
              <Button variant="outline">Ver grupo de fornecedores</Button>
              <Button variant="primary" iconRight>Adicionar fornecedores</Button>
            </div>
          </div>

          {/* Table section */}
          <div className="flex flex-col gap-6">
            <FornecedoresTable data={allData} />
          </div>

          {/* Pagination */}
          <div className="flex justify-end pb-24">
            <Pagination
              page={page}
              total={totalPages}
              onPageChange={setPage}
              variant="jumper"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
