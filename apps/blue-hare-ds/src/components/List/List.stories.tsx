import type { Meta, StoryObj } from '@storybook/react-vite'
import { List } from './List'

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof List>

export const Default: Story = {
  args: {
    heading: 'Heading',
    items: Array.from({ length: 8 }, (_, i) => ({
      title: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
    })),
  },
}
