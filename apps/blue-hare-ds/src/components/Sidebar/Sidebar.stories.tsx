import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sidebar } from './Sidebar'
import type { SidebarItem, SidebarFooterUser } from './Sidebar'

const icon = (name: string) => (
  <img src={`/icons/icon-${name}.svg`} alt="" width={24} height={24} />
)

const sidebarItems: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: icon('grid-1x2') },
  { key: 'titulos', label: 'Títulos', icon: icon('receipt'), subItems: [
    { key: 'todos-titulos', label: 'Todo os títulos' },
    { key: 'historico', label: 'Histórico de confições' },
  ]},
  { key: 'negociacoes', label: 'Negociações', icon: icon('cash') },
  { key: 'fornecedores', label: 'Fornecedores', icon: icon('store'), subItems: [
    { key: 'todos-fornecedores', label: 'Todos os fornecedores' },
    { key: 'atualizacoes', label: 'Atualizações cadastrais' },
  ]},
  { key: 'limites', label: 'Configurar limites', icon: icon('adjustments') },
  { key: 'relatorios', label: 'Relatórios exportados', icon: icon('grid') },
]

const sidebarItemsAlt: SidebarItem[] = [
  { key: 'portais', label: 'Portais', icon: icon('grid-1x2') },
  { key: 'usuarios', label: 'Usuários', icon: icon('user'), subItems: [
    { key: 'sacados', label: 'Sacados' },
    { key: 'investidores', label: 'Investidores' },
    { key: 'fornecedores-sub', label: 'Fornecedores' },
    { key: 'grupos', label: 'Grupos econômicos' },
    { key: 'operadores', label: 'Operadores' },
    { key: 'organizadores', label: 'Organizadores' },
  ]},
  { key: 'mercado', label: 'Mercado', icon: icon('cash'), subItems: [
    { key: 'mercado-1', label: 'Sub item' },
  ]},
  { key: 'relatorios-alt', label: 'Relatórios', icon: icon('grid') },
  { key: 'listas', label: 'Listas', icon: icon('receipt') },
  { key: 'criar-remessas', label: 'Criar remessas', icon: icon('store') },
  { key: 'bancos', label: 'Bancos', icon: icon('store') },
  { key: 'config', label: 'Configurações', icon: icon('adjustments') },
]

const sidebarUser: SidebarFooterUser = {
  name: 'Ajinomoto',
  subtitle: 'Ajinomoto',
  avatar: <img src="/icons/icon-user.svg" alt="" width={24} height={24} />,
  menuItems: [
    { key: 'contas', label: 'Contas bancárias' },
    { key: 'enderecos', label: 'Endereços' },
    { key: 'contrato', label: 'Seu contrato' },
    { key: 'dados', label: 'Dados cadastrais' },
    { key: 'sair', label: 'Sair', icon: <img src="/icons/icon-close.svg" alt="" width={20} height={20} /> },
  ],
}

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Collapsed: Story = {
  args: {
    items: sidebarItems,
    activeKey: 'titulos',
    collapsed: true,
    footerUser: sidebarUser,
    footer: <span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>,
  },
}

export const Default: Story = {
  args: {
    logo: <img src="/icons/logo-liber.svg" alt="Liber" height={20} />,
    items: sidebarItems,
    activeKey: 'titulos',
    expandedKeys: new Set(['titulos']),
    footerUser: sidebarUser,
    footer: <span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>,
  },
}

export const WithExpandedMenus: Story = {
  args: {
    logo: <img src="/icons/logo-liber.svg" alt="Liber" height={20} />,
    items: sidebarItems,
    activeKey: 'titulos',
    expandedKeys: new Set(['titulos', 'fornecedores']),
    footerUser: sidebarUser,
    footer: <span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>,
  },
}

export const AltMenu: Story = {
  args: {
    logo: <img src="/icons/logo-liber.svg" alt="Liber" height={20} />,
    items: sidebarItemsAlt,
    activeKey: 'fornecedores-sub',
    expandedKeys: new Set(['usuarios']),
    footerUser: sidebarUser,
    footer: <span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>,
  },
}
