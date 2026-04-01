import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: {
    label: 'First name',
    placeholder: 'Enter first name',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Locked',
    disabled: true,
    placeholder: 'Disabled',
  },
}
