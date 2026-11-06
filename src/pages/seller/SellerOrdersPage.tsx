import { useEffect, useState } from 'react'
import { getSellerOrders, updateSellerOrderStatus } from '../../services/orderService'
import type { OrderStatus, SellerOrderDetails } from '../../types/order'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrderDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getSellerOrders()
        if (!cancelled) setOrders(data)
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Could not load orders.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function setStatus(id: number, status: OrderStatus) {
    setSaving(true)
    setError(null)
    try {
      await updateSellerOrderStatus(id, status)
      setOrders(await getSellerOrders())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update order.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p role="status">Loading orders…</p>
  return (
    <div className="content-page">
      <h1>Orders</h1>
      <ErrorMessage message={error} />
      {!error && orders.length === 0 && (
        <p>No orders yet. Unpaid orders are hidden by the backend.</p>
      )}
      {orders.map((order) => (
        <div key={order.id} className="card">
          <h2>
            Order #{order.orderId} · Part #{order.id}{' '}
            <StatusBadge status={order.status} />
          </h2>
          <p>
            {order.customerName} · {order.customerEmail}
          </p>
          <p>
            {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.country} · {order.shippingAddress.phone}
          </p>
          {order.items.map((item) => (
            <p key={item.id}>
              {item.quantity} × {item.productName}
            </p>
          ))}
          <p>Total: ${Number(order.subtotal).toFixed(2)}</p>
          <div className="page-actions">
            {order.status === 'PAID' && (
              <button
                className="btn"
                disabled={saving}
                onClick={() => setStatus(order.id, 'PROCESSING')}
              >
                Start processing
              </button>
            )}
            {order.status === 'PROCESSING' && (
              <button
                className="btn"
                disabled={saving}
                onClick={() => setStatus(order.id, 'SHIPPED')}
              >
                Mark shipped
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button
                className="btn"
                disabled={saving}
                onClick={() => setStatus(order.id, 'DELIVERED')}
              >
                Mark delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
