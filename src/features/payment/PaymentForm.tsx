import { useState } from 'react'
import type { FormEvent } from 'react'
import { PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import ErrorMessage from '../../components/common/ErrorMessage'

interface PaymentFormProps {
  orderId: number
}

export default function PaymentForm({ orderId }: PaymentFormProps) {

    //read the stripe objects from the parent provider
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

     //asking stripe to confirm payment 
      const result = await stripe.confirmPayment({
        //gives the payment information collected by Stripe fields
        elements,
        confirmParams: {
            //where to return the customer 
          return_url: returnUrl,
        },
        //avoids automatic redirect sepse disa payment methods bejne redirect to another webiste for example their bank to authorize payment
        //nuk i ben prevent all redirects.
        redirect: 'if_required',
      })


      if (result.error) {
        setError(result.error.message || 'Payment could not be completed.')
        setSubmitting(false)
      } else if (
        result.paymentIntent?.status === 'succeeded' ||
        result.paymentIntent?.status === 'processing'
      ) {
        // after checking results navigates to result page
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