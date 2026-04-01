import type { Meta, StoryObj } from '@storybook/react-vite'
import { Keyline } from './Keyline'

const meta = {
  title: 'Components/Keyline',
  component: Keyline,
  tags: ['autodocs'],
} satisfies Meta<typeof Keyline>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {},
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div style={{ height: 80 }}>
        <Story />
      </div>
    ),
  ],
}
