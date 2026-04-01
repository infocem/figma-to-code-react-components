import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    children: 'Checkbox label',
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}

export const Checked: Story = {
  args: {
    isSelected: true,
    children: 'Checked option',
  },
}

export const Indeterminate: Story = {
  args: {
    isIndeterminate: true,
    children: 'Indeterminate',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: 'Disabled option',
  },
}
