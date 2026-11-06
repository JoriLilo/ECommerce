import { useState } from 'react'
import { getSellerOrders, updateSellerOrderStatus } from '../../services/orderService'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/ui/Button'
import type { OrderStatus } from '../../types/order'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState(getSellerOrders)

  function setStatus(id: number, status: OrderStatus) {
    updateSellerOrderStatus(id, status)
    setOrders(getSellerOrders())
  }

  if (orders.length === 0) return <EmptyState message="No orders yet." />

  return (
    <div className="content-page">
      <h1>Orders</h1>
      {orders.map((sellerOrder) => (
        <div key={sellerOrder.id} className="card">
          <h3>
            Order part #{sellerOrder.id} <StatusBadge status={sellerOrder.status} />
          </h3>
          {sellerOrder.orderItems.map((item) => (
            <p key={item.id}>
              {item.quantity} x {item.productName}
            </p>
          ))}
          <Button
            onClick={() => setStatus(sellerOrder.id, 'PROCESSING')}
            disabled={sellerOrder.status !== 'PAID'}
          >
            Processing
          </Button>
          <Button
            onClick={() => setStatus(sellerOrder.id, 'SHIPPED')}
            disabled={sellerOrder.status !== 'PROCESSING'}
          >
            Shipped
          </Button>
        </div>
      ))}
    </div>
  )
}
