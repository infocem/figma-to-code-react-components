import type { Meta, StoryObj } from '@storybook/react-vite'
import { Loader } from './Loader'

const meta = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs'],
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    type: 'primary',
    size: 'medium',
  },
}

export const Secondary: Story = {
  args: {
    type: 'secondary',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
  },
}
