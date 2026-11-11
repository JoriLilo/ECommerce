import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../components/common/AuthLayout'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'
import SubmitButton from '../../components/ui/SubmitButton'
import { resetPassword } from '../../services/passwordResetService'
import './PasswordReset.css'

// Expects an email link to /reset-password?token=...; confirm this with the backend.
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading || complete || !token.trim()) return
    // Matches the password checks currently used by the registration page.
    if (password.length < 8 || password.length > 72 ||
      !/[A-Z]/.test(password) || !/[0-9]/.test(password) ||
      !/[^a-zA-Z0-9\s]/.test(password) || /\s/.test(password)) {
      setError('Use 8–72 characters, an uppercase letter, a number, a special character, and no spaces.')
      return
    }
    if (password !== confirmation) {
      setError('The passwords do not match.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await resetPassword(token, password)
      setPassword('')
      setConfirmation('')
      setComplete(true)
      // Remove the used reset token from the visible URL.
      window.history.replaceState(window.history.state, '', window.location.pathname)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset your password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout topText="Account recovery" title="Set a new password"
      subtitle="Choose a new password for your account."
      onSubmit={handleSubmit}
      footer={<Link to="/login" className="auth-link">Back to login</Link>}
    >
      {complete ? (
        <div className="password-reset-notice" role="status">
          Your password has been reset. You can now sign in with your new password.
        </div>
      ) : !token.trim() ? (
        <div className="password-reset-notice" role="alert">
          <p>This reset link is missing its token.</p>
          <Link to="/forgot-password" className="auth-link">Request a new link</Link>
        </div>
      ) : (
        <fieldset className="password-reset-fields" disabled={loading}>
          <FormField label="New password" type="password" value={password}
            placeholder="Enter your new password" onChange={setPassword} />
          <FormField label="Confirm new password" type="password" value={confirmation}
            placeholder="Enter it again" onChange={setConfirmation} />
          <p className="password-reset-hint">Use 8–72 characters, an uppercase letter, a number, a special character, and no spaces.</p>
          <ErrorMessage message={error} />
          {error && <p><Link to="/forgot-password" className="auth-link">Request a new reset link</Link></p>}
          <SubmitButton loading={loading} text="Reset password" loadingText="Resetting password…" />
        </fieldset>
      )}
    </AuthLayout>
  )
}
