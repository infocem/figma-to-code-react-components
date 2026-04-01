import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from './Slider'

const meta = {
  title: 'Form/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    label: 'Slider',
    min: 0,
    max: 100,
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: (args) => {
    const [value, setValue] = useState(50)
    return <Slider {...args} value={value} onChange={setValue} />
  },
}

export const Range: Story = {
  render: (args) => {
    const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75])
    return (
      <Slider
        {...args}
        type="range"
        rangeValue={rangeValue}
        onRangeChange={setRangeValue}
      />
    )
  },
}

export const Disabled: Story = {
  args: {
    value: 40,
    disabled: true,
  },
}
