import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getAdminProducts,
  approveProduct,
  rejectProduct,
} from '../../services/adminService'
import type { ProductResponse } from '../../types/product'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

// Lists products for moderation and handles approval or rejection.
export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [status, setStatus] = useState('PENDING')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [refreshCount, setRefreshCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  // Loads data for this view when the effect dependencies change.
  useEffect(() => {
    // Cleanup marks this effect as cancelled so pending results do not update its state.
    let cancelled = false
    // Loads all product pages and converts each response for display.
    async function loadProducts() {
      setLoading(true)
      setError(null)
      try {
        const result = await getAdminProducts(page, status)
        if (!cancelled) {
          setProducts(result.content)
          setTotalPages(result.totalPages)
        }
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
  }, [page, status, refreshCount])

  // Sends the moderation decision and triggers a reload of the product list.
  async function handleDecision(id: number, action: 'approve' | 'reject') {
    setSavingId(id)
    setError(null)
    setMessage('')
    try {
      if (action === 'approve') {
        await approveProduct(id)
        setMessage('Product approved. It can now appear in the shop.')
      } else {
        await rejectProduct(id)
        setMessage('Product rejected. It is hidden from the shop.')
      }
      setRefreshCount(refreshCount + 1)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not update product.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <section className="content-page">
      <Link to="/admin/dashboard">Back to admin dashboard</Link>
      <h1>Product approval</h1>
      <p>Review product details and images before publishing them.</p>
      <div className="seller-actions">
        <label htmlFor="product-status">Status</label>
        <select
          id="product-status"
          className="form-input"
          value={status}
          disabled={savingId !== null}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(0)
            setMessage('')
          }}
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button
          className="btn"
          disabled={loading || savingId !== null}
          onClick={() => setRefreshCount(refreshCount + 1)}
        >
          Refresh products
        </button>
      </div>
      <ErrorMessage message={error} />
      {message && <p role="status">{message}</p>}
      {loading && <p role="status">Loading products…</p>}
      {!loading && !error && products.length === 0 && (
        <p>No products with this status.</p>
      )}
      {!loading && (
        <div className="seller-stats">
          {products.map((product) => (
            <article className="seller-panel" key={product.id}>
              <h2>{product.name}</h2>
              <StatusBadge status={product.status} />
              <p>{product.description}</p>
              <p>
                Seller #{product.sellerId} · {product.categoryName}
              </p>
              <p>
                ${Number(product.price).toFixed(2)} · Stock: {product.quantity}
              </p>
              <div className="seller-image-list">
                {product.images.map((image) => (
                  <img
                    className="seller-product-image"
                    key={image.id}
                    src={image.url}
                    alt={product.name}
                  />
                ))}
              </div>
              {product.images.length === 0 && <p>No images uploaded.</p>}
              <div className="seller-actions">
                <button
                  className="btn btn-primary"
                  disabled={savingId !== null || product.status === 'APPROVED'}
                  onClick={() => handleDecision(product.id, 'approve')}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  disabled={savingId !== null || product.status === 'REJECTED'}
                  onClick={() => handleDecision(product.id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="seller-actions">
        <button
          className="btn"
          disabled={loading || savingId !== null || page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </span>
        <button
          className="btn"
          disabled={loading || savingId !== null || page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  )
}
