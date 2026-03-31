import clsx from 'clsx'
import { QuestionLineIcon } from '../Icons'

export interface LabelProps {
  children: React.ReactNode
  /** Shows red asterisk to mark the field as required */
  required?: boolean
  /** Shows the help/question icon after the label text */
  showHelpIcon?: boolean
  htmlFor?: string
  className?: string
}

export function Label({ children, required, showHelpIcon, htmlFor, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        'inline-flex flex-row items-center gap-sm',
        'font-sans text-md font-regular leading-md text-text cursor-default',
        className
      )}
    >
      <span className="inline-flex items-center gap-[2px]">
        <span className="text-text">{children}</span>
        {required && <span className="text-required font-semibold" aria-hidden="true">*</span>}
      </span>
      {showHelpIcon && (
        <QuestionLineIcon className="w-icon-md h-icon-md shrink-0" size={24} alt="Help" />
      )}
    </label>
  )
}
