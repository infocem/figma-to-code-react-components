import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonGroup } from './ButtonGroup'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { key: 'day', label: 'Day' },
      { key: 'week', label: 'Week' },
      { key: 'month', label: 'Month' },
    ],
  },
  render: function Render(args) {
    const [selected, setSelected] = useState('day')
    return (
      <ButtonGroup
        {...args}
        selectedKey={selected}
        onSelectionChange={setSelected}
      />
    )
  },
}

export const Toggle: Story = {
  args: {
    type: 'toggle',
    items: [
      { key: 'on', label: 'On' },
      { key: 'off', label: 'Off' },
    ],
  },
  render: function Render(args) {
    const [selected, setSelected] = useState('on')
    return (
      <ButtonGroup
        {...args}
        selectedKey={selected}
        onSelectionChange={setSelected}
      />
    )
  },
}
