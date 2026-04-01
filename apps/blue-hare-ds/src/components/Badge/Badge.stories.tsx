import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    count: 99,
  },
}

export const Information: Story = {
  args: {
    count: 99,
    status: 'information',
  },
}

export const Error: Story = {
  args: {
    count: 99,
    status: 'error',
  },
}

export const Warning: Story = {
  args: {
    count: 99,
    status: 'warning',
  },
}

export const Success: Story = {
  args: {
    count: 99,
    status: 'success',
  },
}

export const DotDefault: Story = {
  args: {
    type: 'dot',
  },
}

export const DotInfo: Story = {
  args: {
    type: 'dot',
    status: 'information',
  },
}

export const DotError: Story = {
  args: {
    type: 'dot',
    status: 'error',
  },
}

export const DotWarning: Story = {
  args: {
    type: 'dot',
    status: 'warning',
  },
}

export const DotSuccess: Story = {
  args: {
    type: 'dot',
    status: 'success',
  },
}
