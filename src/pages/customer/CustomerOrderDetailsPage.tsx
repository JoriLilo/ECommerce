import { useParams } from 'react-router-dom'
import { getOrder } from '../../services/orderService'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function CustomerOrderDetailsPage() {
  const { id } = useParams()
  const order = getOrder(Number(id))
  if (!order) return <EmptyState message="Order not found." />

  const address = order.shippingAddress
  return (
    <div className="content-page">
      <h1>
        Order #{order.id} <StatusBadge status={order.status} />
      </h1>
      <p>
        Ship to: {address.street}, {address.city}, {address.country} {address.postalCode}
      </p>
      {order.sellerOrders.map((sellerOrder) => (
        <div key={sellerOrder.id} className="card">
          <h3>
            {sellerOrder.storeName} <StatusBadge status={sellerOrder.status} />
          </h3>
          {sellerOrder.orderItems.map((item) => (
            <p key={item.id}>
              {item.quantity} x {item.productName} (${item.price.toFixed(2)})
            </p>
          ))}
          <p>Subtotal: ${sellerOrder.totalPrice.toFixed(2)}</p>
        </div>
      ))}
      <h2>Total: ${order.totalAmount.toFixed(2)}</h2>
    </div>
  )
}
