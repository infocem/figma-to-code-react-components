import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Button',
  },
}

export const Transparent: Story = {
  args: {
    variant: 'transparent',
    children: 'Button',
  },
}

export const IconLeft: Story = {
  args: {
    variant: 'primary',
    iconLeft: true,
    children: 'Button',
  },
}

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    iconOnly: true,
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Button',
  },
}
