import useCart from '../../hooks/useCart'
import { Link } from 'react-router-dom'
import { updateQuantity, removeFromCart, cartTotal } from '../../services/cartService'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/ui/Button'
import QuantityInput from '../../components/ui/QuantityInput'

export default function CartPage() {
  const items = useCart()

  if (items.length === 0)
    return (
      <div className="content-page">
        <h1>Cart</h1>
        <EmptyState message="Your cart is empty." />
        <Link to="/products" className="btn btn-primary">
          Browse products
        </Link>
      </div>
    )

  return (
    <div className="content-page">
      <h1>Cart</h1>
      {items.map((item) => (
        <div key={item.id} className="row">
          <img src={item.product.images[0]} alt={item.product.name} className="row-img" />
          <span className="row-grow">
            {item.product.name} (${item.product.price.toFixed(2)})
          </span>
          <QuantityInput
            value={item.quantity}
            max={item.product.quantity}
            onChange={(q) => updateQuantity(item.product.id, q)}
          />
          <Button variant="danger" onClick={() => removeFromCart(item.product.id)}>
            Remove
          </Button>
        </div>
      ))}
      <h2>Total: ${cartTotal(items).toFixed(2)}</h2>
      <Link to="/checkout" className="btn btn-primary">
        Checkout
      </Link>
    </div>
  )
}
