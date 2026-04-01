import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Drawer } from './Drawer'
import { Button } from '../Button/Button'

const meta: Meta<typeof Drawer> = {
  title: 'Layout/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  args: {
    title: 'Drawer title',
    placement: 'right',
    children: <p style={{ margin: 0 }}>Drawer content goes here.</p>,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <div style={{ padding: 24 }}>
        <Button variant="primary" onPress={() => setIsOpen(true)}>
          Open Drawer
        </Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    )
  },
}
