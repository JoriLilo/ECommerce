import { loadStripe } from '@stripe/stripe-js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHED_KEY || ''

if (!publishableKey) {
  throw new Error('Stripe publishable key is missing.')
}

export const stripePromise = loadStripe(publishableKey)