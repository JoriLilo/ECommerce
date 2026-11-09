import { useEffect, useState } from 'react'
import { getCart } from '../services/cartService'
import { getUser } from '../utils/auth'
import type { CartItem } from '../types/cart'

// Provides cart entries, loading status, and errors to components.
export default function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = getUser()

  // Loads initially and restarts when the user id or role changes.
  useEffect(() => {
    let cancelled = false

    async function loadCart() {
      // TODO: Support shopping for admins and sellers too.
      // Sellers must be prevented from buying their own products.
      if (user?.role !== 'CUSTOMER') {
        setItems([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Waits for the request without blocking the browser.
        const data = await getCart()

        // Ignore results belonging to a cleaned up effect.
        if (!cancelled) setItems(data)
      } catch (err) {
        // Ignore errors belonging to a cleaned up effect.
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : 'Could not load cart.'
          )
      } finally {
        // Stop loading after either success or failure.
        if (!cancelled) setLoading(false)
      }
    }

    loadCart()

    // Reload the cart after a successful cart change notification.
    window.addEventListener('cart-updated', loadCart)

    return () => {
      // Ignore pending results and stop listening for cart changes.
      // This does not abort the network request itself.
      cancelled = true
      window.removeEventListener('cart-updated', loadCart)
    }
  }, [user?.id, user?.role])

  return { items, loading, error }
}