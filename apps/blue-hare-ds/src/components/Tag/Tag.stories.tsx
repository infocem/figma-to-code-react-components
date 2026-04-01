import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Design',
  },
}

export const Success: Story = {
  args: {
    children: 'Design',
    type: 'success',
  },
}

export const Error: Story = {
  args: {
    children: 'Design',
    type: 'error',
  },
}

export const Interactive: Story = {
  args: {
    children: 'Design',
    interactive: true,
    selected: true,
    onRemove: () => {},
  },
}

export const Disabled: Story = {
  args: {
    children: 'Design',
    type: 'disabled',
  },
}
