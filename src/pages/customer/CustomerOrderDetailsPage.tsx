import { useParams } from 'react-router-dom'
import { getOrder } from '../../services/orderService'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function CustomerOrderDetailsPage() {
  const { id } = useParams()
  const order = getOrder(Number(id))
  if (!order) return <EmptyState message="Order not found." />

  const a = order.shippingAddress
  return (
    <div>
      <h1>Order #{order.id} <StatusBadge status={order.status} /></h1>
      <p>Ship to: {a.street}, {a.city}, {a.country} {a.postalCode}</p>
      {order.sellerOrders.map((s) => (
        <div key={s.id} className="card">
          <h3>{s.storeName} <StatusBadge status={s.status} /></h3>
          {s.orderItems.map((i) => (
            <p key={i.id}>{i.quantity} x {i.productName} (${i.price.toFixed(2)})</p>
          ))}
          <p>Subtotal: ${s.totalPrice.toFixed(2)}</p>
        </div>
      ))}
      <h2>Total: ${order.totalAmount.toFixed(2)}</h2>
    </div>
  )
}
