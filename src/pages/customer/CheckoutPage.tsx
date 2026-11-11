import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCart from '../../hooks/useCart'
import { getAddresses } from '../../services/addressService'
import { cartTotal, notifyCartChanged } from '../../services/cartService'
import { createOrder } from '../../services/orderService'
import type { Address } from '../../types/address'
import ErrorMessage from '../../components/common/ErrorMessage'

// Loads delivery addresses and creates an order from the cart.
export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, loading, error: cartError } = useCart()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressId, setAddressId] = useState('')
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    async function loadAddresses() {
      try {
        const data = await getAddresses()
        if (!cancelled) {
          setAddresses(data)
          const selected = data.find((address) => address.defaultAddress) ?? data[0]
          if (selected) setAddressId(String(selected.id))
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Could not load addresses.')
      } finally {
        if (!cancelled) setLoadingAddresses(false)
      }
    }
    loadAddresses()
    return () => {
      cancelled = true
    }
  }, [])

  // Creates the order with the selected address, announces the cart change, and opens the result page.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving || !addressId) return
    setSaving(true)
    setError(null)
    try {
      const order = await createOrder(Number(addressId))
      navigate(`/payment/${order.id}`)
      notifyCartChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order.')
      setSaving(false)
    }
  }

  if (loading || loadingAddresses) return <p role="status">Loading checkout…</p>
  if (cartError) return <ErrorMessage message={cartError} />
  if (items.length === 0)
    return (
      <p>
        Your cart is empty. <Link to="/products">Browse products</Link>
      </p>
    )
  const selectedAddress = addresses.find((address) => address.id === Number(addressId))

  return (
    <form onSubmit={handleSubmit} className="checkout content-page">
      <h1>Checkout</h1>
     
      <ErrorMessage message={error} />
      <h2>Delivery address</h2>
      <Link to="/addresses">Add or edit your addresses</Link>
      {addresses.length === 0 ? (
        <p>Add a saved address before placing your order.</p>
      ) : (
        <>
          <label htmlFor="checkout-address">Choose a delivery address</label>
          <select
            id="checkout-address"
            className="form-input"
            value={addressId}
            disabled={saving}
            required
            onChange={(event) => setAddressId(event.target.value)}
          >
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.street}, {address.city}
              </option>
            ))}
          </select>
          {selectedAddress && (
            <p>
              {selectedAddress.phone} · {selectedAddress.street}, {selectedAddress.city},{' '}
              {selectedAddress.country} {selectedAddress.postalCode}
            </p>
          )}
        </>
      )}
      <h2>Summary</h2>
      {items.map((item) => (
        <p key={item.id}>
          {item.quantity} × {item.productName}
        </p>
      ))}
      <h3>Total: ${cartTotal(items).toFixed(2)}</h3>
      <button className="btn-primary" disabled={saving || !selectedAddress}>
        {saving ? 'Placing order…' : 'Place order'}
      </button>
    </form>
  )
}
