import type { Meta, StoryObj } from '@storybook/react-vite'
import { FornecedoresScreen } from './FornecedoresScreen'

const meta: Meta<typeof FornecedoresScreen> = {
  title: 'Pages/Fornecedores',
  component: FornecedoresScreen,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof FornecedoresScreen>

export const Default: Story = {}
