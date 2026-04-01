import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  QuestionLineIcon,
  IdentityIcon,
  EyeIcon,
  PlusIcon,
  AddIcon,
  CheckIcon,
  MinusIcon,
  SwitchKnobIcon,
  ChevronDownIcon,
  UserIcon,
  LockIcon,
  CloseCircleIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
} from './Icons'

const icons = [
  { name: 'QuestionLineIcon', Component: QuestionLineIcon },
  { name: 'IdentityIcon', Component: IdentityIcon },
  { name: 'EyeIcon', Component: EyeIcon },
  { name: 'PlusIcon', Component: PlusIcon },
  { name: 'AddIcon', Component: AddIcon },
  { name: 'CheckIcon', Component: CheckIcon },
  { name: 'MinusIcon', Component: MinusIcon },
  { name: 'SwitchKnobIcon', Component: SwitchKnobIcon },
  { name: 'ChevronDownIcon', Component: ChevronDownIcon },
  { name: 'UserIcon', Component: UserIcon },
  { name: 'LockIcon', Component: LockIcon },
  { name: 'CloseCircleIcon', Component: CloseCircleIcon },
  { name: 'ExternalLinkIcon', Component: ExternalLinkIcon },
  { name: 'ArrowRightIcon', Component: ArrowRightIcon },
]

const meta: Meta = {
  title: 'Icons/IconGallery',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 24 }}>
      {icons.map(({ name, Component }) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 16,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
          }}
        >
          <Component size={32} />
          <span style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', wordBreak: 'break-all' }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
}
