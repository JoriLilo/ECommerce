import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCart, updateQuantity, removeFromCart, cartTotal } from '../../services/cartService'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/ui/Button'
import QuantityInput from '../../components/ui/QuantityInput'
import type { CartItem } from '../../types/cart'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(getCart)

  if (items.length === 0) return <EmptyState message="Your cart is empty." />

  return (
    <div>
      <h1>Cart</h1>
      {items.map((i) => (
        <div key={i.id} className="row">
          <img src={i.product.images[0]} alt={i.product.name} className="row-img" />
          <span className="row-grow">{i.product.name} (${i.product.price.toFixed(2)})</span>
          <QuantityInput
            value={i.quantity}
            max={i.product.quantity}
            onChange={(q) => setItems(updateQuantity(i.product.id, q))}
          />
          <Button variant="danger" onClick={() => setItems(removeFromCart(i.product.id))}>
            Remove
          </Button>
        </div>
      ))}
      <h2>Total: ${cartTotal(items).toFixed(2)}</h2>
      <Link to="/checkout" className="btn btn-primary">Checkout</Link>
    </div>
  )
}