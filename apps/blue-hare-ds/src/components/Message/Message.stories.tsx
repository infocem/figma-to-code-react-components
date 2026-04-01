import type { Meta, StoryObj } from '@storybook/react-vite'
import { Message } from './Message'

const meta: Meta<typeof Message> = {
  title: 'Components/Message',
  component: Message,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Message title',
    description: 'This is a message description with additional details.',
    onClose: () => {},
  },
}

export default meta
type Story = StoryObj<typeof Message>

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
