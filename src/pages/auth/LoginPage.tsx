import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../../services/authService'
import { getSellerDraft } from '../../services/sellerService'
import { saveAuth } from '../../utils/auth'
import AuthLayout from '../../components/common/AuthLayout'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'
import SubmitButton from '../../components/ui/SubmitButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const session = await login({ email, password })
      saveAuth(session)
      if (session.user.role === 'ADMIN') {
        window.location.href = '/admin/dashboard'
      } else if (session.user.role === 'SELLER') {
        window.location.href = '/seller/dashboard'
      } else if (getSellerDraft()) {
        window.location.href = '/seller/application-status'
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Could not sign in.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      topText="Welcome back"
      title={
        <>
          Login<span className="auth-dot">.</span>
        </>
      }
      subtitle="Enter your credentials to access your account."
      onSubmit={handleSubmit}
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </>
      }
    >
      <FormField
        label="Email address"
        type="email"
        value={email}
        placeholder="you@example.com"
        onChange={setEmail}
      />
      <FormField
        label="Password"
        type="password"
        value={password}
        placeholder="Enter your password"
        onChange={setPassword}
      />
      <ErrorMessage message={error} />
      <SubmitButton loading={loading} text="Sign in" loadingText="Logging in..." />
    </AuthLayout>
  )
}
