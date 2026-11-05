import { Link, useSearchParams } from 'react-router-dom'

export default function PaymentResultPage() {
  const [params] = useSearchParams()
  const success = params.get('status') === 'success'

  return (
    <div>
      <h1>{success ? 'Payment successful' : 'Payment failed'}</h1>
      {success && <p>Your order #{params.get('orderId')} is confirmed.</p>}
      <Link to={success ? '/orders' : '/checkout'} className="btn btn-primary">
        {success ? 'View my orders' : 'Try again'}
      </Link>
    </div>
  )
}