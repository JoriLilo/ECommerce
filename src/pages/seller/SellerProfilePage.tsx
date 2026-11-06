import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { getSellerProfile, updateSellerProfile } from '../../services/sellerService'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function SellerProfilePage() {
  const [nipt, setNipt] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getSellerProfile()
        if (!cancelled) {
          setNipt(data.nipt)
          setPhone(data.businessPhone ?? '')
          setAddress(data.businessAddress ?? '')
          setLoaded(true)
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Could not load profile.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage('')
    try {
      const data = await updateSellerProfile({
        nipt,
        businessPhone: phone.trim(),
        businessAddress: address.trim(),
      })
      setPhone(data.businessPhone ?? '')
      setAddress(data.businessAddress ?? '')
      setMessage('Business details saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p role="status">Loading profile…</p>
  return (
    <div>
      <h1>Seller Profile</h1>
      <ErrorMessage message={error} />
      {message && <p role="status">{message}</p>}
      {loaded && (
        <form onSubmit={save} className="checkout">
          <label htmlFor="seller-nipt" className="form-label">
            NIPT
          </label>
          <input id="seller-nipt" className="form-input" value={nipt} readOnly />
          <p>NIPT cannot be changed after seller approval.</p>
          <fieldset disabled={saving} style={{ border: 0, padding: 0 }}>
            <label htmlFor="business-phone" className="form-label">
              Business phone
            </label>
            <input
              id="business-phone"
              className="form-input"
              type="tel"
              required
              pattern="\+?[0-9]{8,15}"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <label htmlFor="business-address" className="form-label">
              Business address
            </label>
            <textarea
              id="business-address"
              className="form-input"
              value={address}
              maxLength={500}
              rows={3}
              onChange={(event) => setAddress(event.target.value)}
            />
            <button className="btn btn-primary">
              {saving ? 'Saving…' : 'Save business details'}
            </button>
          </fieldset>
        </form>
      )}
    </div>
  )
}
