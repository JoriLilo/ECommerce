import { useEffect, useState } from 'react'
import type { Product } from '../../types/product'
import ErrorMessage from '../../components/common/ErrorMessage'
import { Link } from 'react-router-dom'
import { getMyProducts } from '../../services/productService'
import { getSellerOrders } from '../../services/orderService'
import { getUser } from '../../utils/auth'

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
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
  }, [])
  const orders = getSellerOrders()
  const activeOrders = orders.filter(
    (order) => order.status === 'PAID' || order.status === 'PROCESSING',
  )

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <p>Welcome, {getUser()?.fullName}. Manage your products and orders here.</p>
      <p className="seller-note">
        Products are saved on the server. Orders still use demo data in this browser.
      </p>
      <ErrorMessage message={error} />
      {loading && <p role="status">Loading products…</p>}
      {!loading && !error && (
        <div className="seller-stats">
          <div className="seller-panel">
            <h2>My Products</h2>
            <strong>{products.length}</strong>
          </div>
          <div className="seller-panel">
            <h2>Orders to prepare</h2>
            <strong>{activeOrders.length}</strong>
          </div>
          <div className="seller-panel">
            <h2>Out of stock</h2>
            <strong>{products.filter((product) => product.quantity === 0).length}</strong>
          </div>
        </div>
      )}
      <div className="seller-actions">
        <Link to="/seller/products/new">Add Product</Link>
        <Link to="/seller/products">Manage Products</Link>
        <Link to="/seller/orders">View Orders</Link>
      </div>
    </div>
  )
}
