import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioButton, RadioGroup } from './RadioButton'

const meta = {
  title: 'Form/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup label="Choose an option" defaultValue="option-1">
      <RadioButton value="option-1">Option 1</RadioButton>
      <RadioButton value="option-2">Option 2</RadioButton>
      <RadioButton value="option-3">Option 3</RadioButton>
    </RadioGroup>
  ),
}

export const WithDisabledOption: Story = {
  render: () => (
    <RadioGroup label="Choose an option" defaultValue="option-1">
      <RadioButton value="option-1">Option 1</RadioButton>
      <RadioButton value="option-2" isDisabled>Option 2 (disabled)</RadioButton>
      <RadioButton value="option-3">Option 3</RadioButton>
    </RadioGroup>
  ),
}

export const DisabledGroup: Story = {
  render: () => (
    <RadioGroup label="Disabled group" defaultValue="option-2" isDisabled>
      <RadioButton value="option-1">Option 1</RadioButton>
      <RadioButton value="option-2">Option 2</RadioButton>
      <RadioButton value="option-3">Option 3</RadioButton>
    </RadioGroup>
  ),
}
