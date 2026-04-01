import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel } from './Carousel'

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Carousel>

export const Default: Story = {
  args: {
    items: [
      <div key="1" style={{ background: '#e0e7ff', borderRadius: 8, padding: 48, textAlign: 'center', fontSize: 20 }}>Slide 1</div>,
      <div key="2" style={{ background: '#dbeafe', borderRadius: 8, padding: 48, textAlign: 'center', fontSize: 20 }}>Slide 2</div>,
      <div key="3" style={{ background: '#ede9fe', borderRadius: 8, padding: 48, textAlign: 'center', fontSize: 20 }}>Slide 3</div>,
    ],
  },
}
