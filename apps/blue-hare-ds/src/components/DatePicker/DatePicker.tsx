import { useState, useRef } from 'react'
import { useButton } from 'react-aria'
import clsx from 'clsx'
import { Label } from '../Label/Label'
import iconCalendar from '../../../public/icons/icon-calendar.svg'

export interface DatePickerProps {
  label?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  showHelpIcon?: boolean
  hint?: string
  onChange?: (value: string) => void
  className?: string
}

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

function parseDate(str: string): Date | null {
  const parts = str.split('/')
  if (parts.length !== 3) return null
  const [dd, mm, yyyy] = parts.map(Number)
  if (!dd || !mm || !yyyy) return null
  return new Date(yyyy, mm - 1, dd)
}

interface CalendarProps {
  selectedDate: Date | null
  onSelect: (date: Date) => void
}

function Calendar({ selectedDate, onSelect }: CalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth())

  const prevYearRef = useRef<HTMLButtonElement>(null)
  const prevMonthRef = useRef<HTMLButtonElement>(null)
  const nextMonthRef = useRef<HTMLButtonElement>(null)
  const nextYearRef = useRef<HTMLButtonElement>(null)

  const { buttonProps: prevYearProps } = useButton({ onPress: () => setViewYear(y => y - 1), 'aria-label': 'Previous year' }, prevYearRef)
  const { buttonProps: prevMonthProps } = useButton({ onPress: () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1)
  }, 'aria-label': 'Previous month' }, prevMonthRef)
  const { buttonProps: nextMonthProps } = useButton({ onPress: () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1)
  }, 'aria-label': 'Next month' }, nextMonthRef)
  const { buttonProps: nextYearProps } = useButton({ onPress: () => setViewYear(y => y + 1), 'aria-label': 'Next year' }, nextYearRef)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  const isToday = (day: number) => today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear
  const isSelected = (day: number) => selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="bg-bg border border-border rounded-md shadow-dropdown p-md w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-1">
          <button {...prevYearProps} ref={prevYearRef} className="flex items-center justify-center w-6 h-6 bg-transparent border-none cursor-pointer rounded-sm text-primary font-sans text-sm font-semibold hover:bg-bg-hover outline-none">«</button>
          <button {...prevMonthProps} ref={prevMonthRef} className="flex items-center justify-center w-6 h-6 bg-transparent border-none cursor-pointer rounded-sm text-primary font-sans text-sm font-semibold hover:bg-bg-hover outline-none">‹</button>
        </div>
        <span className="font-sans text-md font-semibold text-primary">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <div className="flex items-center gap-1">
          <button {...nextMonthProps} ref={nextMonthRef} className="flex items-center justify-center w-6 h-6 bg-transparent border-none cursor-pointer rounded-sm text-primary font-sans text-sm font-semibold hover:bg-bg-hover outline-none">›</button>
          <button {...nextYearProps} ref={nextYearRef} className="flex items-center justify-center w-6 h-6 bg-transparent border-none cursor-pointer rounded-sm text-primary font-sans text-sm font-semibold hover:bg-bg-hover outline-none">»</button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="flex items-center justify-center h-8 font-sans text-sm font-semibold text-text-secondary">{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => (
          <span key={i} className="flex items-center justify-center">
            {day ? (
              <button
                className={clsx(
                  'flex items-center justify-center w-8 h-8 rounded-sm border-0 font-sans text-md cursor-pointer outline-none transition-[background,color] duration-100',
                  isSelected(day)
                    ? 'bg-primary text-text-on-primary font-semibold'
                    : isToday(day)
                      ? 'bg-bg-hover text-primary font-semibold'
                      : 'bg-transparent text-text hover:bg-bg-hover',
                  'focus-visible:shadow-[0_0_0_1.5px_var(--color-primary)]',
                )}
                onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
                aria-label={`${day} ${MONTH_NAMES[viewMonth]} ${viewYear}`}
                aria-pressed={isSelected(day) || undefined}
              >
                {day}
              </button>
            ) : (
              <span className="w-8 h-8" />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

export function DatePicker({
  label,
  value,
  placeholder = '00/00/0000',
  disabled,
  required,
  showHelpIcon,
  hint,
  onChange,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputId = `date-picker-${Math.random().toString(36).slice(2)}`

  const { buttonProps } = useButton({
    isDisabled: disabled,
    onPress: () => setOpen(v => !v),
    'aria-label': 'Open calendar',
  }, triggerRef)

  const selectedDate = value ? parseDate(value) : null

  return (
    <div className={clsx('flex flex-col gap-2 w-field-width', className)}>
      {label && (
        <Label htmlFor={inputId} required={required} showHelpIcon={showHelpIcon}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        <div
          className={clsx(
            'flex items-center w-full h-field-height border border-border rounded-md bg-bg overflow-hidden',
            open && 'border-primary',
            disabled && 'bg-bg-disabled border-border-disabled',
          )}
        >
          <input
            id={inputId}
            type="text"
            value={value ?? ''}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            onChange={e => onChange?.(e.target.value)}
            aria-describedby={hint ? `${inputId}-hint` : undefined}
            className={clsx(
              'flex-1 h-full border-none bg-transparent px-md font-sans text-md font-regular text-text outline-none min-w-0 placeholder:text-text-placeholder',
              disabled && 'text-text-disabled cursor-not-allowed',
            )}
          />
          <button
            {...buttonProps}
            ref={triggerRef}
            className={clsx(
              'flex items-center justify-center shrink-0 h-full px-sm border-none cursor-pointer outline-none',
              disabled ? 'bg-bg-disabled cursor-not-allowed' : 'bg-primary',
            )}
          >
            <img src={iconCalendar} alt="" width={24} height={24} />
          </button>
        </div>
        {open && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-[100]">
            <Calendar
              selectedDate={selectedDate}
              onSelect={(date) => {
                onChange?.(formatDate(date))
                setOpen(false)
              }}
            />
          </div>
        )}
      </div>
      {hint && (
        <span id={`${inputId}-hint`} className="font-sans text-sm text-text-secondary">
          {hint}
        </span>
      )}
    </div>
  )
}
