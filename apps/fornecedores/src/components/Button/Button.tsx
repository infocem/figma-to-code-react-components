import './Button.css'

type ButtonType = 'primary' | 'outline' | 'transparent'
type ButtonStatus = 'default' | 'disabled'

interface ButtonProps {
  label: string
  type?: ButtonType
  status?: ButtonStatus
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onClick?: () => void
}

export function Button({
  label,
  type = 'primary',
  status = 'default',
  iconLeft,
  iconRight,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${type}`}
      disabled={status === 'disabled'}
      onClick={onClick}
    >
      {iconLeft && <span className="btn__icon btn__icon--left">{iconLeft}</span>}
      <span className="btn__label">{label}</span>
      {iconRight && <span className="btn__icon btn__icon--right">{iconRight}</span>}
    </button>
  )
}
