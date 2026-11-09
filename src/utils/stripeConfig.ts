// Reads the public Stripe key from Vite environment variables.
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

export default { publishableKey }
