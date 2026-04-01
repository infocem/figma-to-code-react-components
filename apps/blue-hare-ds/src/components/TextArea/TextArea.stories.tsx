import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextArea } from './TextArea'

const meta = {
  title: 'Form/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithMaxLength: Story = {
  args: {
    maxLength: 500,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
