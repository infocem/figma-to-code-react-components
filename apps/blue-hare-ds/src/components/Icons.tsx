interface IconProps {
  className?: string
  size?: number
  alt?: string
}

function Icon({ src, className, size = 24, alt = '' }: IconProps & { src: string }) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      className={className}
      aria-hidden={alt === '' ? true : undefined}
    />
  )
}

/** Icon that inherits text color via CSS mask-image (for SVGs that need currentColor) */
function MaskIcon({ src, className, size = 24, alt = '' }: IconProps & { src: string }) {
  return (
    <span
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt === '' ? true : undefined}
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        maskImage: `url(${src})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

export function QuestionLineIcon(props: IconProps) {
  return <Icon src="/icons/icon-question-line.svg" {...props} />
}
export function IdentityIcon(props: IconProps) {
  return <Icon src="/icons/icon-identity.svg" {...props} />
}
export function EyeIcon(props: IconProps) {
  return <Icon src="/icons/icon-eye.svg" {...props} />
}
export function PlusIcon(props: IconProps) {
  return <Icon src="/icons/icon-plus.svg" {...props} />
}
export function AddIcon(props: IconProps) {
  return <Icon src="/icons/icon-add.svg" {...props} />
}
export function CheckIcon(props: IconProps) {
  return <Icon src="/icons/icon-check.svg" {...props} />
}
export function MinusIcon(props: IconProps) {
  return <Icon src="/icons/icon-minus.svg" {...props} />
}
export function SwitchKnobIcon(props: IconProps) {
  return <Icon src="/icons/icon-switch-knob.svg" {...props} />
}
export function ChevronDownIcon(props: IconProps) {
  return <Icon src="/icons/icon-chevron-down.svg" {...props} />
}
export function UserIcon(props: IconProps) {
  return <Icon src="/icons/icon-user.svg" {...props} />
}
export function LockIcon(props: IconProps) {
  return <Icon src="/icons/icon-lock.svg" {...props} />
}
export function CloseCircleIcon(props: IconProps) {
  return <MaskIcon src="/icons/icon-close-circle.svg" {...props} />
}
export function ExternalLinkIcon(props: IconProps) {
  return <MaskIcon src="/icons/icon-external-link.svg" {...props} />
}
export function ArrowRightIcon(props: IconProps) {
  return <MaskIcon src="/icons/icon-arrow-right.svg" {...props} />
}
