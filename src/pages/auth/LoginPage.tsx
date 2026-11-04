import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../../services/authService'
import { saveAuth } from '../../utils/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    login({ email, password })
      .then((data) => {
        saveAuth(data)
        if (data.user.role === 'ADMIN') {
          window.location.href = '/admin/dashboard'
        } else {
          window.location.href = '/'
        }
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
    <div className="auth-page">
      {/* Background decoration */}
      <div className="auth-glow auth-glow-top" />
      <div className="auth-glow auth-glow-bottom" />

      <form onSubmit={handleSubmit} className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <p className="auth-eyebrow">Welcome back</p>

          <h1 className="auth-title">
            Login<span className="auth-dot">.</span>
          </h1>

          <p className="auth-subtitle">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {/* Error */}
        {error && <p className="form-error">{error}</p>}

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Logging in...' : 'Sign in'}
        </button>

        {/* Register */}
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </p>
      </form>
    </div>
  )
}