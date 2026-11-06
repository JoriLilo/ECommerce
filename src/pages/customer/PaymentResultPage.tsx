import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getOrder } from '../../services/orderService'
import type { Order } from '../../types/order'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

export default function PaymentResultPage() {
  const [params] = useSearchParams()
  const orderId = Number(params.get('orderId'))
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setOrder(null)
      setError(null)
      try {
        if (!Number.isInteger(orderId) || orderId < 1)
          throw new Error('Invalid order ID.')
        const data = await getOrder(orderId)
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
  }, [orderId])

  if (loading) return <p role="status">Checking order…</p>
  return (
    <section className="content-page">
      <h1>{order ? `Order #${order.id}` : 'Order not found'}</h1>
      <ErrorMessage message={error} />
      {order && (
        <>
          <StatusBadge status={order.status} />
          <p>Your order is saved on the server.</p>
          {order.status === 'PAID' && (
            <p>
              Your payment has been received and your order is being processed.
            </p>
          )}
          <Link to={`/orders/${order.id}`} className="btn btn-primary">
            View order
          </Link>
        </>
      )}
      <div className="page-actions">
        <Link to="/products">Continue shopping</Link>
      </div>
    </section>
  )
}
