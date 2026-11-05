import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../../services/productService'
import { addToCart } from '../../services/cartService'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/ui/Button'
import QuantityInput from '../../components/ui/QuantityInput'
import type { Product } from '../../types/product'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getProduct(Number(id))
      .then((p) => setProduct(p ?? null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (!product) return <EmptyState message="Product not found." />

  const handleAdd = () => {
    addToCart(product, quantity)
    setMessage('Added to cart')
  }

  return (
    <div className="details">
      <img src={product.images[0]} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p className="product-store">{product.category.name} · {product.storeName}</p>
        <p>{product.description}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        {product.quantity === 0 ? (
          <p>Out of stock</p>
        ) : (
          <>
            <QuantityInput value={quantity} max={product.quantity} onChange={setQuantity} />
            <Button onClick={handleAdd}>Add to cart</Button>
          </>
        )}
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}