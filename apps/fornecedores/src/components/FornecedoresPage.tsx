import { useState } from 'react'
import './FornecedoresPage.css'
import { Button } from './Button/Button'
import { Table, Fornecedor } from './Table/Table'
import { Pagination } from './Pagination/Pagination'
import { IconPlus } from './Icons'

const allData: Fornecedor[] = [
  { id: '1', cnpj: '12.345.678/0001-90', empresa: 'Nova Era Transportes',      contato: 'financeiro@novaera.com',      acionistas: '3/3', status: 'pending',  statusLabel: 'Pendente', categoria: 'Grupo Beta',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 50.000,00'  },
  { id: '2', cnpj: '98.765.432/0001-01', empresa: 'Bela Vista Alimentos',       contato: 'comercial@belavista.com',     acionistas: '3/3', status: 'pending',  statusLabel: 'Pendente', categoria: 'Grupo Alfa',    regrasDaPlataforma: 'Inativo', credito: 'R$ 20.000,00'  },
  { id: '3', cnpj: '54.321.678/0001-12', empresa: 'Sol Nascente Agrícola',      contato: 'juridico@solnascente.com',    acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Gama',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 100.000,00' },
  { id: '4', cnpj: '78.901.234/0001-23', empresa: 'Caminho do Campo Ltda.',     contato: 'fiscal@caminhodocampo.com',   acionistas: '3/3', status: 'pending',  statusLabel: 'Pendente', categoria: 'Grupo Delta',   regrasDaPlataforma: 'Inativo', credito: 'R$ 30.000,00'  },
  { id: '5', cnpj: '34.567.890/0001-34', empresa: 'Horizonte Azul S.A.',        contato: 'rh@horizonteazul.com',        acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Épsilon', regrasDaPlataforma: 'Ativo',   credito: 'R$ 75.000,00'  },
  { id: '6', cnpj: '45.678.901/0001-45', empresa: 'Porto Seguro Commodities',   contato: 'ti@portoseguro.com',          acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Zeta',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 120.000,00' },
  { id: '7', cnpj: '56.789.012/0001-56', empresa: 'Estrela Guia Produtos',      contato: 'suporte@estrelaguia.com',     acionistas: '3/3', status: 'pending',  statusLabel: 'Pendente', categoria: 'Grupo Eta',     regrasDaPlataforma: 'Inativo', credito: 'R$ 40.000,00'  },
  { id: '8', cnpj: '67.890.123/0001-67', empresa: 'Unidos Venceremos S.A.',     contato: 'vendas@unidosvenceremos.com', acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Teta',    regrasDaPlataforma: 'Ativo',   credito: 'R$ 90.000,00'  },
  { id: '9', cnpj: '78.901.234/0001-78', empresa: 'Amanhecer Feliz Agronegócios', contato: 'qualidade@amanhecerfeliz.com', acionistas: '3/3', status: 'approved', statusLabel: 'Aprovado', categoria: 'Grupo Iota', regrasDaPlataforma: 'Ativo',   credito: 'R$ 150.000,00' },
]

const PAGE_SIZE = 3

export function FornecedoresPage() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(allData.length / PAGE_SIZE)
  const pageData = allData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <main className="fornecedores-page">
      {/* Page header row — layout_T7DRYJ: row, justifyContent space-between */}
      <div className="fornecedores-page__header">
        <div className="fornecedores-page__copy">
          <h1 className="fornecedores-page__title">Todos os fornecedores</h1>
          <p className="fornecedores-page__subtitle">Visualize todos fornecedores</p>
        </div>

        {/* Actions — layout_W7Z099 */}
        <div className="fornecedores-page__actions">
          <Button label="Atualizar limites" type="transparent" />
          <Button label="Ver grupo de fornecedores" type="outline" />
          <Button
            label="Adicionar fornecedores"
            type="primary"
            iconRight={<IconPlus size={16} />}
          />
        </div>
      </div>

      {/* Table section — "titulos" */}
      <section className="fornecedores-page__section" aria-label="Tabela de fornecedores">
        <Table data={pageData} />
      </section>

      {/* Pagination */}
      <div className="fornecedores-page__pagination">
        <Pagination
          current={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>
    </main>
  )
}
