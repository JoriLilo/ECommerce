import { Link } from 'react-router-dom'
import { getOrders } from '../../services/orderService'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function CustomerOrdersPage() {
  const orders = getOrders()
  if (orders.length === 0) return <EmptyState message="No orders yet." />

  return (
    <div className="content-page">
      <h1>My Orders</h1>
      {orders.map((order) => (
        <Link key={order.id} to={`/orders/${order.id}`} className="row">
          <span className="row-grow">
            Order #{order.id} · {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span>${order.totalAmount.toFixed(2)}</span>
          <StatusBadge status={order.status} />
        </Link>
      ))}
    </div>
  )
}
