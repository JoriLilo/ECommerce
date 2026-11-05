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
    <div>
      <h1>Orders</h1>
      {orders.map((s) => (
        <div key={s.id} className="card">
          <h3>Order part #{s.id} <StatusBadge status={s.status} /></h3>
          {s.orderItems.map((i) => (
            <p key={i.id}>{i.quantity} x {i.productName}</p>
          ))}
          <Button onClick={() => setStatus(s.id, 'PROCESSING')} disabled={s.status !== 'PAID'}>
            Processing
          </Button>
          <Button onClick={() => setStatus(s.id, 'SHIPPED')} disabled={s.status !== 'PROCESSING'}>
            Shipped
          </Button>
        </div>
      ))}
    </div>
  )
}