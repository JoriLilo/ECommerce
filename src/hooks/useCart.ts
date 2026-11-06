import { useEffect, useState } from 'react'
import { getCart } from '../services/cartService'
import { getUser } from '../utils/auth'
import type { CartItem } from '../types/cart'

export default function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = getUser()

  useEffect(() => {
    let cancelled = false
    async function loadCart() {
      if (user?.role !== 'CUSTOMER') {
        setItems([])
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const data = await getCart()
        if (!cancelled) setItems(data)
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Could not load cart.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadCart()
    window.addEventListener('cart-updated', loadCart)
    return () => {
      cancelled = true
      window.removeEventListener('cart-updated', loadCart)
    }
  }, [user?.id, user?.role])

  return { items, loading, error }
}
