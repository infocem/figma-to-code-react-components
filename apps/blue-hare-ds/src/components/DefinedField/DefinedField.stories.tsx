import type { Meta, StoryObj } from '@storybook/react-vite'
import { DefinedField } from './DefinedField'

const meta = {
  title: 'Form/DefinedField',
  component: DefinedField,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof DefinedField>

export default meta
type Story = StoryObj<typeof meta>

export const PreTab: Story = {
  args: {
    preTab: 'https://',
  },
}

export const PostTab: Story = {
  args: {
    postTab: 'USD',
  },
}

export const BothTabs: Story = {
  args: {
    preTab: '$',
    postTab: '.00',
  },
}

export const Disabled: Story = {
  args: {
    preTab: 'https://',
    disabled: true,
  },
}
