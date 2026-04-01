import type { Meta, StoryObj } from '@storybook/react-vite'
import ShowcasePage from './ShowcasePage'

const meta: Meta<typeof ShowcasePage> = {
  title: 'Pages/ShowcasePage',
  component: ShowcasePage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof ShowcasePage>

export const Default: Story = {}
