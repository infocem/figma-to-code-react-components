import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'

const meta = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    children: 'Toggle me',
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = {
  args: {
    isSelected: false,
  },
}

export const On: Story = {
  args: {
    isSelected: true,
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: 'Disabled',
  },
}
