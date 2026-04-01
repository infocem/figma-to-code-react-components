import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './Progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Linear: Story = {
  args: {
    value: 80,
    label: 'Completion: 80%',
  },
}

export const LinearNoLabel: Story = {
  args: {
    value: 80,
  },
}

export const CircularLarge: Story = {
  args: {
    type: 'circular',
    value: 80,
    size: 160,
  },
}

export const CircularMedium: Story = {
  args: {
    type: 'circular',
    value: 80,
    size: 120,
  },
}

export const CircularSmall: Story = {
  args: {
    type: 'circular',
    value: 80,
    size: 80,
  },
}
