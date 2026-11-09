import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cancelOrder, getOrder } from '../../services/orderService'
import type { Order } from '../../types/order'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

// Shows an order's details and offers cancellation when allowed by the page.
export default function CustomerOrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    async function load() {
      setLoading(true)
      setOrder(null)
      setError(null)
      try {
        const data = await getOrder(Number(id))
        if (!cancelled) setOrder(data)
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Could not load order.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  // Requests order cancellation and updates the displayed order.
  async function handleCancel() {
    if (!order || !window.confirm('Cancel this unpaid order?')) return
    setSaving(true)
    setError(null)
    try {
      setOrder(await cancelOrder(order.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel order.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p role="status">Loading order…</p>
  if (!order) return <ErrorMessage message={error || 'Order not found.'} />
  const address = order.shippingAddress
  return (
    <div className="content-page">
      <Link to="/orders">Back to My Orders</Link>
      <h1>
        Order #{order.id} <StatusBadge status={order.status} />
      </h1>
      <ErrorMessage message={error} />
      <p>
        Ship to: {address.street}, {address.city}, {address.country} {address.postalCode}
      </p>
      {order.status === 'PENDING_PAYMENT' && (
        <>
          <p>
            This order is awaiting payment. No payment is collected by this frontend yet.
          </p>
          <button className="btn btn-danger" disabled={saving} onClick={handleCancel}>
            {saving ? 'Cancelling…' : 'Cancel unpaid order'}
          </button>
        </>
      )}
      {order.sellerOrders.map((sellerOrder) => (
        <div key={sellerOrder.id} className="card">
          <h2>
            Seller #{sellerOrder.sellerId} <StatusBadge status={sellerOrder.status} />
          </h2>
          {sellerOrder.items.map((item) => (
            <p key={item.id}>
              {item.quantity} × {item.productName} (${Number(item.unitPrice).toFixed(2)})
            </p>
          ))}
          <p>Subtotal: ${Number(sellerOrder.subtotal).toFixed(2)}</p>
        </div>
      ))}
      <h2>Total: ${Number(order.totalAmount).toFixed(2)}</h2>
    </div>
  )
}
