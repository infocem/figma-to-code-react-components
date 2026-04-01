import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navigation } from './Navigation'

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Navigation>

export const Default: Story = {
  args: {
    items: [
      { key: 'home', label: 'Home', href: '#' },
      { key: 'about', label: 'About', href: '#' },
      { key: 'services', label: 'Services', href: '#' },
      { key: 'contact', label: 'Contact', href: '#' },
    ],
    activeKey: 'home',
  },
}
