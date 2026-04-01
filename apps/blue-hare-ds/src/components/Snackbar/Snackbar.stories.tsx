import type { Meta, StoryObj } from '@storybook/react-vite'
import { Snackbar } from './Snackbar'

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Snackbar title',
    description: 'This is a snackbar description message.',
    onClose: () => {},
  },
}

export default meta
type Story = StoryObj<typeof Snackbar>

export const Default: Story = {
  args: { type: 'default', progress: 60 },
}

export const Information: Story = {
  args: { type: 'information' },
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
