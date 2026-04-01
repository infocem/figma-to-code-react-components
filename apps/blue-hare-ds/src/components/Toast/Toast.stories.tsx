import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toast } from './Toast'

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Toast title',
    description: 'This is a toast description message.',
  },
}

export default meta
type Story = StoryObj<typeof Toast>

export const Info: Story = {
  args: { type: 'info' },
}

export const Success: Story = {
  args: { type: 'success' },
}

export const Warning: Story = {
  args: { type: 'warning' },
}

export const Error: Story = {
  args: { type: 'error' },
}
