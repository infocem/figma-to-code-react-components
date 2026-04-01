import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Icon: Story = {
  args: {},
}

export const Initials: Story = {
  args: {
    type: 'initials',
    initials: 'CM',
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
