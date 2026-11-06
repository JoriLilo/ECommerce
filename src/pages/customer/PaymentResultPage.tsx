import { Link, useSearchParams } from 'react-router-dom'
import { getOrder } from '../../services/orderService'

export default function PaymentResultPage() {
  const [params] = useSearchParams()
  const order = getOrder(Number(params.get('orderId')))

  return (
    <section className="content-page">
      <h1>{order ? 'Demo order placed' : 'Order not found'}</h1>
      {order ? (
        <p>
          Your demo order #{order.id} has been saved in this browser. No payment was
          collected.
        </p>
      ) : (
        <p>We could not find an order for your account.</p>
      )}
      <div className="page-actions">
        {order && (
          <Link to={`/orders/${order.id}`} className="btn btn-primary">
            View order
          </Link>
        )}
        <Link to="/products" className="text-link">
          Continue shopping
        </Link>
      </div>
    </section>
  )
}
