import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminOrders } from '../../services/adminService'
import type { OrderSummary } from '../../types/order'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAdminOrders(page, status)
        if (!cancelled) {
          setOrders(data.content)
          setTotalPages(data.totalPages)
        }
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
  }, [page, status])

  return (
    <section className="content-page">
      <Link to="/admin/dashboard">Back to admin dashboard</Link>
      <h1>All Orders</h1>
      <label htmlFor="admin-order-status">Status</label>
      <select
        id="admin-order-status"
        className="form-input"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value)
          setPage(0)
        }}
      >
        <option value="">All statuses</option>
        <option value="PENDING_PAYMENT">Pending payment</option>
        <option value="PAID">Paid</option>
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="REFUNDED">Refunded</option>
      </select>
      <ErrorMessage message={error} />
      {loading && <p role="status">Loading orders…</p>}
      {!loading && !error && orders.length === 0 && <p>No matching orders.</p>}
      {!loading &&
        !error &&
        orders.map((order) => (
          <Link key={order.id} to={`/admin/orders/${order.id}`} className="row">
            <span className="row-grow">
              Order #{order.id} · {new Date(order.createdOn).toLocaleDateString()}
            </span>
            <span>${Number(order.totalAmount).toFixed(2)}</span>
            <StatusBadge status={order.status} />
          </Link>
        ))}
      <div className="page-actions">
        <button
          className="btn"
          disabled={loading || page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </span>
        <button
          className="btn"
          disabled={loading || page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  )
}
