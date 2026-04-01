import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tree } from './Tree'

const meta: Meta<typeof Tree> = {
  title: 'Layout/Tree',
  component: Tree,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tree>

export const Default: Story = {
  args: {
    defaultExpanded: ['documents'],
    nodes: [
      {
        key: 'documents',
        label: 'Documents',
        children: [
          { key: 'resume', label: 'Resume.pdf' },
          { key: 'cover-letter', label: 'Cover Letter.docx' },
        ],
      },
      {
        key: 'images',
        label: 'Images',
        children: [
          { key: 'photo1', label: 'photo1.png' },
          { key: 'photo2', label: 'photo2.jpg' },
        ],
      },
    ],
  },
  render: (args) => {
    const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined)
    return (
      <Tree
        {...args}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
      />
    )
  },
}
