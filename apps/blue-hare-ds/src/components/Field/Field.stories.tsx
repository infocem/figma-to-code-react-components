import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './Field'

const meta = {
  title: 'Form/Field',
  component: Field,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Email',
    placeholder: 'Enter email',
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoIcons: Story = {
  args: {
    'aria-label': 'Name',
    showLeftIcon: false,
    showRightIcon: false,
    placeholder: 'Enter name',
  },
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Disabled',
    disabled: true,
    placeholder: 'Not editable',
  },
}
