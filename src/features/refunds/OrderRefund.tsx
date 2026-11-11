import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '../../types/order'
import type { Refund } from '../../types/refund'
import { canRefund, initiateRefund } from '../../services/refundService'
import './Refunds.css'

interface Props {
  order: Order
  admin?: boolean
  onRefresh: () => Promise<void>
}

// Initiates a real refund directly;
export default function OrderRefund({ order, admin = false, onRefresh }: Props) {

  const [target, setTarget] = useState('')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<Refund | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const locked = useRef(false)
  const options = []


  for (const part of order.sellerOrders) {
    if (canRefund(part.status)) {
      options.push(<option key={part.id} value={part.id}>Seller #{part.sellerId} · Part #{part.id} · {Number(part.subtotal).toFixed(2)}</option>)
    }
  }
  function handleTarget(event: ChangeEvent<HTMLSelectElement>) { setTarget(event.target.value) }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (locked.current || attempted || options.length === 0) return
    const description = target ? `seller order #${target}` : `the remaining refundable amount of order #${order.id}`
    if (!window.confirm(`Initiate a refund for ${description}? This contacts the payment provider immediately; it does not request admin approval.`)) return
    locked.current = true
    setSaving(true)
    setError(null)
    setAttempted(true)
    try {
      const refund = await initiateRefund(order.id, target ? Number(target) : null, admin)
      setResult(refund)
      try {
        await onRefresh()
      } catch {
        setError('The refund response was received, but order details could not be refreshed. Check refund history before taking further action.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not confirm the refund outcome.')
    } finally {
      locked.current = false
      setSaving(false)
    }
  }

  if (options.length === 0 && !attempted) return null
  const history = admin ? '/admin/refunds' : '/refunds'
  return (
    <section className="refund-panel" aria-label="Order refund">
      <h2>Refund this order</h2>
      
      {!attempted && <form onSubmit={handleSubmit}>
        <label htmlFor="refund-target">What would you like to refund?</label>
        <select id="refund-target" value={target} onChange={handleTarget} disabled={saving}>
          <option value="">Select Seller</option>
          {options}
        </select>
        <button type="submit" disabled={saving}>{saving ? 'Initiating refund…' : 'Initiate refund'}</button>
      </form>}
      {result && <div role="status">
        <p>Refund #{result.id} · Amount: {Number(result.amount).toFixed(2)} · Status: {result.status}</p>
        <p>{result.status === 'SUCCEEDED' ? 'The payment provider reports the refund succeeded. Bank posting times may vary.' : 
        result.status === 'PENDING' ? 'The refund is pending.' : 
        'The refund failed. Contact support before attempting another refund.'}</p>
      </div>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {attempted && !result}
      <Link to={history}>View refund history</Link>
    </section>
  )
}
