import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu } from './Menu'

const icon = (name: string) => (
  <img src={`/icons/icon-${name}.svg`} alt="" width={24} height={24} />
)

const meta = {
  title: 'Form/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    items: [
      { id: '1', label: 'Menu item 1', iconLeft: icon('identity') },
      { id: '2', label: 'Menu item 2', iconLeft: icon('identity') },
      { id: '3', label: 'Menu item 3', iconLeft: icon('identity') },
      { id: '4', label: 'Disabled item', iconLeft: icon('identity'), disabled: true },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSelection: Story = {
  args: {
    items: [
      { id: '1', label: 'Menu item 1', iconLeft: icon('identity') },
      { id: '2', label: 'Menu item 2', iconLeft: icon('identity'), selected: true },
      { id: '3', label: 'Menu item 3', iconLeft: icon('identity') },
    ],
  },
}
