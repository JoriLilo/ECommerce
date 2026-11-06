import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { createStore, getMyStore, updateStore } from '../../services/storeService'
import type { Store } from '../../types/seller'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function MyStorePage() {
  const [store, setStore] = useState<Store | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getMyStore()
        if (!cancelled) {
          setStore(data)
          setName(data?.name ?? '')
          setDescription(data?.description ?? '')
          setLoaded(true)
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Could not load store.')
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
      if (!name.trim()) throw new Error('Enter a store name.')
      let savedStore: Store
      if (store) savedStore = await updateStore(name, description)
      else savedStore = await createStore(name, description)
      setStore(savedStore)
      setName(savedStore.name)
      setDescription(savedStore.description)
      setMessage('Store saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save store.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p role="status">Loading store…</p>
  return (
    <div>
      <h1>My Store</h1>
      <ErrorMessage message={error} />
      {message && <p role="status">{message}</p>}
      {loaded && (
        <>
          <p>
            {store
              ? 'Update your store details.'
              : 'Create your store to give customers a page to visit.'}
          </p>
          <form onSubmit={save} className="checkout">
            <fieldset disabled={saving} style={{ border: 0, padding: 0 }}>
              <label htmlFor="store-name" className="form-label">
                Store name
              </label>
              <input
                id="store-name"
                className="form-input"
                value={name}
                maxLength={150}
                required
                onChange={(event) => setName(event.target.value)}
              />
              <label htmlFor="store-description" className="form-label">
                Description
              </label>
              <textarea
                id="store-description"
                className="form-input"
                value={description}
                maxLength={1000}
                rows={4}
                onChange={(event) => setDescription(event.target.value)}
              />
              <button className="btn btn-primary">
                {saving ? 'Saving…' : 'Save store'}
              </button>
            </fieldset>
          </form>
          {store && (
            <p>
              <Link to={`/stores/${store.id}`}>View your public store</Link> — share that
              page with your customers.
            </p>
          )}
        </>
      )}
    </div>
  )
}
