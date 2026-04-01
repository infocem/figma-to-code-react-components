import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table } from './Table'

const meta: Meta<typeof Table> = {
  title: 'Layout/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  args: {
    columns: [
      { key: 'name', heading: 'Name', sortable: true },
      { key: 'role', heading: 'Role', sortable: true },
      { key: 'status', heading: 'Status' },
    ],
    rows: [
      { id: '1', name: 'Alice Johnson', role: 'Engineer', status: 'Active' },
      { id: '2', name: 'Bob Smith', role: 'Designer', status: 'Active' },
      { id: '3', name: 'Carol Williams', role: 'Manager', status: 'Inactive' },
    ],
  },
}
