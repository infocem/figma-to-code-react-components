import React, { useRef } from 'react'
import { useTooltip, useTooltipTrigger } from 'react-aria'
import { useTooltipTriggerState } from 'react-stately'
import clsx from 'clsx'
import './Tooltip.css'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: string
  placement?: TooltipPlacement
  children: React.ReactElement
}

export function Tooltip({ content, placement = 'top', children }: TooltipProps) {
  const state = useTooltipTriggerState({ delay: 200 })
  const triggerRef = useRef<HTMLElement>(null)
  const { triggerProps, tooltipProps: tooltipTriggerProps } = useTooltipTrigger({}, state, triggerRef)

  const tooltipRef = useRef<HTMLDivElement>(null)
  const { tooltipProps } = useTooltip(tooltipTriggerProps, state)

  return (
    <span className="relative inline-flex">
      {React.cloneElement(children, { ...triggerProps, ref: triggerRef })}
      {state.isOpen && (
        <div
          {...tooltipProps}
          ref={tooltipRef}
          className={clsx(
            'tooltip',
            'inline-flex items-center absolute z-100 pointer-events-none',
            {
              'flex-col':  placement === 'top' || placement === 'bottom',
              'flex-row':  placement === 'left' || placement === 'right',
              'tooltip--top':    placement === 'top',
              'tooltip--bottom': placement === 'bottom',
              'tooltip--left':   placement === 'left',
              'tooltip--right':  placement === 'right',
            }
          )}
          role="tooltip"
        >
          {(placement === 'bottom' || placement === 'right') && (
            <span
              className={clsx('tooltip__tip', 'block bg-bg-dark shrink-0')}
              aria-hidden="true"
            />
          )}
          <div className="bg-bg-dark text-text-on-primary rounded-sm px-md py-2 font-sans text-md font-regular leading-md whitespace-nowrap">
            {content}
          </div>
          {(placement === 'top' || placement === 'left') && (
            <span
              className={clsx('tooltip__tip', 'block bg-bg-dark shrink-0')}
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </span>
  )
}
