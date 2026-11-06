import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../../services/authService'
import { saveAuth } from '../../utils/auth'
import {
  saveSellerDraft,
  applyAsSeller,
  clearSellerDraft,
} from '../../services/sellerService'
import AuthLayout from '../../components/common/AuthLayout'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'
import SubmitButton from '../../components/ui/SubmitButton'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'CUSTOMER' | 'SELLER'>('CUSTOMER')
  const [nipt, setNipt] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storeDescription, setStoreDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      password.length < 8 ||
      password.length > 72 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^a-zA-Z0-9\s]/.test(password) ||
      /\s/.test(password)
    ) {
      setError(
        'Password must be 8–72 characters, with an uppercase letter, number and special character, and no spaces.',
      )
      return
    }

    setLoading(true)
    setError(null)

    try {
      const session = await register({ fullName, email, password, role })
      saveAuth(session)
      if (role === 'SELLER') {
        const application = {
          nipt: nipt.trim(),
          businessPhone: businessPhone.trim(),
          businessAddress: businessAddress.trim(),
          storeName: storeName.trim(),
          storeDescription: storeDescription.trim(),
        }
        saveSellerDraft(application)
        try {
          await applyAsSeller(application)
          clearSellerDraft()
        } catch {
          window.location.href = '/seller/application-status'
          return
        }
        window.location.href = '/seller/application-status'
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Could not create your account.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      topText="Join us"
      title={
        <>
          Register<span className="auth-dot">.</span>
        </>
      }
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
      <div className="account-toggle" role="group" aria-label="Account type">
        <button
          type="button"
          aria-pressed={role === 'CUSTOMER'}
          onClick={() => setRole('CUSTOMER')}
        >
          Buyer
        </button>
        <button
          type="button"
          aria-pressed={role === 'SELLER'}
          onClick={() => setRole('SELLER')}
        >
          Seller
        </button>
      </div>
      <FormField
        label="Full name"
        value={fullName}
        placeholder="Your name"
        onChange={setFullName}
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
        placeholder="Uppercase letter, number and special character"
        onChange={setPassword}
      />

      {role === 'SELLER' && (
        <fieldset className="seller-business-fields">
          <legend>Business information</legend>
          <FormField label="NIPT" value={nipt} onChange={setNipt} />
          <FormField
            label="Business phone"
            type="tel"
            value={businessPhone}
            onChange={setBusinessPhone}
          />
          <FormField
            label="Business address"
            value={businessAddress}
            onChange={setBusinessAddress}
          />
          <FormField label="Store name" value={storeName} onChange={setStoreName} />
          <FormField
            label="Store description"
            value={storeDescription}
            onChange={setStoreDescription}
          />
          <p>Your seller application must be approved by an admin before you can sell.</p>
        </fieldset>
      )}

      <ErrorMessage message={error} />
      <SubmitButton
        loading={loading}
        text={role === 'SELLER' ? 'Create account and apply' : 'Register'}
        loadingText="Creating account..."
      />
    </AuthLayout>
  )
}
