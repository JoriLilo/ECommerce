import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import ErrorMessage from '../../components/common/ErrorMessage'

interface PaymentFormProps {
  orderId: number
}

export default function PaymentForm({ orderId }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!stripe || !elements || submitting) return

    setSubmitting(true)
    setError(null)

    const returnUrl =
      `${window.location.origin}/payment-result?orderId=${orderId}`

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: 'if_required',
      })

      if (result.error) {
        setError(result.error.message || 'Payment could not be completed.')
        setSubmitting(false)
      } else if (
        result.paymentIntent?.status === 'succeeded' ||
        result.paymentIntent?.status === 'processing'
      ) {
        // The result page checks the order status saved by the backend.
        window.location.assign(returnUrl)
      } else {
        setError('Payment is not complete. Please check your payment details.')
        setSubmitting(false)
      }
    } catch {
      setError(
        'Could not confirm the payment. Check its status before trying again.',
      )
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        disabled={submitting}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <PaymentElement />

        <ErrorMessage message={error} />

        <button
          type="submit"
          className="btn-primary"
          disabled={!stripe || !elements || submitting}
        >
          {submitting ? 'Processing payment…' : 'Pay now'}
        </button>
      </fieldset>
    </form>
  )
}