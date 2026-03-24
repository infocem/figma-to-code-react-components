import './Badge.css'

type BadgeVariant = 'active' | 'approved' | 'pending' | 'inactive' | 'warning'

interface BadgeProps {
  label: string
  variant: BadgeVariant
}

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>{label}</span>
  )
}
