import { Link } from 'react-router-dom'
import { getOrders } from '../../services/orderService'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function CustomerOrdersPage() {
  const orders = getOrders()
  if (orders.length === 0) return <EmptyState message="No orders yet." />

  return (
    <div>
      <h1>My Orders</h1>
      {orders.map((o) => (
        <Link key={o.id} to={`/orders/${o.id}`} className="row">
          <span className="row-grow">Order #{o.id} · {new Date(o.createdAt).toLocaleDateString()}</span>
          <span>${o.totalAmount.toFixed(2)}</span>
          <StatusBadge status={o.status} />
        </Link>
      ))}
    </div>
  )
}