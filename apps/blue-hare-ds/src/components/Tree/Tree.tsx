import { useState } from 'react'
import clsx from 'clsx'
import iconChevronRight from '../../../public/icons/icon-chevron-right.svg'

export interface TreeNode {
  key: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeProps {
  nodes: TreeNode[]
  selectedKey?: string
  onSelect?: (key: string) => void
  defaultExpanded?: string[]
  className?: string
}

interface TreeNodeItemProps {
  node: TreeNode
  selectedKey?: string
  expanded: Set<string>
  onToggle: (key: string) => void
  onSelect?: (key: string) => void
  depth: number
}

function TreeNodeItem({ node, selectedKey, expanded, onToggle, onSelect, depth }: TreeNodeItemProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expanded.has(node.key)
  const isSelected = node.key === selectedKey

  return (
    <li className={clsx('flex flex-col', node.disabled && 'tree__node--disabled')}>
      <button
        className={clsx(
          'flex flex-row items-center gap-2 w-full bg-transparent border-none rounded-sm',
          'font-sans text-md font-regular text-text text-left outline-none cursor-pointer',
          'hover:not-aria-disabled:bg-bg-hover hover:not-aria-disabled:text-primary',
          'focus-visible:shadow-[0_0_0_var(--focus-ring-width)_var(--focus-ring-color)]',
          isSelected && 'bg-bg-hover text-primary font-semibold',
          node.disabled && 'text-text-disabled cursor-not-allowed',
        )}
        style={{ paddingTop: 'var(--spacing-2)', paddingBottom: 'var(--spacing-2)', paddingLeft: `${16 + depth * 20}px`, paddingRight: 'var(--spacing-md)' }}
        onClick={() => {
          if (node.disabled) return
          if (hasChildren) onToggle(node.key)
          else onSelect?.(node.key)
        }}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-disabled={node.disabled}
      >
        {hasChildren && (
          <span
            className={clsx(
              'flex items-center w-4 h-4 shrink-0 transition-transform duration-150',
              isExpanded && 'rotate-90'
            )}
            aria-hidden="true"
          >
            <img src={iconChevronRight} alt="" width={16} height={16} />
          </span>
        )}
        {!hasChildren && <span className="flex items-center w-4 h-4 shrink-0" aria-hidden="true" />}
        {node.icon && <span className="flex items-center shrink-0" aria-hidden="true">{node.icon}</span>}
        <span className="flex-1">{node.label}</span>
      </button>
      {hasChildren && isExpanded && (
        <ul className="list-none m-0 p-0">
          {node.children!.map(child => (
            <TreeNodeItem
              key={child.key}
              node={child}
              selectedKey={selectedKey}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function Tree({ nodes, selectedKey, onSelect, defaultExpanded = [], className }: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded))

  const toggle = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <ul
      className={clsx('list-none m-0 p-0', className)}
      role="tree"
      aria-label="Tree navigation"
    >
      {nodes.map(node => (
        <TreeNodeItem
          key={node.key}
          node={node}
          selectedKey={selectedKey}
          expanded={expanded}
          onToggle={toggle}
          onSelect={onSelect}
          depth={0}
        />
      ))}
    </ul>
  )
}
