import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'danger'
}

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