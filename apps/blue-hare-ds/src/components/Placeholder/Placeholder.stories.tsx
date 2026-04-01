import type { Meta, StoryObj } from '@storybook/react-vite'
import { Placeholder } from './Placeholder'
import { Button } from '../Button/Button'

const meta: Meta<typeof Placeholder> = {
  title: 'Components/Placeholder',
  component: Placeholder,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Placeholder>

export const WithContent: Story = {
  args: {
    title: 'Placeholder title',
    description: 'This is a placeholder description with some helpful text.',
    width: 320,
  },
}

export const EmptyState: Story = {
  args: {
    title: 'No items found',
    description: 'Get started by creating a new item.',
    action: <Button variant="primary">Create item</Button>,
  },
}

export const Minimal: Story = {
  args: {
    width: 320,
    height: 120,
  },
}
