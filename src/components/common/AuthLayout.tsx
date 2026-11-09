import type { FormEvent, ReactNode } from 'react'

// Describes the values and callbacks accepted by this component.
interface AuthLayoutProps {
  topText: string
  title: ReactNode
  subtitle: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  footer: ReactNode
  children: ReactNode
}

// Provides the shared form layout for login and registration.
export default function AuthLayout({
  topText,
  title,
  subtitle,
  onSubmit,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-top" />
      <div className="auth-glow auth-glow-bottom" />

      <form onSubmit={onSubmit} className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">{topText}</p>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>

        {children}

        <p className="auth-footer">{footer}</p>
      </form>
    </div>
  )
}