import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  applyAsSeller,
  clearSellerDraft,
  getSellerDraft,
  getSellerProfile,
} from '../../services/sellerService'
import { getUser } from '../../utils/auth'
import type { SellerProfile } from '../../types/seller'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'
import '../../components/layout/SellerLayout.css'

// Shows the seller application status and supports retrying a saved draft.
export default function SellerApplicationStatusPage() {
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState(getSellerDraft)

  // Refreshes the application status and clears the local draft after success.
  async function checkStatus() {
    setLoading(true)
    setError(null)
    try {
      const loadedProfile = await getSellerProfile()
      setProfile(loadedProfile)
      clearSellerDraft()
      setDraft(null)
    } catch (error) {
      setProfile(null)
      setError(
        error instanceof Error ? error.message : 'Could not load your application.',
      )
    } finally {
      setLoading(false)
    }
  }

  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    async function loadProfile() {
      try {
        const loadedProfile = await getSellerProfile()
        if (!cancelled) {
          setProfile(loadedProfile)
          clearSellerDraft()
          setDraft(null)
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : 'Could not load your application.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    loadProfile()
    return () => {
      cancelled = true
    }
  }, [])

  // Retries submission using the locally saved application details.
  async function submitApplication() {
    if (!draft) return
    setLoading(true)
    setError(null)
    try {
      await applyAsSeller(draft)
      clearSellerDraft()
      setDraft(null)
      await checkStatus()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Could not submit your application. Your business details are saved in this browser.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="seller-area">
      <h1>Seller application</h1>
      {loading && <p role="status">Checking your application…</p>}
      <ErrorMessage message={error} />
      {error && (
        <p>
          If your session has expired, <Link to="/login">sign in again</Link>. Signing in
          does not submit a new application.
        </p>
      )}
      {profile && (
        <div className="seller-panel">
          <StatusBadge status={profile.status} />
          {profile.status === 'PENDING' && (
            <p>
              Your request is waiting for admin approval. You can start selling once it is
              approved.
            </p>
          )}
          {profile.status === 'REJECTED' && (
            <p>
              Your request was rejected.{' '}
              {profile.rejectionReason || 'Contact support for more information.'}
            </p>
          )}
          {profile.status === 'SUSPENDED' && (
            <p>Your seller access is suspended. Please contact support.</p>
          )}
          {profile.status === 'APPROVED' &&
            (getUser()?.role === 'SELLER' ? (
              <Link to="/seller/dashboard">Open seller dashboard</Link>
            ) : (
              <p>
                Your application is approved. Please sign out and sign in again to update
                your account access.
              </p>
            ))}
        </div>
      )}
      {draft && !profile && (
        <div className="seller-panel">
          <h2>Business details ready to submit</h2>
          <p>Store: {draft.storeName}</p>
          <p>NIPT: {draft.nipt}</p>
          <p>Your request has not been confirmed as submitted.</p>
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={submitApplication}
          >
            Submit seller request
          </button>
        </div>
      )}
      <div className="seller-actions">
        <button className="btn btn-primary" disabled={loading} onClick={checkStatus}>
          Refresh status
        </button>
        <Link to="/">Back to shopping</Link>
      </div>
    </section>
  )
}
