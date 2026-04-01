import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './Pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Jumper: Story = {
  args: {
    total: 10,
    variant: 'jumper',
  },
  render: function Render(args) {
    const [page, setPage] = useState(4)
    return <Pagination {...args} page={page} onPageChange={setPage} />
  },
}

export const Default: Story = {
  args: {
    total: 20,
    variant: 'default',
  },
  render: function Render(args) {
    const [page, setPage] = useState(1)
    return <Pagination {...args} page={page} onPageChange={setPage} />
  },
}
