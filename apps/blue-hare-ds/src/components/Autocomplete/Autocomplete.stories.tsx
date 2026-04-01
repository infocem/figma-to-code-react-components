import type { Meta, StoryObj } from '@storybook/react-vite'
import { Autocomplete } from './Autocomplete'

const sampleOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
]

const meta = {
  title: 'Form/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  args: {
    label: 'Framework',
    placeholder: 'Type to search…',
    hint: 'Choose your favorite framework',
    options: sampleOptions,
  },
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
