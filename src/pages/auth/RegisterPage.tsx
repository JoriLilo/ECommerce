import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../../services/authService'
import { saveAuth } from '../../utils/auth'
import type { Role } from '../../types/user'
import AuthLayout from '../../components/common/AuthLayout'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'
import SubmitButton from '../../components/common/SubmitButton'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('CUSTOMER')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    setError(null)

    register({ name, email, password, role })
      .then((data) => {
        saveAuth(data)
        window.location.href = '/'
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred.')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <AuthLayout
      topText="Join us"
      title={<>Register<span className="auth-dot">.</span></>}
      subtitle="Create an account to start shopping or selling."
      onSubmit={handleSubmit}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </>
      }
    >
      <FormField
        label="Full name"
        value={name}
        placeholder="Your name"
        onChange={setName}
      />
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
        placeholder="At least 8 characters"
        onChange={setPassword}
      />

      <div className="form-group">
        <label className="form-label">I want to</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="form-input"
        >
          <option value="CUSTOMER">Customer</option>
          <option value="SELLER">Seller</option>
        </select>
      </div>

      <ErrorMessage message={error} />
      <SubmitButton
        loading={loading}
        text="Register"
        loadingText="Creating account..."
      />
    </AuthLayout>
  )
}