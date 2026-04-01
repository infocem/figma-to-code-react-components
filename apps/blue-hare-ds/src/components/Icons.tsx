import iconQuestionLine from '../../public/icons/icon-question-line.svg'
import iconIdentity from '../../public/icons/icon-identity.svg'
import iconEye from '../../public/icons/icon-eye.svg'
import iconPlus from '../../public/icons/icon-plus.svg'
import iconAdd from '../../public/icons/icon-add.svg'
import iconCheck from '../../public/icons/icon-check.svg'
import iconMinus from '../../public/icons/icon-minus.svg'
import iconSwitchKnob from '../../public/icons/icon-switch-knob.svg'
import iconChevronDown from '../../public/icons/icon-chevron-down.svg'
import iconUser from '../../public/icons/icon-user.svg'
import iconLock from '../../public/icons/icon-lock.svg'
import iconCloseCircle from '../../public/icons/icon-close-circle.svg'
import iconExternalLink from '../../public/icons/icon-external-link.svg'
import iconArrowRight from '../../public/icons/icon-arrow-right.svg'

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
  return <Icon src={iconQuestionLine} {...props} />
}
export function IdentityIcon(props: IconProps) {
  return <Icon src={iconIdentity} {...props} />
}
export function EyeIcon(props: IconProps) {
  return <Icon src={iconEye} {...props} />
}
export function PlusIcon(props: IconProps) {
  return <Icon src={iconPlus} {...props} />
}
export function AddIcon(props: IconProps) {
  return <Icon src={iconAdd} {...props} />
}
export function CheckIcon(props: IconProps) {
  return <Icon src={iconCheck} {...props} />
}
export function MinusIcon(props: IconProps) {
  return <Icon src={iconMinus} {...props} />
}
export function SwitchKnobIcon(props: IconProps) {
  return <Icon src={iconSwitchKnob} {...props} />
}
export function ChevronDownIcon(props: IconProps) {
  return <Icon src={iconChevronDown} {...props} />
}
export function UserIcon(props: IconProps) {
  return <Icon src={iconUser} {...props} />
}
export function LockIcon(props: IconProps) {
  return <Icon src={iconLock} {...props} />
}
export function CloseCircleIcon(props: IconProps) {
  return <MaskIcon src={iconCloseCircle} {...props} />
}
export function ExternalLinkIcon(props: IconProps) {
  return <MaskIcon src={iconExternalLink} {...props} />
}
export function ArrowRightIcon(props: IconProps) {
  return <MaskIcon src={iconArrowRight} {...props} />
}
