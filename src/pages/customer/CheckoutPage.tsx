import useCart from '../../hooks/useCart'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartTotal, clearCart } from '../../services/cartService'
import { createOrder } from '../../services/orderService'
import FormField from '../../components/common/FormField'
import ErrorMessage from '../../components/common/ErrorMessage'
import SubmitButton from '../../components/ui/SubmitButton'
import EmptyState from '../../components/common/EmptyState'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCart()
  const [form, setForm] = useState({
    phone: '',
    street: '',
    city: '',
    country: '',
    postalCode: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (items.length === 0) return <EmptyState message="Your cart is empty." />

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      // Real flow: POST /checkout, then POST /payments/intent, then Stripe PaymentElement
      const order = createOrder(items, { id: 0, defaultAddress: false, ...form })
      clearCart()
      navigate(`/payment-result?status=success&orderId=${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="checkout content-page">
      <h1>Checkout</h1>
      <p className="page-subtitle">Demo checkout — no payment is collected.</p>
      <h2>Delivery address</h2>
      <FormField
        label="Phone"
        value={form.phone}
        onChange={(v) => setForm({ ...form, phone: v })}
      />
      <FormField
        label="Street"
        value={form.street}
        onChange={(v) => setForm({ ...form, street: v })}
      />
      <FormField
        label="City"
        value={form.city}
        onChange={(v) => setForm({ ...form, city: v })}
      />
      <FormField
        label="Country"
        value={form.country}
        onChange={(v) => setForm({ ...form, country: v })}
      />
      <FormField
        label="Postal code"
        value={form.postalCode}
        onChange={(v) => setForm({ ...form, postalCode: v })}
      />

      <h2>Summary</h2>
      {items.map((item) => (
        <p key={item.id}>
          {item.quantity} x {item.product.name}
        </p>
      ))}
      <h3>Total: ${cartTotal(items).toFixed(2)}</h3>

      <ErrorMessage message={error} />
      <SubmitButton
        loading={loading}
        text="Place demo order"
        loadingText="Processing..."
      />
    </form>
  )
}
