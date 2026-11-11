import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/common/AuthLayout'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'
import SubmitButton from '../../components/ui/SubmitButton'
import { requestPasswordReset } from '../../services/passwordResetService'
import './PasswordReset.css'

// Requests an email without revealing whether the address has an account.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading || sent) return
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not request a reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      topText="Account recovery"
      title="Forgot password?"
      subtitle="Enter your account email to request a password reset link."
      onSubmit={handleSubmit}
      footer={<Link to="/login" className="auth-link">Back to login</Link>}
    >
      {sent ? (
        <div className="password-reset-notice" role="status">
          <p>If an account exists for that email, you will receive a password reset link.</p>
          <p>Check your inbox and spam folder, then follow the link to choose a new password.</p>
        </div>
      ) : (
        <fieldset className="password-reset-fields" disabled={loading}>
          <FormField label="Email address" type="email" value={email}
            placeholder="you@example.com" onChange={setEmail} />
          <ErrorMessage message={error} />
          <SubmitButton loading={loading} text="Send reset link" loadingText="Requesting link…" />
        </fieldset>
      )}
    </AuthLayout>
  )
}
