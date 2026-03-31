import { useState } from 'react'

import { Label } from '../components/Label/Label'
import { Field } from '../components/Field/Field'
import { Button } from '../components/Button/Button'
import { Input } from '../components/Input/Input'
import { Checkbox } from '../components/Checkbox/Checkbox'
import { RadioButton, RadioGroup } from '../components/RadioButton/RadioButton'
import { Switch } from '../components/Switch/Switch'
import { Menu } from '../components/Menu/Menu'
import { Dropdown } from '../components/Dropdown/Dropdown'
import { TextArea } from '../components/TextArea/TextArea'
import { Badge } from '../components/Badge/Badge'
import { Tag } from '../components/Tag/Tag'
import { Chip } from '../components/Chip/Chip'
import { Avatar } from '../components/Avatar/Avatar'
import { Keyline } from '../components/Keyline/Keyline'
import { Link } from '../components/Link/Link'
import { Loader } from '../components/Loader/Loader'
import { Progress } from '../components/Progress/Progress'
import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb'
import { Tabs } from '../components/Tabs/Tabs'
import { Pagination } from '../components/Pagination/Pagination'
import { Toast } from '../components/Toast/Toast'
import { Message } from '../components/Message/Message'
import { Tooltip } from '../components/Tooltip/Tooltip'
import { Snackbar } from '../components/Snackbar/Snackbar'
import { ButtonGroup } from '../components/ButtonGroup/ButtonGroup'
import { List } from '../components/List/List'
import { Navigation } from '../components/Navigation/Navigation'
import { Slider } from '../components/Slider/Slider'
import { Stepper } from '../components/Stepper/Stepper'
import { Anchor } from '../components/Anchor/Anchor'
import { Placeholder } from '../components/Placeholder/Placeholder'
import { Carousel } from '../components/Carousel/Carousel'
import { Drawer } from '../components/Drawer/Drawer'
import { Sidebar, type SidebarItem, type SidebarFooterUser } from '../components/Sidebar/Sidebar'
import { Table } from '../components/Table/Table'
import { Tree } from '../components/Tree/Tree'
import { DatePicker } from '../components/DatePicker/DatePicker'
import { Autocomplete } from '../components/Autocomplete/Autocomplete'
import { DefinedField } from '../components/DefinedField/DefinedField'

// Shared layout primitives
const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="mb-16 pb-16 border-b border-border last:border-b-0">
    {children}
  </section>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-sans text-lg font-semibold text-text mb-8 mt-0">{children}</h2>
)

const Variants = ({ column, children }: { column?: boolean; children: React.ReactNode }) => (
  <div className={column ? 'flex flex-col items-stretch gap-8' : 'flex flex-wrap items-start gap-8'}>
    {children}
  </div>
)

const Item = ({ full, children }: { full?: boolean; children: React.ReactNode }) => (
  <div className={full ? 'flex flex-col gap-2 w-full max-w-[640px]' : 'flex flex-col gap-2'}>
    {children}
  </div>
)

const ItemLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-sans text-sm font-regular text-text-muted uppercase tracking-[0.05em]">
    {children}
  </span>
)

// ── Sidebar showcase data ──────────────────────────────────────────
const sidebarItems: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <img src="/icons/icon-grid-1x2.svg" alt="" width={24} height={24} /> },
  { key: 'titulos', label: 'Títulos', icon: <img src="/icons/icon-receipt.svg" alt="" width={24} height={24} />, subItems: [
    { key: 'todos-titulos', label: 'Todo os títulos' },
    { key: 'historico', label: 'Histórico de confições' },
  ]},
  { key: 'negociacoes', label: 'Negociações', icon: <img src="/icons/icon-cash.svg" alt="" width={24} height={24} /> },
  { key: 'fornecedores', label: 'Fornecedores', icon: <img src="/icons/icon-store.svg" alt="" width={24} height={24} />, subItems: [
    { key: 'todos-fornecedores', label: 'Todos os fornecedores' },
    { key: 'atualizacoes', label: 'Atualizações cadastrais' },
  ]},
  { key: 'limites', label: 'Configurar limites', icon: <img src="/icons/icon-adjustments.svg" alt="" width={24} height={24} /> },
  { key: 'relatorios', label: 'Relatórios exportados', icon: <img src="/icons/icon-grid.svg" alt="" width={24} height={24} /> },
]

const sidebarItemsAlt: SidebarItem[] = [
  { key: 'portais', label: 'Portais', icon: <img src="/icons/icon-grid-1x2.svg" alt="" width={24} height={24} /> },
  { key: 'usuarios', label: 'Usuários', icon: <img src="/icons/icon-user.svg" alt="" width={24} height={24} />, subItems: [
    { key: 'sacados', label: 'Sacados' },
    { key: 'investidores', label: 'Investidores' },
    { key: 'fornecedores-sub', label: 'Fornecedores' },
    { key: 'grupos', label: 'Grupos econômicos' },
    { key: 'operadores', label: 'Operadores' },
    { key: 'organizadores', label: 'Organizadores' },
  ]},
  { key: 'mercado', label: 'Mercado', icon: <img src="/icons/icon-cash.svg" alt="" width={24} height={24} />, subItems: [
    { key: 'mercado-1', label: 'Sub item' },
  ]},
  { key: 'relatorios-alt', label: 'Relatórios', icon: <img src="/icons/icon-grid.svg" alt="" width={24} height={24} /> },
  { key: 'listas', label: 'Listas', icon: <img src="/icons/icon-receipt.svg" alt="" width={24} height={24} /> },
  { key: 'criar-remessas', label: 'Criar remessas', icon: <img src="/icons/icon-store.svg" alt="" width={24} height={24} /> },
  { key: 'bancos', label: 'Bancos', icon: <img src="/icons/icon-store.svg" alt="" width={24} height={24} /> },
  { key: 'config', label: 'Configurações', icon: <img src="/icons/icon-adjustments.svg" alt="" width={24} height={24} /> },
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

function SidebarFooterOpen() {
  return (
    <Sidebar
      items={sidebarItems.slice(0, 4)}
      activeKey="dashboard"
      footerUser={{ ...sidebarUser }}
      footer={<span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>}
    />
  )
}

export default function ShowcasePage() {
  // Local state for interactive components
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [switchOn, setSwitchOn] = useState(false)
  const [sliderValue, setSliderValue] = useState(40)
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTabKey, setSelectedTabKey] = useState<string | undefined>('tab1')
  const [buttonGroupKey, setButtonGroupKey] = useState('b1')
  const [selectedTreeKey, setSelectedTreeKey] = useState<string | undefined>('file1')

  return (
    <div className="min-h-screen bg-bg-page p-16">
      <header className="mb-16 pb-8 border-b-2 border-border">
        <h1 className="font-sans text-2xl font-semibold text-primary m-0 mb-2">
          Blue Hare DS — Component Showcase
        </h1>
        <p className="font-sans text-md font-regular text-text-secondary m-0">
          All 40 components from the Blue Hare Design System
        </p>
      </header>

      {/* ── Label ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Label</SectionTitle>
        <Variants>
          <Item><ItemLabel>Default</ItemLabel><Label>Field label</Label></Item>
          <Item><ItemLabel>Required</ItemLabel><Label required>Required field</Label></Item>
          <Item><ItemLabel>With help icon</ItemLabel><Label showHelpIcon>With help</Label></Item>
        </Variants>
      </Section>

      {/* ── Field ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Field</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <Field aria-label="Email" placeholder="Enter email" />
          </Item>
          <Item>
            <ItemLabel>No icons</ItemLabel>
            <Field aria-label="Name" showLeftIcon={false} showRightIcon={false} placeholder="Enter name" />
          </Item>
          <Item>
            <ItemLabel>Disabled</ItemLabel>
            <Field aria-label="Disabled" disabled placeholder="Not editable" />
          </Item>
        </Variants>
      </Section>

      {/* ── Input ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Input</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <Input placeholder="Placeholder" />
          </Item>
          <Item>
            <ItemLabel>With label</ItemLabel>
            <Input label="First name" placeholder="Enter first name" />
          </Item>
          <Item>
            <ItemLabel>Disabled</ItemLabel>
            <Input label="Locked" disabled placeholder="Disabled" />
          </Item>
        </Variants>
      </Section>

      {/* ── Button ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Button</SectionTitle>
        <Variants>
          <Item><ItemLabel>Primary</ItemLabel><Button variant="primary">Primary</Button></Item>
          <Item><ItemLabel>Outline</ItemLabel><Button variant="outline">Outline</Button></Item>
          <Item><ItemLabel>Transparent</ItemLabel><Button variant="transparent">Transparent</Button></Item>
          <Item><ItemLabel>Icon left</ItemLabel><Button iconLeft>With icon</Button></Item>
          <Item><ItemLabel>Icon only</ItemLabel><Button iconOnly /></Item>
          <Item><ItemLabel>Disabled</ItemLabel><Button disabled>Disabled</Button></Item>
        </Variants>
      </Section>

      {/* ── Checkbox ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Checkbox</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Unchecked</ItemLabel>
            <Checkbox isSelected={checkboxChecked} onChange={setCheckboxChecked}>Accept terms</Checkbox>
          </Item>
          <Item>
            <ItemLabel>Checked</ItemLabel>
            <Checkbox isSelected={true} onChange={() => {}}>Checked</Checkbox>
          </Item>
          <Item>
            <ItemLabel>Indeterminate</ItemLabel>
            <Checkbox isIndeterminate isSelected={false} onChange={() => {}}>Indeterminate</Checkbox>
          </Item>
          <Item>
            <ItemLabel>Disabled</ItemLabel>
            <Checkbox isDisabled isSelected={false} onChange={() => {}}>Disabled</Checkbox>
          </Item>
        </Variants>
      </Section>

      {/* ── Radio Button ─────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Radio Button</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Group</ItemLabel>
            <RadioGroup label="Choose option" value={radioValue} onChange={setRadioValue}>
              <RadioButton value="option1">Option 1</RadioButton>
              <RadioButton value="option2">Option 2</RadioButton>
              <RadioButton value="option3" isDisabled>Disabled</RadioButton>
            </RadioGroup>
          </Item>
        </Variants>
      </Section>

      {/* ── Switch ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Switch</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Off</ItemLabel>
            <Switch isSelected={switchOn} onChange={setSwitchOn}>Notifications</Switch>
          </Item>
          <Item>
            <ItemLabel>On</ItemLabel>
            <Switch isSelected={true} onChange={() => {}}>Active</Switch>
          </Item>
          <Item>
            <ItemLabel>Disabled</ItemLabel>
            <Switch isSelected={false} onChange={() => {}} isDisabled>Disabled</Switch>
          </Item>
        </Variants>
      </Section>

      {/* ── Menu ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Menu</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Not selected</ItemLabel>
            <Menu
              items={[
                { id: '1', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '2', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '3', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} />, disabled: true },
              ]}
            />
          </Item>
          <Item>
            <ItemLabel>With selection</ItemLabel>
            <Menu
              items={[
                { id: '1', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '2', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} />, selected: true },
                { id: '3', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '4', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '5', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
              ]}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Dropdown ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Dropdown</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <Dropdown
              label="Label"
              hint="Hint copy"
              placeholder="Placeholder"
              items={[
                { id: '1', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '2', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '3', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '4', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { id: '5', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
              ]}
            />
          </Item>
          <Item>
            <ItemLabel>Disabled</ItemLabel>
            <Dropdown label="Label" placeholder="Placeholder" disabled items={[]} />
          </Item>
        </Variants>
      </Section>

      {/* ── TextArea ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Text Area</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <TextArea label="Description" placeholder="Enter description…" />
          </Item>
          <Item>
            <ItemLabel>With max length</ItemLabel>
            <TextArea label="Notes" maxLength={500} placeholder="Notes…" />
          </Item>
          <Item>
            <ItemLabel>Disabled</ItemLabel>
            <TextArea label="Locked" disabled placeholder="Read only" />
          </Item>
        </Variants>
      </Section>

      {/* ── Badge ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Badge</SectionTitle>
        <Variants>
          <Item><ItemLabel>Default</ItemLabel><Badge count={99} /></Item>
          <Item><ItemLabel>Information</ItemLabel><Badge count={99} status="information" /></Item>
          <Item><ItemLabel>Error</ItemLabel><Badge count={99} status="error" /></Item>
          <Item><ItemLabel>Warning</ItemLabel><Badge count={99} status="warning" /></Item>
          <Item><ItemLabel>Success</ItemLabel><Badge count={99} status="success" /></Item>
          <Item><ItemLabel>Dot Default</ItemLabel><Badge type="dot" /></Item>
          <Item><ItemLabel>Dot Info</ItemLabel><Badge type="dot" status="information" /></Item>
          <Item><ItemLabel>Dot Error</ItemLabel><Badge type="dot" status="error" /></Item>
          <Item><ItemLabel>Dot Warning</ItemLabel><Badge type="dot" status="warning" /></Item>
          <Item><ItemLabel>Dot Success</ItemLabel><Badge type="dot" status="success" /></Item>
        </Variants>
      </Section>

      {/* ── Tag ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Tag</SectionTitle>
        <Variants>
          <Item><ItemLabel>Default</ItemLabel><Tag>Design</Tag></Item>
          <Item><ItemLabel>Success</ItemLabel><Tag type="success">Success</Tag></Item>
          <Item><ItemLabel>Error</ItemLabel><Tag type="error">Error</Tag></Item>
          <Item><ItemLabel>Interactive selected</ItemLabel><Tag interactive selected onRemove={() => {}}>Removable</Tag></Item>
          <Item><ItemLabel>Disabled</ItemLabel><Tag type="disabled">Disabled</Tag></Item>
        </Variants>
      </Section>

      {/* ── Chip ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Chip</SectionTitle>
        <Variants>
          <Item><ItemLabel>Default</ItemLabel><Chip onRemove={() => {}}>Chip</Chip></Item>
          <Item><ItemLabel>Information</ItemLabel><Chip type="information" onRemove={() => {}}>Chip</Chip></Item>
          <Item><ItemLabel>Success</ItemLabel><Chip type="success" onRemove={() => {}}>Chip</Chip></Item>
          <Item><ItemLabel>Warning</ItemLabel><Chip type="warning" onRemove={() => {}}>Chip</Chip></Item>
          <Item><ItemLabel>Error</ItemLabel><Chip type="error" onRemove={() => {}}>Chip</Chip></Item>
          <Item><ItemLabel>Disabled</ItemLabel><Chip type="disabled">Chip</Chip></Item>
        </Variants>
      </Section>

      {/* ── Avatar ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Avatar</SectionTitle>
        <Variants>
          <Item><ItemLabel>Icon (default)</ItemLabel><Avatar /></Item>
          <Item><ItemLabel>Initials</ItemLabel><Avatar type="initials" initials="CM" /></Item>
          <Item><ItemLabel>Small</ItemLabel><Avatar type="initials" initials="AS" size="small" /></Item>
          <Item><ItemLabel>Large</ItemLabel><Avatar type="initials" initials="BJ" size="large" /></Item>
        </Variants>
      </Section>

      {/* ── Keyline ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Keyline</SectionTitle>
        <Variants>
          <Item full>
            <ItemLabel>Horizontal</ItemLabel>
            <Keyline />
          </Item>
          <Item>
            <ItemLabel>Vertical</ItemLabel>
            <div style={{ height: 80 }}>
              <Keyline orientation="vertical" />
            </div>
          </Item>
        </Variants>
      </Section>

      {/* ── Link ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Link</SectionTitle>
        <Variants>
          <Item><ItemLabel>Default</ItemLabel><Link href="#">Default link</Link></Item>
          <Item><ItemLabel>Inline</ItemLabel><p>Read the <Link href="#" variant="inline">documentation</Link> here.</p></Item>
          <Item><ItemLabel>Standalone</ItemLabel><Link href="#" variant="standalone">Standalone link</Link></Item>
          <Item><ItemLabel>Disabled</ItemLabel><Link href="#" disabled>Disabled link</Link></Item>
        </Variants>
      </Section>

      {/* ── Loader ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Loader</SectionTitle>
        <Variants>
          <Item><ItemLabel>Primary</ItemLabel><Loader type="primary" size="medium" /></Item>
          <Item><ItemLabel>Secondary</ItemLabel><Loader type="secondary" size="medium" /></Item>
          <Item><ItemLabel>Small</ItemLabel><Loader size="small" /></Item>
          <Item><ItemLabel>Large</ItemLabel><Loader size="large" /></Item>
        </Variants>
      </Section>

      {/* ── Progress ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Progress</SectionTitle>
        <Variants column>
          <Item full><ItemLabel>Linear</ItemLabel><Progress value={80} label="Completion: 80%" /></Item>
          <Item full><ItemLabel>Linear (no label)</ItemLabel><Progress value={80} /></Item>
        </Variants>
        <Variants>
          <Item><ItemLabel>Circular large</ItemLabel><Progress type="circular" value={80} size={160} /></Item>
          <Item><ItemLabel>Circular medium</ItemLabel><Progress type="circular" value={80} size={120} /></Item>
          <Item><ItemLabel>Circular small</ItemLabel><Progress type="circular" value={80} size={80} /></Item>
        </Variants>
      </Section>

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Breadcrumb</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <Breadcrumb
              items={[
                { label: 'Home', href: '#' },
                { label: 'Products', href: '#' },
                { label: 'Details' },
              ]}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Tabs</SectionTitle>
        <Variants column>
          <Item full>
            <Tabs
              items={[
                { key: 'tab1', label: 'Overview', children: <p style={{ padding: '16px' }}>Overview content</p> },
                { key: 'tab2', label: 'Details', children: <p style={{ padding: '16px' }}>Details content</p> },
                { key: 'tab3', label: 'Settings', children: <p style={{ padding: '16px' }}>Settings content</p> },
                { key: 'tab4', label: 'Disabled', children: <p />, disabled: true },
              ]}
              selectedKey={selectedTabKey}
              onSelectionChange={(key) => setSelectedTabKey(key)}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Pagination ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Pagination</SectionTitle>
        <Variants column>
          <Item>
            <ItemLabel>Jumper</ItemLabel>
            <Pagination total={10} page={4} variant="jumper" onPageChange={() => {}} />
          </Item>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <Pagination total={20} page={1} variant="default" onPageChange={() => {}} />
          </Item>
        </Variants>
      </Section>

      {/* ── Toast ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Toast</SectionTitle>
        <Variants column>
          <Item full><ItemLabel>Info</ItemLabel><Toast type="info" title="Information" description="This is an informational message." /></Item>
          <Item full><ItemLabel>Success</ItemLabel><Toast type="success" title="Success" description="Operation completed successfully." /></Item>
          <Item full><ItemLabel>Warning</ItemLabel><Toast type="warning" title="Warning" description="Please review before proceeding." /></Item>
          <Item full><ItemLabel>Error</ItemLabel><Toast type="error" title="Error" description="Something went wrong. Try again." /></Item>
        </Variants>
      </Section>

      {/* ── Message ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Message</SectionTitle>
        <Variants column>
          <Item full><Message type="info" title="Info message" description="This is an inline information message." onClose={() => {}} /></Item>
          <Item full><Message type="success" title="Success message" description="Your changes were saved." onClose={() => {}} /></Item>
          <Item full><Message type="warning" title="Warning message" description="This action may have consequences." onClose={() => {}} /></Item>
          <Item full><Message type="error" title="Error message" description="Unable to complete the request." onClose={() => {}} /></Item>
        </Variants>
      </Section>

      {/* ── Tooltip ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Tooltip</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Top (hover)</ItemLabel>
            <Tooltip content="Tooltip on top" placement="top"><Button variant="outline">Hover me</Button></Tooltip>
          </Item>
          <Item>
            <ItemLabel>Bottom</ItemLabel>
            <Tooltip content="Tooltip below" placement="bottom"><Button variant="outline">Bottom</Button></Tooltip>
          </Item>
          <Item>
            <ItemLabel>Left</ItemLabel>
            <Tooltip content="Left tooltip" placement="left"><Button variant="outline">Left</Button></Tooltip>
          </Item>
          <Item>
            <ItemLabel>Right</ItemLabel>
            <Tooltip content="Right tooltip" placement="right"><Button variant="outline">Right</Button></Tooltip>
          </Item>
        </Variants>
      </Section>

      {/* ── Snackbar ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Snackbar</SectionTitle>
        <Variants column>
          <Item full><Snackbar type="default" title="Snackbar title" description="Snackbar design system configurations and settings" linkLabel="Link" onLinkClick={() => {}} onClose={() => {}} progress={60} /></Item>
          <Item full><Snackbar type="information" title="Snackbar title" description="Snackbar design system configurations and settings" linkLabel="Link" onLinkClick={() => {}} onClose={() => {}} /></Item>
          <Item full><Snackbar type="success" title="Snackbar title" description="Snackbar design system configurations and settings" linkLabel="Link" onLinkClick={() => {}} onClose={() => {}} /></Item>
          <Item full><Snackbar type="warning" title="Snackbar title" description="Snackbar design system configurations and settings" linkLabel="Link" onLinkClick={() => {}} onClose={() => {}} /></Item>
          <Item full><Snackbar type="error" title="Snackbar title" description="Snackbar design system configurations and settings" linkLabel="Link" onLinkClick={() => {}} onClose={() => {}} /></Item>
        </Variants>
      </Section>

      {/* ── Button Group ─────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Button Group</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <ButtonGroup
              selectedKey={buttonGroupKey}
              onSelectionChange={setButtonGroupKey}
              items={[
                { key: 'b1', label: 'Day' },
                { key: 'b2', label: 'Week' },
                { key: 'b3', label: 'Month' },
              ]}
            />
          </Item>
          <Item>
            <ItemLabel>Toggle</ItemLabel>
            <ButtonGroup
              type="toggle"
              selectedKey="t1"
              items={[
                { key: 't1', label: 'On' },
                { key: 't2', label: 'Off' },
              ]}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── List ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>List</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Process</ItemLabel>
            <List
              heading="Heading"
              items={Array.from({ length: 8 }, () => ({
                title: 'Title',
                description: 'Description',
              }))}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Navigation</SectionTitle>
        <Variants column>
          <Item full>
            <Navigation
              items={[
                { key: 'home', label: 'Home', href: '#' },
                { key: 'products', label: 'Products', href: '#' },
                { key: 'about', label: 'About', href: '#' },
              ]}
              activeKey="home"
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Slider ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Slider</SectionTitle>
        <Variants column>
          <Item full>
            <ItemLabel>Single</ItemLabel>
            <Slider label="Volume" value={sliderValue} onChange={setSliderValue} min={0} max={100} />
          </Item>
          <Item full>
            <ItemLabel>Range</ItemLabel>
            <Slider label="Price range" type="range" rangeValue={rangeValue} onRangeChange={setRangeValue} min={0} max={100} />
          </Item>
          <Item full>
            <ItemLabel>Disabled</ItemLabel>
            <Slider label="Disabled" value={50} disabled />
          </Item>
        </Variants>
      </Section>

      {/* ── Stepper ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Stepper</SectionTitle>
        <Variants column>
          <Item full>
            <ItemLabel>Horizontal (step 2)</ItemLabel>
            <Stepper
              steps={[
                { label: 'Account', description: 'Set up your account' },
                { label: 'Profile', description: 'Fill in your details' },
                { label: 'Review', description: 'Check everything' },
                { label: 'Done' },
              ]}
              currentStep={1}
            />
          </Item>
          <Item>
            <ItemLabel>Vertical</ItemLabel>
            <Stepper
              orientation="vertical"
              steps={[
                { label: 'Start' },
                { label: 'In progress' },
                { label: 'Finish' },
              ]}
              currentStep={1}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Anchor ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Anchor</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <Anchor
              items={[
                { key: 'intro', label: 'Introduction' },
                { key: 'usage', label: 'Usage' },
                { key: 'api', label: 'API Reference' },
              ]}
              activeKey="usage"
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Placeholder ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Placeholder</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>With content</ItemLabel>
            <Placeholder title="Title" description="Body description" width={320} />
          </Item>
          <Item>
            <ItemLabel>Empty state</ItemLabel>
            <Placeholder
              title="No results found"
              description="Try adjusting your search filters."
              action={<Button variant="outline">Reset filters</Button>}
              width={320}
            />
          </Item>
          <Item>
            <ItemLabel>Minimal</ItemLabel>
            <Placeholder width={320} height={120} />
          </Item>
        </Variants>
      </Section>

      {/* ── Carousel ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Carousel</SectionTitle>
        <Variants>
          <Item full>
            <Carousel
              items={[
                <div key="1" className="flex items-center justify-center h-[160px] bg-bg-hover rounded-md font-sans text-lg font-semibold text-primary">Slide 1 — Introduction</div>,
                <div key="2" className="flex items-center justify-center h-[160px] bg-bg-hover rounded-md font-sans text-lg font-semibold text-primary">Slide 2 — Features</div>,
                <div key="3" className="flex items-center justify-center h-[160px] bg-bg-hover rounded-md font-sans text-lg font-semibold text-primary">Slide 3 — Summary</div>,
              ]}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Drawer ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Drawer</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Right placement</ItemLabel>
            <Button onPress={() => setDrawerOpen(true)}>Open Drawer</Button>
          </Item>
        </Variants>
        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Drawer title"
          placement="right"
        >
          <p>Drawer content goes here. You can place forms, details, or any content.</p>
        </Drawer>
      </Section>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Sidebar</SectionTitle>
        <Variants>
          {/* 1. Collapsed — icons only */}
          <Item>
            <Sidebar
              collapsed
              items={sidebarItems}
              activeKey="titulos"
              footerUser={sidebarUser}
              footer={<span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>}
            />
          </Item>

          {/* 2. Default — Títulos expanded + active */}
          <Item>
            <Sidebar
              logo={<img src="/icons/logo-liber.svg" alt="Liber" height={20} />}
              items={sidebarItems}
              activeKey="titulos"
              expandedKeys={new Set(['titulos'])}
              footerUser={sidebarUser}
              footer={<span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>}
            />
          </Item>

          {/* 3. Two menus expanded — Títulos + Fornecedores */}
          <Item>
            <Sidebar
              logo={<img src="/icons/logo-liber.svg" alt="Liber" height={20} />}
              items={sidebarItems}
              activeKey="titulos"
              expandedKeys={new Set(['titulos', 'fornecedores'])}
              footerUser={sidebarUser}
              footer={<span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>}
            />
          </Item>

          {/* 4. Sub-item selected (Fornecedores inside Usuários) */}
          <Item>
            <Sidebar
              logo={<img src="/icons/logo-liber.svg" alt="Liber" height={20} />}
              items={sidebarItemsAlt}
              activeKey="fornecedores-sub"
              expandedKeys={new Set(['usuarios'])}
              footerUser={sidebarUser}
              footer={<span className="font-sans text-sm text-text-secondary">Powered by <strong>liber</strong></span>}
            />
          </Item>

          {/* 5. Footer user menu open */}
          <Item>
            <SidebarFooterOpen />
          </Item>
        </Variants>
      </Section>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Table</SectionTitle>
        <Variants column>
          <Item full>
            <Table
              columns={[
                { key: 'name', heading: 'Name', sortable: true },
                { key: 'status', heading: 'Status' },
                { key: 'date', heading: 'Date', sortable: true },
              ]}
              rows={[
                { name: 'Project Alpha', status: 'Active', date: '2026-01-15' },
                { name: 'Project Beta', status: 'Pending', date: '2026-02-20' },
                { name: 'Project Gamma', status: 'Completed', date: '2026-03-01' },
              ]}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Tree ─────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Tree</SectionTitle>
        <Variants>
          <Item>
            <Tree
              nodes={[
                {
                  key: 'docs', label: 'Documents', children: [
                    { key: 'file1', label: 'Report.pdf' },
                    { key: 'file2', label: 'Proposal.docx' },
                  ]
                },
                {
                  key: 'images', label: 'Images', children: [
                    { key: 'img1', label: 'photo.png' },
                  ]
                },
              ]}
              selectedKey={selectedTreeKey}
              onSelect={setSelectedTreeKey}
              defaultExpanded={['docs']}
            />
          </Item>
        </Variants>
      </Section>

      {/* ── Date Picker ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Date Picker</SectionTitle>
        <Variants>
          <Item><ItemLabel>Default</ItemLabel><DatePicker label="Label" showHelpIcon hint="Hint copy" /></Item>
          <Item><ItemLabel>Required</ItemLabel><DatePicker label="Label" required showHelpIcon /></Item>
          <Item><ItemLabel>Disabled</ItemLabel><DatePicker label="Label" disabled /></Item>
        </Variants>
      </Section>

      {/* ── Autocomplete ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Autocomplete</SectionTitle>
        <Variants>
          <Item>
            <ItemLabel>Default</ItemLabel>
            <Autocomplete
              label="Label"
              hint="Hint copy"
              placeholder="Placeholder"
              options={[
                { value: '1', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { value: '2', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { value: '3', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { value: '4', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
                { value: '5', label: 'Placeholder', iconLeft: <img src="/icons/icon-identity.svg" alt="" width={24} height={24} />, iconRight: <img src="/icons/icon-lock.svg" alt="" width={24} height={24} /> },
              ]}
            />
          </Item>
          <Item>
            <ItemLabel>Disabled</ItemLabel>
            <Autocomplete label="Label" disabled options={[]} placeholder="Placeholder" />
          </Item>
        </Variants>
      </Section>

      {/* ── Defined Field ─────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Defined Field</SectionTitle>
        <Variants>
          <Item><ItemLabel>Pre-tab</ItemLabel><DefinedField label="Website" preTab="https://" placeholder="example.com" /></Item>
          <Item><ItemLabel>Post-tab</ItemLabel><DefinedField label="Price" postTab="USD" placeholder="0.00" /></Item>
          <Item><ItemLabel>Both tabs</ItemLabel><DefinedField label="Amount" preTab="$" postTab=".00" placeholder="0" /></Item>
          <Item><ItemLabel>Disabled</ItemLabel><DefinedField label="Locked" preTab="+" disabled placeholder="Disabled" /></Item>
        </Variants>
      </Section>
    </div>
  )
}
