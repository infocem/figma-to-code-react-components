import clsx from 'clsx'
import './Avatar.css'

export type AvatarType = 'icon' | 'initials' | 'image'
export type AvatarSize = 'small' | 'medium' | 'large'

export interface AvatarProps {
  type?: AvatarType
  size?: AvatarSize
  initials?: string
  src?: string
  alt?: string
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  small:  'w-[30px] h-[30px]',
  medium: 'w-[40px] h-[40px]',
  large:  'w-[64px] h-[64px]',
}

const initialsSizeClasses: Record<AvatarSize, string> = {
  small:  'text-sm',
  medium: 'text-md',
  large:  'text-xl',
}

export function Avatar({ type = 'icon', size = 'medium', initials = 'PA', src, alt, className }: AvatarProps) {
  return (
    <span
      className={clsx(
        'avatar',
        'inline-flex items-center justify-center',
        'rounded-full bg-bg-tag border border-border',
        'shrink-0 overflow-hidden',
        sizeClasses[size],
        className,
      )}
    >
      {type === 'initials' && (
        <span
          className={clsx(
            'font-sans font-semibold text-text leading-none',
            initialsSizeClasses[size],
          )}
        >
          {initials}
        </span>
      )}
      {type === 'image' && src && (
        <img src={src} alt={alt ?? initials} className="w-full h-full object-cover" />
      )}
      {type === 'icon' && (
        <span
          className="flex items-center justify-center text-text-on-primary [&>svg]:w-[60%] [&>svg]:h-[60%]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </span>
      )}
    </span>
  )
}

export interface AvatarGroupProps {
  avatars: AvatarProps[]
  size?: AvatarSize
  max?: number
  className?: string
}

export function AvatarGroup({ avatars, size = 'medium', max = 5, className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div className={clsx('avatar-group', 'flex flex-row items-center', className)}>
      {visible.map((avatar, i) => (
        <Avatar key={i} {...avatar} size={size} />
      ))}
      {overflow > 0 && (
        <Avatar type="initials" size={size} initials={`+${overflow}`} />
      )}
    </div>
  )
}
