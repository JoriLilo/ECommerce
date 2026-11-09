import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../services/addressService'
import type { AddressInput } from '../../services/addressService'
import type { Address } from '../../types/address'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'

const emptyAddress: AddressInput = {
  phone: '', street: '', city: '', country: '', postalCode: '', defaultAddress: false,
}

// Lists saved addresses and provides a form for adding or editing them.
export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState<AddressInput>(emptyAddress)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    async function load() {
      try {
        const data = await getAddresses()
        if (!cancelled) setAddresses(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load addresses.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Clears the form values and exits editing mode.
  function resetForm() {
    setForm(emptyAddress)
    setEditingId(null)
  }

  // Creates or updates the address, resets the form, and reloads the list.
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editingId === null) await createAddress(form)
      else await updateAddress(editingId, form)
      resetForm()
      setAddresses(await getAddresses())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save address.')
    } finally {
      setSaving(false)
    }
  }

  // Copies the selected address into the form for editing.
  function edit(address: Address) {
    setEditingId(address.id)
    setForm({ phone: address.phone, street: address.street, city: address.city,
      country: address.country, postalCode: address.postalCode, defaultAddress: address.defaultAddress })
  }

  // Requests deletion and refreshes the displayed list.
  async function remove(id: number) {
    if (!window.confirm('Delete this address?')) return
    setSaving(true)
    setError(null)
    try {
      await deleteAddress(id)
      if (editingId === id) resetForm()
      setAddresses(await getAddresses())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete address.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="content-page">
      <Link to="/profile">Back to profile</Link>
      <h1>My addresses</h1>
      <ErrorMessage message={error} />
      {loading && <p role="status">Loading addresses…</p>}
      {!loading && !error && addresses.length === 0 && <p>No saved addresses yet.</p>}
      {addresses.map((address) => (
        <article key={address.id} className="card">
          <h2>{address.street}</h2>
          <p>{address.city}, {address.country}, {address.postalCode}</p>
          <p>{address.phone}{address.defaultAddress ? ' · Default address' : ''}</p>
          <div className="page-actions">
            <button className="btn" disabled={saving} onClick={() => edit(address)}>Edit</button>
            <button className="btn btn-danger" disabled={saving} onClick={() => remove(address.id)}>Delete</button>
          </div>
        </article>
      ))}
      <form onSubmit={save} className="checkout">
        <h2>{editingId === null ? 'Add address' : 'Edit address'}</h2>
        <fieldset disabled={saving} style={{ border: 0, padding: 0 }}>
          <FormField label="Phone" type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
          <FormField label="Street" value={form.street} onChange={(street) => setForm({ ...form, street })} />
          <FormField label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} />
          <FormField label="Country" value={form.country} onChange={(country) => setForm({ ...form, country })} />
          <FormField label="Postal code" value={form.postalCode} onChange={(postalCode) => setForm({ ...form, postalCode })} />
          <label><input type="checkbox" checked={form.defaultAddress} onChange={(event) => setForm({ ...form, defaultAddress: event.target.checked })} /> Default address</label>
        </fieldset>
        <div className="page-actions">
          <button className="btn btn-primary" disabled={saving || loading}>{saving ? 'Saving…' : 'Save address'}</button>
          {editingId !== null && <button type="button" className="btn" disabled={saving} onClick={resetForm}>Cancel edit</button>}
        </div>
      </form>
    </section>
  )
}
