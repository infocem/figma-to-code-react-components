import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip } from './Chip'

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Chip',
    onRemove: () => {},
  },
}

export const Information: Story = {
  args: {
    children: 'Chip',
    type: 'information',
    onRemove: () => {},
  },
}

export const Success: Story = {
  args: {
    children: 'Chip',
    type: 'success',
    onRemove: () => {},
  },
}

export const Warning: Story = {
  args: {
    children: 'Chip',
    type: 'warning',
    onRemove: () => {},
  },
}

export const Error: Story = {
  args: {
    children: 'Chip',
    type: 'error',
    onRemove: () => {},
  },
}

export const Disabled: Story = {
  args: {
    children: 'Chip',
    type: 'disabled',
  },
}
