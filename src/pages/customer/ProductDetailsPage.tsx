import ProductGallery from '../../features/products/ProductGallery'
import ProductReviews from '../../features/products/ProductReviews'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '../../services/productService'
import { addToCart } from '../../services/cartService'
import { getUser } from '../../utils/auth'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/ui/Button'
import QuantityInput from '../../components/ui/QuantityInput'
import type { Product } from '../../types/product'

// Loads one product and lets a customer choose a quantity to add to the cart.
export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [adding, setAdding] = useState(false)

  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    async function loadProduct() {
      setLoading(true)
      setProduct(null)
      setError(null)
      setQuantity(1)
      setMessage('')
      try {
        const loadedProduct = await getProduct(Number(id))
        if (!cancelled) {
          setProduct(loadedProduct ?? null)
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : 'Could not load product.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    loadProduct()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <Loading />
  if (error && !product) return <ErrorMessage message={error} />
  if (!product || product.productStatus !== 'APPROVED')
    return <EmptyState message="Product not found." />

  // Checks the current customer restriction and sends the selected quantity to the cart.
  async function handleAdd() {
    if (!product) {
      return
    }
    if (!getUser()) {
      navigate('/login')
      return
    }
    if (adding) return
    setAdding(true)
    setMessage('')
    setError(null)
    try {
      await addToCart(product, quantity)
      setMessage('Added to cart')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add product.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="content-page">
      <Link to="/products" className="text-link">
        ← Back to products
      </Link>
      <div className="details">
        <ProductGallery key={product.id} images={product.images} name={product.name} />
        <div>
          <h1>{product.name}</h1>
          <p className="product-store">
            {product.category.name} · {product.storeName}
          </p>
          <p>{product.description}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          {product.quantity === 0 ? (
            <p>Out of stock</p>
          ) : (
            <>
              <QuantityInput
                value={quantity}
                max={product.quantity}
                onChange={setQuantity}
              />
              <Button onClick={handleAdd} disabled={adding}>
                {adding ? 'Adding…' : 'Add to cart'}
              </Button>
            </>
          )}
          <ErrorMessage message={error} />
          {message && (
            <p role="status">
              {message} ·{' '}
              <Link to="/cart" className="text-link">
                View cart
              </Link>
            </p>
          )}
        </div>
      </div>
      <ProductReviews key={product.id} productId={product.id} />
    </div>
  )
}
