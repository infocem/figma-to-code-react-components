import clsx from 'clsx'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepState = 'completed' | 'current' | 'not-completed' | 'disabled'

export interface Step {
  label: string
  description?: string
  state?: StepState
}

export interface StepperProps {
  steps: Step[]
  currentStep?: number
  orientation?: StepperOrientation
  className?: string
}

function getStepState(step: Step, index: number, currentStep: number): StepState {
  if (step.state) return step.state
  if (index < currentStep) return 'completed'
  if (index === currentStep) return 'current'
  return 'not-completed'
}

export function Stepper({ steps, currentStep = 0, orientation = 'horizontal', className }: StepperProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <ol
      className={clsx(
        'flex list-none m-0 p-0',
        isHorizontal ? 'flex-row items-start' : 'flex-col',
        className,
      )}
      aria-label="Progress steps"
    >
      {steps.map((step, i) => {
        const state = getStepState(step, i, currentStep)
        const isLast = i === steps.length - 1

        const isActive   = state === 'completed' || state === 'current'
        const isDisabled = state === 'disabled'

        return (
          <li
            key={i}
            className={clsx(
              'flex',
              isHorizontal ? 'flex-col items-center flex-1' : 'flex-row gap-sm',
            )}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {/* Indicator: circle + connector line */}
            <div
              className={clsx(
                'flex items-center',
                isHorizontal ? 'flex-row w-full mb-[var(--spacing-2)]' : 'flex-col',
              )}
            >
              <span
                className={clsx(
                  'inline-flex items-center justify-center',
                  'w-7 h-7 rounded-full border-2 shrink-0',
                  'font-sans text-sm font-semibold',
                  isActive
                    ? 'bg-primary border-primary text-text-on-primary'
                    : isDisabled
                      ? 'bg-bg-disabled border-border text-text-secondary'
                      : 'bg-bg border-border text-text-secondary',
                )}
                aria-hidden="true"
              >
                {state === 'completed' ? (
                  <img src="/icons/icon-check.svg" alt="Completed" width={16} height={16} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </span>

              {!isLast && (
                <span
                  className={clsx(
                    'block',
                    isHorizontal
                      ? clsx('flex-1 h-0.5', state === 'completed' ? 'bg-primary' : 'bg-border')
                      : clsx('w-0.5 flex-1 min-h-6 my-1 mx-auto', state === 'completed' ? 'bg-primary' : 'bg-border'),
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Content */}
            <div
              className={clsx(
                'flex flex-col gap-[2px]',
                isHorizontal ? 'items-center text-center' : 'pb-[var(--spacing-md)]',
              )}
            >
              <span
                className={clsx(
                  'font-sans text-sm font-regular',
                  state === 'current'
                    ? 'text-text font-semibold'
                    : state === 'completed'
                      ? 'text-text'
                      : isDisabled
                        ? 'text-text-secondary'
                        : 'text-text-secondary',
                )}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="font-sans text-sm font-regular text-text-secondary">
                  {step.description}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
