import { useState } from 'react'
import './Table.css'
import { Button } from '../Button/Button'
import { Badge } from '../Badge/Badge'
import { IconSort, IconFilter, IconDownload, IconColumns, IconLibrary, IconChevronDown } from '../Icons'

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

interface TableProps {
  data: Fornecedor[]
}

const columns = [
  { key: 'empresa',            label: 'Empresa',              sortable: true  },
  { key: 'contato',            label: 'Contato',              sortable: true  },
  { key: 'acionistas',         label: 'Acionistas',           sortable: false },
  { key: 'status',             label: 'Status',               sortable: true  },
  { key: 'categoria',          label: 'Categoria',            sortable: false },
  { key: 'regras',             label: 'Regras da Plataforma', sortable: false },
  { key: 'credito',            label: 'Crédito',              sortable: false },
  { key: 'opcoes',             label: 'Opções',               sortable: false },
]

export function Table({ data }: TableProps) {
  const [sortCol, setSortCol]   = useState<string | null>(null)
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function handleSort(key: string) {
    if (sortCol === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(key)
      setSortDir('asc')
    }
  }

  function toggleAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelected(new Set(data.map(r => r.id)))
    } else {
      setSelected(new Set())
    }
  }

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const hasSelected = selected.size > 0

  return (
    <div className="table-wrapper">
      {/* Toolbar */}
      <div className="table-toolbar" role="toolbar" aria-label="Ações da tabela">
        <div className="table-toolbar__actions">
          <Button
            label="Redefinir"
            type="transparent"
            status={hasSelected ? 'default' : 'disabled'}
            onClick={() => setSelected(new Set())}
          />
        </div>
        <div className="table-toolbar__icons">
          <button className="table-toolbar__icon-btn" aria-label="Filtrar">
            <IconFilter size={18} />
          </button>
          <button className="table-toolbar__icon-btn" aria-label="Exportar">
            <IconDownload size={18} />
          </button>
          <button className="table-toolbar__icon-btn" aria-label="Colunas">
            <IconColumns size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll" role="region" aria-label="Lista de fornecedores">
        <table className="table">
          <thead className="table__head">
            <tr>
              <th className="table__th table__th--checkbox">
                <input
                  type="checkbox"
                  aria-label="Selecionar todos"
                  checked={selected.size === data.length && data.length > 0}
                  onChange={toggleAll}
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="table__th"
                  aria-sort={
                    sortCol === col.key
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : col.sortable ? 'none' : undefined
                  }
                >
                  <button
                    className="table__sort-btn"
                    onClick={() => col.sortable && handleSort(col.key)}
                    disabled={!col.sortable}
                    aria-disabled={!col.sortable}
                  >
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className={`table__sort-icon${sortCol === col.key ? ' table__sort-icon--active' : ''}`}>
                        <IconSort size={14} />
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="table__body">
            {data.map(row => (
              <tr
                key={row.id}
                className={`table__row${selected.has(row.id) ? ' table__row--selected' : ''}`}
                onClick={() => toggleRow(row.id)}
              >
                <td className="table__td table__td--checkbox">
                  <input
                    type="checkbox"
                    aria-label={`Selecionar ${row.empresa}`}
                    checked={selected.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                    onClick={e => e.stopPropagation()}
                  />
                </td>

                {/* Empresa */}
                <td className="table__td">
                  <div className="table__cell-empresa">
                    <span className="table__cell-empresa-name">{row.empresa}</span>
                    <span className="table__cell-empresa-cnpj">{row.cnpj}</span>
                  </div>
                </td>

                {/* Contato */}
                <td className="table__td">
                  <span className="table__cell-contato">{row.contato}</span>
                </td>

                {/* Acionistas */}
                <td className="table__td">
                  <div className="table__cell-acionistas">
                    <span>{row.acionistas}</span>
                    <button
                      className="table__cell-icon-btn"
                      aria-label={`Ver acionistas de ${row.empresa}`}
                      onClick={e => e.stopPropagation()}
                    >
                      <IconLibrary size={16} />
                    </button>
                  </div>
                </td>

                {/* Status */}
                <td className="table__td">
                  <button
                    className="table__cell-status"
                    aria-label={`Status: ${row.statusLabel}. Clique para alterar`}
                    onClick={e => e.stopPropagation()}
                  >
                    <Badge label={row.statusLabel} variant={row.status} />
                    <IconChevronDown size={14} className="table__cell-status-chevron" />
                  </button>
                </td>

                {/* Categoria */}
                <td className="table__td">
                  <span>{row.categoria}</span>
                </td>

                {/* Regras da Plataforma */}
                <td className="table__td">
                  <span className={`table__cell-regras table__cell-regras--${row.regrasDaPlataforma.toLowerCase()}`}>
                    {row.regrasDaPlataforma}
                  </span>
                </td>

                {/* Crédito */}
                <td className="table__td">
                  <span className="table__cell-credito">{row.credito}</span>
                </td>

                {/* Opções */}
                <td className="table__td table__td--opcoes">
                  <button
                    className="table__cell-opcoes-btn"
                    aria-label={`Opções para ${row.empresa}`}
                    onClick={e => e.stopPropagation()}
                  >
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
