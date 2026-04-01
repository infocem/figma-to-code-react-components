import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './Tooltip'
import { Button } from '../Button/Button'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Tooltip text',
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Top: Story = {
  args: {
    placement: 'top',
    children: <Button variant="outline">Hover me (top)</Button>,
  },
}

export const Bottom: Story = {
  args: {
    placement: 'bottom',
    children: <Button variant="outline">Hover me (bottom)</Button>,
  },
}

export const Left: Story = {
  args: {
    placement: 'left',
    children: <Button variant="outline">Hover me (left)</Button>,
  },
}

export const Right: Story = {
  args: {
    placement: 'right',
    children: <Button variant="outline">Hover me (right)</Button>,
  },
}
