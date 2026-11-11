import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { applyAsSeller, clearSellerDraft, getSellerDraft, getSellerProfile } from '../../services/sellerService'
import { getUser } from '../../utils/auth'
import type { SellerProfile } from '../../types/seller'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'
import '../../components/layout/SellerLayout.css'
import './SellerApplicationStatusPage.css'

// Lets customers create their first application or reapply after rejection.
export default function SellerApplicationStatusPage() {
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [draft, setDraft] = useState(getSellerDraft)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [missing, setMissing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nipt, setNipt] = useState(draft?.nipt ?? '')
  const [phone, setPhone] = useState(draft?.businessPhone ?? '')
  const [address, setAddress] = useState(draft?.businessAddress ?? '')
  const user = getUser()

  // Only the backend's specific not-found message enables a first application.
  // Authentication and server failures must remain errors, not empty states.
  function isMissingApplication(err: unknown) {
    return err instanceof Error && err.message === 'Seller application not found'
  }

  useEffect(function loadApplicationEffect() {
    let cancelled = false
    async function load() {
      try {
        const data = await getSellerProfile()
        if (!cancelled) {
          setProfile(data)
          clearSellerDraft()
          setDraft(null)
        }
      } catch (err) {
        if (!cancelled) {
          if (isMissingApplication(err)) setMissing(true)
          else setError(err instanceof Error ? err.message : 'Could not load your application.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return function cleanup() { cancelled = true }
  }, [])

  async function checkStatus() {
    setLoading(true)
    setError(null)
    setEditing(false)
    try {
      const data = await getSellerProfile()
      setProfile(data)
      setMissing(false)
      clearSellerDraft()
      setDraft(null)
    } catch (err) {
      if (isMissingApplication(err)) {
        setProfile(null)
        setMissing(true)
      } else {
        setMissing(false)
        setError(err instanceof Error ? err.message : 'Could not load your application.')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleCreate() {
    setNipt(profile?.nipt ?? draft?.nipt ?? '')
    setPhone(profile?.businessPhone ?? draft?.businessPhone ?? '')
    setAddress(profile?.businessAddress ?? draft?.businessAddress ?? '')
    setError(null)
    setEditing(true)
  }

  function handleCancel() { setEditing(false); setError(null) }
  function handleNipt(event: ChangeEvent<HTMLInputElement>) { setNipt(event.target.value) }
  function handlePhone(event: ChangeEvent<HTMLInputElement>) { setPhone(event.target.value) }
  function handleAddress(event: ChangeEvent<HTMLTextAreaElement>) { setAddress(event.target.value) }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving || loading) return
    setError(null)
    if (!nipt.trim() || nipt.trim().length > 50) {
      setError('Enter a NIPT of up to 50 characters.')
      return
    }
    if (!/^\+?[0-9]{8,15}$/.test(phone.trim())) {
      setError('Enter a business phone with 8–15 digits and an optional leading +.')
      return
    }
    setSaving(true)
    try {
      const data = await applyAsSeller({
        nipt: nipt.trim(), businessPhone: phone.trim(), businessAddress: address.trim(),
        // Store creation is a separate step after approval; these are not submitted.
        storeName: draft?.storeName ?? '', storeDescription: draft?.storeDescription ?? '',
      })
      setProfile(data)
      setMissing(false)
      setEditing(false)
      clearSellerDraft()
      setDraft(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your application. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const canApply = user?.role === 'CUSTOMER' && (missing || profile?.status === 'REJECTED')

  return (
    <section className="seller-area application-page">
      <header className="application-header">
        <p className="application-eyebrow">YOUR SELLER JOURNEY</p>
        <h1>Start selling with ViaBuy.</h1>
        <p>Turn your business into your next opportunity. Submit your details and we’ll review your application.</p>
      </header>
      {loading && <p role="status">Checking your application…</p>}
      <ErrorMessage message={error} />
      {!loading && profile && (
        <div className="seller-panel application-status" role="status">
          <StatusBadge status={profile.status} />
          {profile.status === 'PENDING' && <p>Your application is waiting for admin approval.</p>}
          {profile.status === 'REJECTED' && <p>Your application was rejected. {profile.rejectionReason} You can update your details and apply again.</p>}
          {profile.status === 'SUSPENDED' && <p>Your seller access is suspended. Please contact support.</p>}
          {profile.status === 'APPROVED' && (
            user?.role === 'SELLER' ? <Link to="/seller/dashboard">Open seller dashboard</Link>
            : <p>Your application is approved. Sign out and sign in again to update your access.</p>
          )}
        </div>
      )}
      {!loading && canApply && !editing && (
        <div className="seller-panel application-intro">
          <span className="application-step">01 / GET STARTED</span>
          <h2>{profile ? 'Apply again' : 'Become a seller'}</h2>
          <p>Submit your business details for admin review. You can create a store after approval.</p>
          <ol className="application-steps">
            <li><span>01</span><div><h3>Tell us about your business</h3><p>Add your NIPT and contact information.</p></div></li>
            <li><span>02</span><div><h3>We review your application</h3><p>Follow your application status here.</p></div></li>
            <li><span>03</span><div><h3>Make your store yours</h3><p>Once approved, create your store and add products.</p></div></li>
          </ol>
          {draft && <p>Your saved business details will be filled in for you.</p>}
          <button className="application-primary" type="button" onClick={handleCreate}>
            {profile ? 'Create a new application' : 'Create application'}
          </button>
        </div>
      )}
      {!loading && canApply && editing && (
        <form className="application-form" onSubmit={handleSubmit}>
          <div className="application-form-heading">
            <span className="application-step">BUSINESS DETAILS</span>
            <h2>{profile ? 'New application' : 'Let’s meet your business.'}</h2>
            <p>All fields are required. Your application will be reviewed before seller access is granted.</p>
          </div>
          <fieldset disabled={saving}>
            <div className="application-fields">
            <div className="application-field">
            <label htmlFor="application-nipt">NIPT</label>
            <input id="application-nipt" value={nipt} onChange={handleNipt} maxLength={50} placeholder="Your business registration number" required />
            </div>
            <div className="application-field">
            <label htmlFor="application-phone">Business phone</label>
            <input id="application-phone" type="tel" value={phone} onChange={handlePhone}
              placeholder="+355…" pattern="\+?[0-9]{8,15}" required />
            </div>
            <div className="application-field application-field-wide">
            <label htmlFor="application-address">Business address</label>
            <textarea id="application-address" value={address} onChange={handleAddress} maxLength={500} required rows={3} placeholder="Street, building, city" />
            </div>
            </div>
            <div className="application-actions">
              <button className="application-primary" type="submit">{saving ? 'Submitting…' : 'Submit application'}</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </fieldset>
        </form>
      )}
      <div className="seller-actions application-footer">
        <button className="btn btn-primary" type="button" disabled={loading || saving} onClick={checkStatus}>Refresh status</button>
        <Link to="/">Back to shopping</Link>
      </div>
    </section>
  )
}
