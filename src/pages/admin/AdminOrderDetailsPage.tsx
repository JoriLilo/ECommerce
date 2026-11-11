import OrderRefund from '../../features/refunds/OrderRefund'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAdminOrder } from '../../services/adminService'
import type { Order } from '../../types/order'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

// Loads and displays the selected order for an admin.
export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
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
        const data = await getAdminOrder(Number(id))
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

  async function refreshOrderAfterRefund() {
    const data = await getAdminOrder(Number(id))
    setOrder(data)
  }

  if (loading) return <p role="status">Loading order…</p>
  return (
    <section className="content-page">
      <Link to="/admin/orders">Back to all orders</Link>
      <ErrorMessage message={error} />
      {order && (
        <>
          <h1>
            Order #{order.id} <StatusBadge status={order.status} />
          </h1>
          <p>{new Date(order.createdOn).toLocaleString()}</p>
          <h2>Delivery address</h2>
          <p>
            {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.country} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.phone}</p>
          {order.sellerOrders.map((part) => (
            <article key={part.id} className="card">
              <h2>
                Seller #{part.sellerId} · Part #{part.id}
              </h2>
              <StatusBadge status={part.status} />
              {part.items.map((item) => (
                <p key={item.id}>
                  {item.quantity} × {item.productName} · $
                  {Number(item.lineTotal).toFixed(2)}
                </p>
              ))}
              <p>Subtotal: ${Number(part.subtotal).toFixed(2)}</p>
            </article>
          ))}
          <h2>Total: ${Number(order.totalAmount).toFixed(2)}</h2>
          <OrderRefund key={order.id} order={order} admin onRefresh={refreshOrderAfterRefund} />
        </>
      )}
    </section>
  )
}
