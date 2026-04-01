import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    showHelpIcon: true,
    hint: 'Hint copy',
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = {
  args: {
    required: true,
    showHelpIcon: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
