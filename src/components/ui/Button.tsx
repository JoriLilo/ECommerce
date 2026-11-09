import type { ReactNode } from 'react'

// Describes the values and callbacks accepted by this component.
interface ButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'danger'
}

// Displays a reusable action button with a style variant and disabled state.
export default function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}