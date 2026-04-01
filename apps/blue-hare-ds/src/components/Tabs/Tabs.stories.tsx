import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { key: 'overview', label: 'Overview', children: 'Overview content goes here.' },
      { key: 'usage', label: 'Usage', children: 'Usage content goes here.' },
      { key: 'api', label: 'API', children: 'API reference content goes here.' },
      { key: 'changelog', label: 'Changelog', disabled: true, children: 'Changelog content.' },
    ],
  },
  render: function Render(args) {
    const [selected, setSelected] = useState('overview')
    return (
      <Tabs
        {...args}
        selectedKey={selected}
        onSelectionChange={setSelected}
      />
    )
  },
}
