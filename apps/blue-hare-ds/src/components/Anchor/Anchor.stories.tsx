import type { Meta, StoryObj } from '@storybook/react-vite'
import { Anchor } from './Anchor'

const meta = {
  title: 'Components/Anchor',
  component: Anchor,
  tags: ['autodocs'],
} satisfies Meta<typeof Anchor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { key: 'overview', label: 'Overview' },
      { key: 'usage', label: 'Usage' },
      { key: 'api', label: 'API' },
    ],
    activeKey: 'usage',
  },
}
