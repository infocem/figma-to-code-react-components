import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './Label'

const meta = {
  title: 'Form/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    children: 'Field label',
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = {
  args: {
    children: 'Required field',
    required: true,
  },
}

export const WithHelpIcon: Story = {
  args: {
    children: 'With help',
    showHelpIcon: true,
  },
}
