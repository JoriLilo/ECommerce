import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../services/orderService'
import type { OrderSummary } from '../../types/order'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getOrders()
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

  if (loading) return <p role="status">Loading orders…</p>
  return (
    <div className="content-page">
      <h1>My Orders</h1>
      <ErrorMessage message={error} />
      {!error && orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((order) => (
        <Link key={order.id} to={`/orders/${order.id}`} className="row">
          <span className="row-grow">
            Order #{order.id} · {new Date(order.createdOn).toLocaleDateString()}
          </span>
          <span>${Number(order.totalAmount).toFixed(2)}</span>
          <StatusBadge status={order.status} />
        </Link>
      ))}
    </div>
  )
}
