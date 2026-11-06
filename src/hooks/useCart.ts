import { useEffect, useState } from 'react'
import { getCart } from '../services/cartService'

// A hook is a reusable function that uses React state or effects.

export default function useCart() {
  const [items, setItems] = useState(getCart)

  useEffect(() => {
    function refreshCart() {
      setItems(getCart())
    }
    window.addEventListener('cart-updated', refreshCart)
    window.addEventListener('storage', refreshCart)
    return () => {
      window.removeEventListener('cart-updated', refreshCart)
      window.removeEventListener('storage', refreshCart)
    }
  }, [])

  return items
}
