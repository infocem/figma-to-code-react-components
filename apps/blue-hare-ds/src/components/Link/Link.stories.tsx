import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from './Link'

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '#',
    children: 'Link',
  },
}

export const Inline: Story = {
  args: {
    variant: 'inline',
    href: '#',
    children: 'inline link',
  },
  decorators: [
    (Story) => (
      <p>
        This is a paragraph with an <Story /> inside it.
      </p>
    ),
  ],
}

export const Standalone: Story = {
  args: {
    variant: 'standalone',
    href: '#',
    children: 'Standalone Link',
  },
}

export const Disabled: Story = {
  args: {
    href: '#',
    disabled: true,
    children: 'Link',
  },
}
