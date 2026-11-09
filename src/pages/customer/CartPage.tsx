import { useState } from 'react'
import { Link } from 'react-router-dom'
import useCart from '../../hooks/useCart'
import { updateQuantity, removeFromCart, cartTotal } from '../../services/cartService'
import ErrorMessage from '../../components/common/ErrorMessage'
import QuantityInput from '../../components/ui/QuantityInput'

// Displays cart entries and handles quantity changes or removal.
export default function CartPage() {
  const { items, loading, error } = useCart()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Removes the entry when quantity is put to 0 otherwise updates its quantity.
  async function changeItem(id: number, quantity?: number) {
    setSaving(true)
    setSaveError(null)
    try {
      if (quantity === undefined) await removeFromCart(id)
      else await updateQuantity(id, quantity)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not update cart.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p role="status">Loading cart…</p>
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="content-page">
      <h1>Cart</h1>
      <ErrorMessage message={saveError} />
      {items.length === 0 && (
        <p>
          Your cart is empty. <Link to="/products">Browse products</Link>
        </p>
      )}
      <fieldset disabled={saving} style={{ border: 0, padding: 0 }}>
        {items.map((item) => (
          <div key={item.id} className="row">
            <Link to={`/products/${item.productId}`} className="row-grow">
              {item.productName} (${Number(item.unitPrice).toFixed(2)})
            </Link>
            <QuantityInput
              value={item.quantity}
              max={item.availableStock}
              onChange={(quantity) => changeItem(item.id, quantity)}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => changeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </fieldset>
      {items.length > 0 && (
        <>
          <h2>Total: ${cartTotal(items).toFixed(2)}</h2>
          {!saving && (
            <Link to="/checkout" className="btn btn-primary">
              Checkout
            </Link>
          )}
        </>
      )}
    </div>
  )
}
