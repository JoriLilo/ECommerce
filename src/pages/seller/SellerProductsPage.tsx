import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyProducts, deleteProduct } from '../../services/productService'
import SearchInput from '../../components/ui/SearchInput'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'
import type { Product } from '../../types/product'
import Button from '../../components/ui/Button'

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [refreshCount, setRefreshCount] = useState(0)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      setLoading(true)
      setError(null)
      try {
        const result = await getMyProducts()
        if (!cancelled) setProducts(result)
      } catch (error) {
        if (!cancelled)
          setError(error instanceof Error ? error.message : 'Could not load products.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadProducts()
    return () => {
      cancelled = true
    }
  }, [refreshCount])

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this product?')) return
    setError(null)
    try {
      setDeletingId(id)
      await deleteProduct(id)
      setProducts(products.filter((product) => product.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete product.')
    } finally {
      setDeletingId(null)
    }
  }

  const visible = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <h1>My Products</h1>
      <div className="seller-actions">
        <Link className="btn btn-primary" to="/seller/products/new">
          Add Product
        </Link>
        <button
          className="btn"
          disabled={loading}
          onClick={() => setRefreshCount(refreshCount + 1)}
        >
          Refresh products
        </button>
      </div>
      <SearchInput value={search} onChange={setSearch} />
      <ErrorMessage message={error} />
      {loading && <p role="status">Loading products…</p>}
      {!loading &&
        !error &&
        (visible.length === 0 ? (
          <EmptyState message="No products found. Add a product to get started." />
        ) : (
          <div className="seller-stats">
            {visible.map((product) => (
              <article key={product.id} className="seller-panel">
                {product.images[0] && (
                  <img
                    className="seller-product-image"
                    src={product.images[0]}
                    alt={product.name}
                  />
                )}
                <h2>{product.name}</h2>
                <StatusBadge status={product.productStatus} />
                <p>
                  ${product.price.toFixed(2)} · Stock: {product.quantity}
                </p>
                <div className="seller-actions">
                  <Link to={`/seller/products/${product.id}/edit`}>Edit</Link>
                  <Button
                    disabled={deletingId !== null}
                    variant="danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ))}
    </div>
  )
}
