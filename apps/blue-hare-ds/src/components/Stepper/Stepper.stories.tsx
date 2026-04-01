import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from './Stepper'

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stepper>

export const Horizontal: Story = {
  args: {
    steps: [
      { label: 'Step 1', description: 'First step' },
      { label: 'Step 2', description: 'Second step' },
      { label: 'Step 3', description: 'Third step' },
      { label: 'Step 4', description: 'Fourth step' },
    ],
    currentStep: 1,
    orientation: 'horizontal',
  },
}

export const Vertical: Story = {
  args: {
    steps: [
      { label: 'Step 1', description: 'First step' },
      { label: 'Step 2', description: 'Second step' },
      { label: 'Step 3', description: 'Third step' },
    ],
    currentStep: 1,
    orientation: 'vertical',
  },
}
