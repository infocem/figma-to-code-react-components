import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from './Dropdown'

const meta = {
  title: 'Form/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Select an option',
    hint: 'Hint copy',
    items: [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' },
      { id: '3', label: 'Option 3' },
      { id: '4', label: 'Disabled option', disabled: true },
    ],
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
